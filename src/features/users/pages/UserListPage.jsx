/**
 * ==============================================
 * Página de Lista de Usuarios - Kallpa UNL
 * ==============================================
 * 
 * Muestra la lista de usuarios del sistema con
 * búsqueda, filtros y acciones CRUD.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Modal from '@/shared/components/Modal';
import Loader from '@/shared/components/Loader';
import usersApi from '../services/users.api';
import useDebounce from '@/shared/hooks/useDebounce';
import { ROUTES, MESSAGES } from '@/app/config/constants';

/**
 * UserListPage - Página de listado de usuarios
 * 
 * @returns {JSX.Element} Página de usuarios
 */
const UserListPage = () => {
  // ==============================================
  // ESTADO
  // ==============================================
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
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
  // CARGA DE DATOS
  // ==============================================
  
  /**
   * Obtiene la lista de usuarios
   */
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
      
      setUsers(response.data || response.items || response);
      setPagination((prev) => ({
        ...prev,
        total: response.total || response.length || 0,
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, roleFilter]);
  
  /**
   * Efecto para cargar usuarios
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // ==============================================
  // MANEJADORES
  // ==============================================
  
  /**
   * Navega a la página de crear usuario
   */
  const handleCreate = () => {
    navigate(ROUTES.USERS_CREATE);
  };
  
  /**
   * Navega a la página de editar usuario
   */
  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`);
  };
  
  /**
   * Abre el modal de confirmación de eliminación
   */
  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      user,
      loading: false,
    });
  };
  
  /**
   * Confirma y ejecuta la eliminación
   */
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
  
  /**
   * Cierra el modal de eliminación
   */
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null, loading: false });
  };
  
  /**
   * Maneja cambio de página
   */
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };
  
  // ==============================================
  // RENDER
  // ==============================================
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona los usuarios del sistema
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreate}
            className="mt-4 sm:mt-0"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo usuario
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Buscar por nombre, email o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* Filtro por rol */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="entrenador">Entrenador</option>
              <option value="deportista">Deportista</option>
              <option value="representante">Representante</option>
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
                    Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
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
            ¿Estás seguro de eliminar al usuario <strong>{deleteModal.user?.name}</strong>?
            Esta acción no se puede deshacer.
          </p>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
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
              Eliminar
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserListPage;
