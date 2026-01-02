import AthletesTable from "../components/AthletesTable";
import athletesApi from "../services/athletes.api";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Modal from "@/shared/components/Modal";
import Loader from "@/shared/components/Loader";
import useDebounce from "@/shared/hooks/useDebounce";
import {
  ROUTES,
  MESSAGES,
  ESTAMENTO_FILTER_OPTIONS,
} from "@/app/config/constants";
import {
  Search,
  UserPlus,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AthletesListPage = () => {
  // Estado
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estamentoFilter, setEstamentoFilter] = useState("");

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Modal de confirmación
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    athlete: null,
    loading: false,
  });

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Obtiene la lista de deportistas
  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type_athlete: estamentoFilter || undefined,
      };

      const response = await athletesApi.getAll(params);

      setAthletes(response.data?.items || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.ATHLETE_LOAD);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, estamentoFilter]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Handlers
  const handleDeleteClick = (athlete) => {
    setDeleteModal({ isOpen: true, athlete, loading: false });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.athlete) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    const isCurrentlyActive = deleteModal.athlete.is_active;

    try {
      if (isCurrentlyActive) {
        // Desactivar deportista
        await athletesApi.desactivate(deleteModal.athlete.id);
        toast.success(MESSAGES.SUCCESS.ATHLETE_DEACTIVATED, {
          description: MESSAGES.SUCCESS.ATHLETE_DEACTIVATED_DESC(
            deleteModal.athlete.full_name
          ),
        });
      } else {
        // Activar deportista
        await athletesApi.activate(deleteModal.athlete.id);
        toast.success(MESSAGES.SUCCESS.ATHLETE_ACTIVATED, {
          description: MESSAGES.SUCCESS.ATHLETE_ACTIVATED_DESC(
            deleteModal.athlete.full_name
          ),
        });
      }
      setDeleteModal({ isOpen: false, athlete: null, loading: false });
      fetchAthletes();
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(
        isCurrentlyActive
          ? MESSAGES.ERROR.ATHLETE_DEACTIVATE
          : MESSAGES.ERROR.ATHLETE_ACTIVATE,
        { description: errorMessage }
      );
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, athlete: null, loading: false });
  };

  const handleCreate = () => navigate(ROUTES.INSCRIPTION_CREATE);
  const handleEdit = (athlete) =>
    navigate(ROUTES.INSCRIPTION_EDIT.replace(":id", athlete.id));
  const handleViewDetail = (athlete) =>
    navigate(ROUTES.ATHLETE_DETAIL.replace(":id", athlete.id));
  const handlePageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-8">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="bg-primary/10 p-1.5 rounded-lg">
                <Users size={16} />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Gestión de Atletas
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Deportistas del Club
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {pagination.total > 0
                ? `${pagination.total} deportistas registrados`
                : "Gestiona los deportistas de tu club"}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
            className="gap-2"
          >
            <UserPlus size={16} />
            Nuevo Deportista
          </Button>
        </div>

        {/* Filters Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-primary" />
              <span className="font-medium text-base-content text-sm">
                Filtros
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} className="text-base-content/50" />}
                />
              </div>
              <select
                value={estamentoFilter}
                onChange={(e) => setEstamentoFilter(e.target.value)}
                className="select select-bordered w-full bg-base-100"
              >
                {ESTAMENTO_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <AthletesTable
              athletes={athletes}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onViewDetail={handleViewDetail}
              loading={loading}
            />

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="flex items-center justify-between bg-base-100 px-4 py-3 rounded-xl border border-base-300">
                <div className="text-sm text-base-content/60">
                  Mostrando{" "}
                  <span className="font-medium text-base-content">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium text-base-content">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-base-content">
                    {pagination.total}
                  </span>{" "}
                  resultados
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm btn-ghost"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <div className="join">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum =
                        pagination.page <= 3 ? i + 1 : pagination.page + i - 2;
                      if (pageNum > totalPages || pageNum < 1) return null;
                      return (
                        <button
                          key={pageNum}
                          className={`join-item btn btn-sm ${
                            pagination.page === pageNum
                              ? "btn-primary"
                              : "btn-ghost"
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="btn btn-sm btn-ghost"
                    disabled={pagination.page >= totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Toggle Status Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          title={
            deleteModal.athlete?.is_active
              ? "Dar de baja a deportista"
              : "Activar deportista"
          }
        >
          <p className="text-base-content/70">
            {deleteModal.athlete?.is_active ? (
              <>
                ¿Estás seguro de dar de baja al deportista{" "}
                <strong className="text-base-content">
                  {deleteModal.athlete?.full_name}
                </strong>
                ? Esta acción marcará al deportista como inactivo.
              </>
            ) : (
              <>
                ¿Deseas activar nuevamente al deportista{" "}
                <strong className="text-base-content">
                  {deleteModal.athlete?.full_name}
                </strong>
                ? Podrá participar en actividades del club.
              </>
            )}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={handleDeleteCancel}
              disabled={deleteModal.loading}
            >
              Cancelar
            </Button>
            <Button
              variant={deleteModal.athlete?.is_active ? "danger" : "success"}
              onClick={handleDeleteConfirm}
              loading={deleteModal.loading}
            >
              {deleteModal.athlete?.is_active ? "Confirmar Baja" : "Activar"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AthletesListPage;
