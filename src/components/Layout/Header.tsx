import React from 'react';
import { Calendar, Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sistema de Facturación Electrónica</h1>
              <p className="text-sm text-gray-600">Ministerio de Hacienda - El Salvador</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-800">Empresa SV</span>
            </div>
            <p className="text-sm text-gray-600 capitalize">{currentDate}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;