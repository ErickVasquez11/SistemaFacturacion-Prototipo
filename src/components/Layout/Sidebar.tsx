import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  Archive, 
  FileText, 
  Shield, 
  Settings, 
  UserCog,
  LogOut,
  Receipt,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'sales', icon: ShoppingCart, label: 'Ventas', roles: ['admin', 'cashier'] },
    { id: 'clients', icon: Users, label: 'Clientes', roles: ['admin', 'cashier'] },
    { id: 'products', icon: Package, label: 'Productos', roles: ['admin', 'cashier'] },
    { id: 'inventory', icon: Archive, label: 'Inventario', roles: ['admin', 'cashier'] },
    { id: 'invoicing-history', icon: FileText, label: 'Historial facturación', roles: ['admin', 'cashier'] },
    { id: 'dte', icon: Receipt, label: 'DTE', roles: ['admin', 'cashier'] },
    { id: 'inventario-ia', icon: Brain, label: 'Gestión IA Inventarios', roles: ['admin', 'cashier'] },
    { id: 'permissions', icon: Shield, label: 'Permisos', roles: ['admin'] },
    { id: 'user-management', icon: UserCog, label: 'Administrar usuarios', roles: ['admin'] },
    { id: 'configuration', icon: Settings, label: 'Configuración', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-slate-700 text-white min-h-screen flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
            UA
          </div>
          <div>
            <p className="font-semibold">Usuario</p>
            <p className="text-sm text-slate-300">
              {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-600">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-2 py-3 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors rounded"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;