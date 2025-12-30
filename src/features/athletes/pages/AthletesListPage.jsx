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
import { Search, UserPlus } from "lucide-react";

const AthletesListPage = () => {
  // ESTADO
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

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ==============================================

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

  // Efecto para cargar deportistas
  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  // ==============================================

  // Abre el modal de confirmación para dar de baja
  const handleDeactivateClick = (athlete) => {
    setDeactivateModal({
      isOpen: true,
      athlete,
      loading: false,
    });
  };

  // Confirma y ejecuta la baja
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

      // Cerrar modal y recargar lista
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

  // Cierra el modal de baja
  const handleDeactivateCancel = () => {
    setDeactivateModal({ isOpen: false, athlete: null, loading: false });
  };

  // Navega a crear deportista
  const handleCreate = () => {
    navigate(ROUTES.INSCRIPTION_CREATE);
  };

  // Navega a editar deportista
  const handleEdit = (athlete) => {
    navigate(ROUTES.INSCRIPTION_EDIT.replace(":id", athlete.id));
  };

  // Maneja cambio de página
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <h1 className="text-xl font-semibold text-gray-900">
          Lista de deportistas activos
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          Gestiona los deportistas de tu club desde esta sección.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-end sm:items-center mt-6">
        <Button
          variant="primary"
          onClick={handleCreate}
          className="mt-4 sm:mt-0"
        >
          <UserPlus size={20} />
          Agregar deportista
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-base-100 shadow-md rounded-lg p-4 my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} className="text-gray-400" />}
            />
          </div>

          {/* Filtro por categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-primary"
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

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          {/* Tabla */}
          <AthletesTable
            athletes={athletes}
            onEdit={handleEdit}
            onDeactivate={handleDeactivateClick}
            loading={loading}
          />

          {/* Paginación */}
          {pagination.total > pagination.limit && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Anterior
                </Button>

                <span className="text-sm text-gray-700">
                  Página {pagination.page} de{" "}
                  {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.limit)
                  }
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={deactivateModal.isOpen}
        onClose={handleDeactivateCancel}
        title="Dar de baja a deportista"
      >
        <p className="text-gray-600">
          ¿Estás seguro de dar de baja al deportista{" "}
          <strong>{deactivateModal.athlete?.full_name}</strong>? Esta acción
          marcará al deportista como inactivo.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="accent"
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
            Dar de Baja
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AthletesListPage;
