import UserTable from "../components/UserTable";
import usersApi from "../services/users.api";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Modal from "@/shared/components/Modal";
import Loader from "@/shared/components/Loader";
import useDebounce from "@/shared/hooks/useDebounce";
import { ROUTES, MESSAGES } from "@/app/config/constants";
import { Search, UserPlus } from "lucide-react";
import { ROLE_OPTIONS } from "../../../app/config/roles";

const UserListPage = () => {
  // ESTADO
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Modal de confirmación
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null,
    loading: false,
  });

  // Navegación
  const navigate = useNavigate();

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ==============================================

  // Obtiene la lista de usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      };

      const response = await usersApi.getAll(params);

      console.log("Respuesta del backend:", response);

      setUsers(response.data?.items || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, roleFilter]);

  // Efecto para cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ==============================================

  // Navega a la página de crear usuario
  const handleCreate = () => {
    navigate(ROUTES.USERS_CREATE);
  };

  // Abre el modal de confirmación para eliminar usuario
  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      user,
      loading: false,
    });
  };

  // Confirma y ejecuta la eliminación
  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      await usersApi.delete(deleteModal.user.id);

      // Cerrar modal y recargar lista
      setDeleteModal({ isOpen: false, user: null, loading: false });
      fetchUsers();

      // TODO: Mostrar toast de éxito
    } catch (err) {
      setError(err.message);
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  //Cierra el modal de eliminación
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null, loading: false });
  };

  // Navega a la página de editar usuario
  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`);
  };

  // Maneja cambio de página
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <h1 className="text-xl font-semibold text-gray-900">
          Lista de usuarios del sistema
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          Gestiona los usuarios registrados en la plataforma desde esta sección.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-end sm:items-center mt-6 ">
        <Button
          variant="primary"
          onClick={handleCreate}
          className="mt-4 sm:mt-0"
        >
          <UserPlus size={20} />
          Agregar Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-base-100 shadow-md rounded-lg p-4 my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Buscar por nombre, email o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} className="text-gray-400" />}
            />
          </div>

          {/* Filtro por rol */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-primary"
          >
            <option value="">Todos los roles</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
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
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
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
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        title="Eliminar usuario"
      >
        <p className="text-gray-600">
          ¿Estás seguro de desactivar al usuario{" "}
          <strong>{deleteModal.user?.full_name}</strong>? Esta acción no se
          puede deshacer.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="accent"
            onClick={handleDeleteCancel}
            disabled={deleteModal.loading}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            loading={deleteModal.loading}
          >
            Desactivar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserListPage;
