import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  FileText, 
  Shield, 
  Database, 
  Mail, 
  Printer, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';

export const ConfigurationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('empresa');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [companyData, setCompanyData] = useState({
    name: 'Mi Empresa S.A. de C.V.',
    nit: '0614-123456-123-4',
    nrc: '12345678',
    address: 'San Salvador, El Salvador',
    phone: '2234-5678',
    email: 'contacto@miempresa.com',
    website: 'www.miempresa.com',
    logo: ''
  });

  const [invoiceConfig, setInvoiceConfig] = useState({
    prefix: 'FAC',
    startNumber: '1',
    currentNumber: '1234',
    footer: 'Gracias por su compra',
    terms: 'Términos y condiciones aplicables',
    validityDays: '30'
  });

  const [taxConfig, setTaxConfig] = useState({
    ivaRate: '13',
    defaultTaxType: 'GRAVADO',
    retentionRate: '1'
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    username: 'sistema@miempresa.com',
    password: '',
    senderName: 'Sistema de Facturación'
  });

  const [systemConfig, setSystemConfig] = useState({
    language: 'es',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'America/El_Salvador',
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'facturacion', label: 'Facturación', icon: FileText },
    { id: 'impuestos', label: 'Impuestos', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sistema', label: 'Sistema', icon: Database }
  ];

  const renderCompanyTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Información de la Empresa</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Empresa *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.name}
              onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NIT *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.nit}
              onChange={(e) => setCompanyData({...companyData, nit: e.target.value})}
              placeholder="####-######-###-#"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NRC *</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.nrc}
              onChange={(e) => setCompanyData({...companyData, nrc: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.phone}
              onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.email}
              onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sitio Web</label>
            <input
              type="url"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={companyData.website}
              onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección Completa *</label>
          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-24 resize-none"
            value={companyData.address}
            onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo de la Empresa</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">Arrastra tu logo aquí o haz clic para seleccionar</p>
            <p className="text-sm text-gray-500">PNG, JPG hasta 2MB</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Seleccionar Archivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoiceTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-xl">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Configuración de Facturación</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prefijo de Factura</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              value={invoiceConfig.prefix}
              onChange={(e) => setInvoiceConfig({...invoiceConfig, prefix: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Número Inicial</label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              value={invoiceConfig.startNumber}
              onChange={(e) => setInvoiceConfig({...invoiceConfig, startNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Número Actual</label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              value={invoiceConfig.currentNumber}
              readOnly
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Días de Validez</label>
          <input
            type="number"
            className="w-full md:w-48 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            value={invoiceConfig.validityDays}
            onChange={(e) => setInvoiceConfig({...invoiceConfig, validityDays: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pie de Página</label>
          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 h-24 resize-none"
            value={invoiceConfig.footer}
            onChange={(e) => setInvoiceConfig({...invoiceConfig, footer: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Términos y Condiciones</label>
          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 h-32 resize-none"
            value={invoiceConfig.terms}
            onChange={(e) => setInvoiceConfig({...invoiceConfig, terms: e.target.value})}
          />
        </div>
      </div>
    </div>
  );

  const renderTaxTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Configuración de Impuestos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tasa de IVA (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              value={taxConfig.ivaRate}
              onChange={(e) => setTaxConfig({...taxConfig, ivaRate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Impuesto por Defecto</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
              value={taxConfig.defaultTaxType}
              onChange={(e) => setTaxConfig({...taxConfig, defaultTaxType: e.target.value})}
            >
              <option value="GRAVADO">GRAVADO</option>
              <option value="EXENTO">EXENTO</option>
              <option value="NO_SUJETO">NO SUJETO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tasa de Retención (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              value={taxConfig.retentionRate}
              onChange={(e) => setTaxConfig({...taxConfig, retentionRate: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Importante</span>
          </div>
          <p className="text-amber-700 text-sm">
            Los cambios en las tasas de impuestos solo afectarán a las nuevas facturas. 
            Las facturas existentes mantendrán sus tasas originales.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Configuración de Email</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Servidor SMTP</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={emailConfig.smtpServer}
              onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Puerto SMTP</label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={emailConfig.smtpPort}
              onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
            <input
              type="email"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={emailConfig.username}
              onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Remitente</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={emailConfig.senderName}
              onChange={(e) => setEmailConfig({...emailConfig, senderName: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Probar Conexión
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2 rounded-xl">
            <Database className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
              value={systemConfig.language}
              onChange={(e) => setSystemConfig({...systemConfig, language: e.target.value})}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
              value={systemConfig.currency}
              onChange={(e) => setSystemConfig({...systemConfig, currency: e.target.value})}
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Formato de Fecha</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
              value={systemConfig.dateFormat}
              onChange={(e) => setSystemConfig({...systemConfig, dateFormat: e.target.value})}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Zona Horaria</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
              value={systemConfig.timezone}
              onChange={(e) => setSystemConfig({...systemConfig, timezone: e.target.value})}
            >
              <option value="America/El_Salvador">El Salvador (CST)</option>
              <option value="America/Guatemala">Guatemala (CST)</option>
              <option value="America/Mexico_City">México (CST)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Frecuencia de Respaldo</label>
            <select
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
              value={systemConfig.backupFrequency}
              onChange={(e) => setSystemConfig({...systemConfig, backupFrequency: e.target.value})}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Crear Respaldo
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Restaurar Respaldo
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
   

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'empresa' && renderCompanyTab()}
          {activeTab === 'facturacion' && renderInvoiceTab()}
          {activeTab === 'impuestos' && renderTaxTab()}
          {activeTab === 'email' && renderEmailTab()}
          {activeTab === 'sistema' && renderSystemTab()}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-6 h-6" />
                Configuración Guardada
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};