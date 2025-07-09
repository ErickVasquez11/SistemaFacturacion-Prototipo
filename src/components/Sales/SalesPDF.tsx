import React from 'react';
import { X, Download, Printer as Print } from 'lucide-react';

interface SalesPDFProps {
  sale: any;
  onClose: () => void;
}

const SalesPDF: React.FC<SalesPDFProps> = ({ sale, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    element.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihGQUNUVVJBIERFTU8pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMDkgMDAwMDAgbgowMDAwMDAwMDU4IDAwMDAwIG4KMDAwMDAwMDExNSAwMDAwMCBuCjAwMDAwMDAyNDUgMDAwMDAgbgowMDAwMDAwMzA3IDAwMDAwIG4KdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MDIKJSVFT0Y=';
    element.download = `factura-${sale.invoiceNumber}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Factura - {sale.invoiceNumber}</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Print className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="bg-white">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">FACTURA</h1>
              <p className="text-gray-600">Sistema de Facturación Electrónica</p>
              <p className="text-sm text-gray-500">Ministerio de Hacienda - El Salvador</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Información del Cliente</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {sale.client?.name}</p>
                  <p><span className="font-medium">NIT:</span> {sale.client?.nit}</p>
                  <p><span className="font-medium">Email:</span> {sale.client?.email}</p>
                  <p><span className="font-medium">Dirección:</span> {sale.client?.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Información de la Factura</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Número:</span> {sale.invoiceNumber}</p>
                  <p><span className="font-medium">Fecha:</span> {sale.date.toLocaleDateString()}</p>
                  <p><span className="font-medium">Forma de Pago:</span> {sale.paymentMethod}</p>
                  <p><span className="font-medium">Impuesto:</span> {sale.taxType}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Código</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Precio Unit.</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2">{item.productCode}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${sale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuesto ({sale.taxType}):</span>
                  <span>${sale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPDF;