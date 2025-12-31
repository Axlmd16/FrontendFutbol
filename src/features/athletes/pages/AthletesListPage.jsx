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
import { ROUTES, MESSAGES } from "@/app/config/constants";
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
  const [categoryFilter, setCategoryFilter] = useState("");

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Modal de confirmación
  const [deactivateModal, setDeactivateModal] = useState({
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
        category: categoryFilter || undefined,
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
  }, [pagination.page, pagination.limit, debouncedSearch, categoryFilter]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // Handlers
  const handleDeactivateClick = (athlete) => {
    setDeactivateModal({ isOpen: true, athlete, loading: false });
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivateModal.athlete) return;

    setDeactivateModal((prev) => ({ ...prev, loading: true }));

    try {
      await athletesApi.desactivate(deactivateModal.athlete.id);
      toast.success(MESSAGES.SUCCESS.ATHLETE_DEACTIVATED, {
        description: MESSAGES.SUCCESS.ATHLETE_DEACTIVATED_DESC(
          deactivateModal.athlete.full_name
        ),
      });
      setDeactivateModal({ isOpen: false, athlete: null, loading: false });
      fetchAthletes();
    } catch (err) {
      const errorMessage = err.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(MESSAGES.ERROR.ATHLETE_DEACTIVATE, {
        description: errorMessage,
      });
      setDeactivateModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateModal({ isOpen: false, athlete: null, loading: false });
  };

  const handleCreate = () => navigate(ROUTES.INSCRIPTION_CREATE);
  const handleEdit = (athlete) =>
    navigate(ROUTES.INSCRIPTION_EDIT.replace(":id", athlete.id));
  const handlePageChange = (newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="h-full bg-white p-6 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Deportistas
            </h1>
            <p className="text-base-content/60 text-sm">
              {pagination.total > 0
                ? `${pagination.total} deportistas registrados`
                : "Gestiona los deportistas de tu club"}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          className="gap-2 shadow-lg"
        >
          <UserPlus size={18} />
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select select-bordered w-full bg-base-100"
            >
              <option value="">Todas las categorías</option>
              <option value="SUB10">SUB10</option>
              <option value="SUB12">SUB12</option>
              <option value="SUB14">SUB14</option>
              <option value="SUB16">SUB16</option>
              <option value="SUB18">SUB18</option>
              <option value="ADULTO">ADULTO</option>
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
            onDeactivate={handleDeactivateClick}
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

      {/* Deactivate Modal */}
      <Modal
        isOpen={deactivateModal.isOpen}
        onClose={handleDeactivateCancel}
        title="Dar de baja a deportista"
      >
        <p className="text-base-content/70">
          ¿Estás seguro de dar de baja al deportista{" "}
          <strong className="text-base-content">
            {deactivateModal.athlete?.full_name}
          </strong>
          ? Esta acción marcará al deportista como inactivo.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleDeactivateCancel}
            disabled={deactivateModal.loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeactivateConfirm}
            loading={deactivateModal.loading}
          >
            Confirmar Baja
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AthletesListPage;
