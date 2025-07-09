import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import SalesForm from './components/Sales/SalesForm';
import ClientsModule from './components/Clients/ClientsModule';
import ProductsModule from './components/Products/ProductsModule';
import InventoryModule from './components/Inventory/InventoryModule';
import InvoicingHistoryModule from './components/History/InvoicingHistoryModule';
import PermissionsModule from './components/Permissions/PermissionsModule';
import UserManagementModule from './components/Users/UserManagementModule';
import DTEModule from './components/DTE/DTEModule';
import Toast from './components/Common/Toast';
import { ConfigurationView } from './components/ConfigurationView';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState('sales');

  const renderSection = () => {
    switch (currentSection) {
      case 'sales':
        return <SalesForm />;
      case 'clients':
        return <ClientsModule />;
      case 'products':
        return <ProductsModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'invoicing-history':
        return <InvoicingHistoryModule />;
      case 'dte':
        return <DTEModule />;
      case 'permissions':
        return user?.role === 'admin' ? <PermissionsModule /> : 
          <div className="p-8 text-center text-gray-500">Acceso denegado</div>;
      case 'user-management':
        return user?.role === 'admin' ? <UserManagementModule /> : 
          <div className="p-8 text-center text-gray-500">Acceso denegado</div>;
      case 'configuration':
        return user?.role === 'admin' ? 
          <ConfigurationView /> : 
          <div className="p-8 text-center text-gray-500">Acceso denegado</div>;
      default:
        return <SalesForm />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

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