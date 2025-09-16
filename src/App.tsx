import React, { useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  Archive,
  FileText,
  Receipt,
  Brain,
  Menu,
  X,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { ToastProvider } from "./contexts/ToastContext";

import Login from "./components/Auth/Login";
import Toast from "./components/Common/Toast";

import SalesForm from "./components/Sales/SalesForm";
import ClientsModule from "./components/Clients/ClientsModule";
import ProductsModule from "./components/Products/ProductsModule";
import InventoryModule from "./components/Inventory/InventoryModule";
import InvoicingHistoryModule from "./components/History/InvoicingHistoryModule";
import PermissionsModule from "./components/Permissions/PermissionsModule";
import UserManagementModule from "./components/Users/UserManagementModule";
import DTEModule from "./components/DTE/DTEModule";
import { ConfigurationView } from "./components/ConfigurationView";
import InventoryAI from "./components/Inventory/InventoryAI";

// 🔹 Tipos
type ActiveSection =
  | "ventas"
  | "clientes"
  | "productos"
  | "inventario"
  | "historial"
  | "dte"
  | "inventory-ai"
  | "permisos"
  | "usuarios"
  | "configuracion";

// 🔹 Dashboard fusionado
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("ventas");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const role = (user?.role as "admin" | "cajero") || "cajero";

  // Secciones base
  const baseSections = [
    { id: "ventas" as ActiveSection, icon: ShoppingCart, label: "Ventas" },
    { id: "clientes" as ActiveSection, icon: Users, label: "Clientes" },
    { id: "productos" as ActiveSection, icon: Package, label: "Productos" },
    { id: "inventario" as ActiveSection, icon: Archive, label: "Inventario" },
    { id: "historial" as ActiveSection, icon: FileText, label: "Historial facturación" },
    { id: "dte" as ActiveSection, icon: Receipt, label: "DTE" },
    { id: "inventory-ai" as ActiveSection, icon: Brain, label: "Gestión Inteligente IA" },
  ];

  const adminExtra = [
    { id: "permisos" as ActiveSection, icon: Shield, label: "Permisos" },
    { id: "usuarios" as ActiveSection, icon: Users, label: "Administrar Usuarios" },
    { id: "configuracion" as ActiveSection, icon: Settings, label: "Configuración" },
  ];

  const menuItems = role === "admin" ? [...baseSections, ...adminExtra] : baseSections;

  const handleLogout = () => {
    logout?.();
  };

  const renderSection = () => {
    switch (activeSection) {
      case "ventas":
        return <SalesForm />;
      case "clientes":
        return <ClientsModule />;
      case "productos":
        return <ProductsModule />;
      case "inventario":
        return <InventoryModule />;
      case "historial":
        return <InvoicingHistoryModule />;
      case "dte":
        return <DTEModule />;
      case "inventory-ai":
        return <InventoryAI />;
      case "permisos":
        return role === "admin" ? <PermissionsModule /> : <AccessDenied />;
      case "usuarios":
        return role === "admin" ? <UserManagementModule /> : <AccessDenied />;
      case "configuracion":
        return role === "admin" ? <ConfigurationView /> : <AccessDenied />;
      default:
        return <SalesForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-slate-800 text-white transition-all duration-300 flex flex-col fixed top-0 left-0 h-full ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-lg font-semibold">Sistema de Facturación</h1>
                <p className="text-sm text-slate-400">Ministerio de Hacienda - El Salvador</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-700 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.[0] || "U"}
              </span>
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-medium">{user?.name || "Usuario"}</p>
                <p className="text-sm text-slate-400">
                  {role === "admin" ? "Administrador" : "Cajero"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isNewFeature = item.id === "inventory-ai";

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {isNewFeature && isSidebarOpen && (
                      <span className="absolute right-2 top-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        IA
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems.find((item) => item.id === activeSection)?.label}
            </h2>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{renderSection()}</main>
      </div>
    </div>
  );
};

// 🔹 Vista de acceso denegado
const AccessDenied = () => (
  <div className="p-8 text-center text-gray-500">Acceso denegado</div>
);

// 🔹 App con Providers
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated ? <Dashboard /> : <Login />}
      <Toast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
