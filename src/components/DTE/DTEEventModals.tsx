import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, FileText, Download, Eye } from 'lucide-react';
import { DTEDocument } from '../../types';

interface DTEEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DTEDocument | null;
  eventType: 'invalidate' | 'contingency' | 'resend';
  onConfirm: (document: DTEDocument, data?: any) => void;
}

const DTEEventModal: React.FC<DTEEventModalProps> = ({
  isOpen,
  onClose,
  document,
  eventType,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [motivo, setMotivo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen || !document) return null;

  const getModalConfig = () => {
    switch (eventType) {
      case 'invalidate':
        return {
          title: 'EVENTO DE INVALIDACIÓN',
          subtitle: 'Invalidar',
          buttonText: 'Invalidar',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          icon: AlertTriangle,
          iconColor: 'text-red-500'
        };
      case 'contingency':
        return {
          title: 'EVENTO DE CONTINGENCIA',
          subtitle: 'Enviar Evento',
          buttonText: 'Procesar',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
      case 'resend':
        return {
          title: 'OPCIONES DTE',
          subtitle: 'Procesar',
          buttonText: 'Aceptar',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      default:
        return {
          title: 'EVENTO DTE',
          subtitle: 'Procesar',
          buttonText: 'Aceptar',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: FileText,
          iconColor: 'text-blue-500'
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success state first
    setShowSuccess(true);
    
    // After 2 seconds, confirm and close
    setTimeout(() => {
      onConfirm(document, {
        reason,
        motivo,
        tipoDocumento,
        numeroDocumento
      });
      onClose();
      setShowSuccess(false);
    }, 2000);
  };

  const renderFormFields = () => {
    if (eventType === 'invalidate') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la invalidación *
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar motivo</option>
              <option value="error_datos">Error en datos del cliente</option>
              <option value="error_productos">Error en productos</option>
              <option value="duplicado">Documento duplicado</option>
              <option value="cancelacion">Cancelación de venta</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Documento *
            </label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="factura">Factura</option>
              <option value="credito_fiscal">Comprobante de Crédito Fiscal</option>
              <option value="nota_remision">Nota de Remisión</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número Documento *
            </label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número del documento"
              required
            />
          </div>
        </div>
      );
    }

    if (eventType === 'contingency') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de contingencia *
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar motivo</option>
              <option value="falla_sistema">Falla del sistema MH</option>
              <option value="falla_internet">Falla de conexión a internet</option>
              <option value="falla_energia">Falla de energía eléctrica</option>
              <option value="mantenimiento">Mantenimiento programado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Descripción detallada del motivo de contingencia"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-4">
        <p className="text-gray-600">¿Está seguro que desea procesar este documento?</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showSuccess ? (
            <>
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Agregar documentos
                </button>
                <button className={`px-4 py-2 text-white rounded-lg ${config.buttonColor}`}>
                  {config.subtitle}
                </button>
                {eventType === 'contingency' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Procesar
                  </button>
                )}
              </div>

              {/* Document Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Documento:</span> {document.documentNumber}
                  </div>
                  <div>
                    <span className="font-medium">Cliente:</span> {document.clientName}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span> {document.date.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> ${document.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {renderFormFields()}

                {/* Document Table */}
                <div className="mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">Nombre</th>
                          <th className="text-left py-2">Número de control</th>
                          <th className="text-left py-2">Sello de recepción</th>
                          <th className="text-left py-2">Estado</th>
                          <th className="text-left py-2">Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2">01</td>
                          <td className="py-2">José Alejandro Torres Jiménez</td>
                          <td className="py-2 text-xs">{document.generationCode}</td>
                          <td className="py-2">{document.receptionSeal}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              Procesando
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-1">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 text-white rounded-lg ${config.buttonColor}`}
                  >
                    {config.buttonText}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {eventType === 'invalidate' ? 'DTE PROCESADO CON ÉXITO' : 
                 eventType === 'contingency' ? 'EVENTO ENVIADO CON ÉXITO' : 
                 'DTE PROCESADO CON ÉXITO'}
              </p>
              <p className="text-gray-600 text-center">
                El documento ha sido procesado correctamente
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aceptar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DTEEventModal;