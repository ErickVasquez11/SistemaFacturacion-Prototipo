import React, { useState } from 'react';
import { Shield, Users, Edit2, Save, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Permission {
  id: string;
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: Permission[];
}

const PermissionsModule: React.FC = () => {
  const { addToast } = useToast();
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const modules = [
    { id: 'sales', name: 'Ventas' },
    { id: 'clients', name: 'Clientes' },
    { id: 'products', name: 'Productos' },
    { id: 'inventory', name: 'Inventario' },
    { id: 'invoicing-history', name: 'Historial de Facturación' },
    { id: 'dte', name: 'DTE' },
    { id: 'permissions', name: 'Permisos' },
    { id: 'user-management', name: 'Administrar Usuarios' },
    { id: 'configuration', name: 'Configuración' },
  ];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrador',
      permissions: modules.map(module => ({
        id: module.id,
        module: module.name,
        read: true,
        write: true,
        delete: true,
      }))
    },
    {
      id: 'cashier',
      name: 'cashier',
      displayName: 'Cajero',
      permissions: modules.map(module => ({
        id: module.id,
        module: module.name,
        read: ['permissions', 'user-management', 'configuration'].includes(module.id) ? false : true,
        write: ['permissions', 'user-management', 'configuration'].includes(module.id) ? false : true,
        delete: false,
      }))
    }
  ]);

  const handlePermissionChange = (roleId: string, moduleId: string, permissionType: 'read' | 'write' | 'delete', value: boolean) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.map(permission => {
            if (permission.id === moduleId) {
              return { ...permission, [permissionType]: value };
            }
            return permission;
          })
        };
      }
      return role;
    }));
  };

  const handleSaveRole = (roleId: string) => {
    setEditingRole(null);
    addToast({
      type: 'success',
      title: 'Permisos actualizados',
      message: 'Los permisos han sido guardados exitosamente'
    });
  };

  const handleCancelEdit = (roleId: string) => {
    setEditingRole(null);
    // Reset changes if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Permisos</h2>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Permisos por Rol</h3>
          <p className="text-gray-600">Configure los permisos de acceso para cada rol del sistema</p>
        </div>

        {roles.map(role => (
          <div key={role.id} className="mb-8 border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-800">{role.displayName}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  {editingRole === role.id ? (
                    <>
                      <button
                        onClick={() => handleSaveRole(role.id)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={() => handleCancelEdit(role.id)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingRole(role.id)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Módulo</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Leer</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Escribir</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {role.permissions.map(permission => (
                      <tr key={permission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {permission.module}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={permission.read}
                            onChange={(e) => handlePermissionChange(role.id, permission.id, 'read', e.target.checked)}
                            disabled={editingRole !== role.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={permission.write}
                            onChange={(e) => handlePermissionChange(role.id, permission.id, 'write', e.target.checked)}
                            disabled={editingRole !== role.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={permission.delete}
                            onChange={(e) => handlePermissionChange(role.id, permission.id, 'delete', e.target.checked)}
                            disabled={editingRole !== role.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsModule;