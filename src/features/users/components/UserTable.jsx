/**
 * ==============================================
 * Tabla de Usuarios - Kallpa UNL
 * ==============================================
 * 
 * Componente de tabla para mostrar lista de usuarios
 * con acciones de editar y eliminar.
 * 
 * @author Kallpa UNL Team
 * @version 1.0.0
 */

import PropTypes from 'prop-types';
import { ROLE_OPTIONS } from '@/app/config/roles';
import Button from '@/shared/components/Button';

/**
 * UserTable - Tabla de usuarios
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.users - Lista de usuarios
 * @param {Function} props.onEdit - Callback al editar
 * @param {Function} props.onDelete - Callback al eliminar
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Tabla de usuarios
 */
const UserTable = ({ users = [], onEdit, onDelete, loading = false }) => {
  // ==============================================
  // HELPERS
  // ==============================================
  
  /**
   * Obtiene la etiqueta del rol
   * @param {string} role - Código del rol
   * @returns {string} Etiqueta del rol
   */
  const getRoleLabel = (role) => {
    const roleOption = ROLE_OPTIONS.find((opt) => opt.value === role);
    return roleOption?.label || role;
  };
  
  /**
   * Obtiene el color del badge según el rol
   * @param {string} role - Código del rol
   * @returns {string} Clases de Tailwind para el badge
   */
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      entrenador: 'bg-blue-100 text-blue-800',
      deportista: 'bg-green-100 text-green-800',
      representante: 'bg-yellow-100 text-yellow-800',
      invitado: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };
  
  // ==============================================
  // RENDER - ESTADO VACÍO
  // ==============================================
  
  if (!loading && users.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando un nuevo usuario.
        </p>
      </div>
    );
  }
  
  // ==============================================
  // RENDER - TABLA
  // ==============================================
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Cabecera */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        
        {/* Cuerpo */}
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* Nombre y avatar */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || user.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                </div>
              </td>
              
              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              
              {/* Rol */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </td>
              
              {/* Estado */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              
              {/* Acciones */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Eliminar usuario"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validación de PropTypes
UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default UserTable;
