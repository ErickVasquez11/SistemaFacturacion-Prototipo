import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Calculator, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { SaleItem, Product, Client } from '../../types';
import ClientSelector from './ClientSelector';
import ProductSelector from './ProductSelector';
import SalesPDF from './SalesPDF';

const SalesForm: React.FC = () => {
  const { clients, products, addSale, getProductByCode } = useData();
  const { addToast } = useToast();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [documentType, setDocumentType] = useState<'factura' | 'credito_fiscal' | 'nota_remision'>('factura');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('FAC-001');
  const [taxType, setTaxType] = useState<'IVA 13%' | 'Sin IVA'>('IVA 13%');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [showPDF, setShowPDF] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [productCode, setProductCode] = useState('');

  const handleProductCodeChange = (code: string) => {
    setProductCode(code);
    
    if (code.length >= 3) {
      const product = getProductByCode(code);
      if (product) {
        handleAddProduct(product);
        setProductCode('');
      }
    }
  };

  const handleAddProduct = (product: Product) => {
    const existingItem = saleItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSaleItems(prev => prev.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price,
      };
      setSaleItems(prev => [...prev, newItem]);
    }
    
    addToast({
      type: 'success',
      title: 'Producto agregado',
      message: `${product.name} ha sido agregado a la venta`
    });
  };

  const handleRemoveItem = (id: string) => {
    setSaleItems(prev => prev.filter(item => item.id !== id));
    addToast({
      type: 'info',
      title: 'Producto removido',
      message: 'El producto ha sido removido de la venta'
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setSaleItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const tax = taxType === 'IVA 13%' ? subtotal * 0.13 : 0;
  const total = subtotal + tax;

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      addToast({
        type: 'error',
        title: 'Error de validación',
        message: 'Debe seleccionar un cliente'
      });
      return;
    }
    
    if (saleItems.length === 0) {
      addToast({
        type: 'error',
        title: 'Error de validación',
        message: 'Debe agregar al menos un producto'
      });
      return;
    }

    const newSale = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      invoiceNumber,
      date: new Date(date),
      items: saleItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      documentType,
      taxType,
      status: 'completed' as const,
    };

    addSale(newSale);
    setLastSale({ ...newSale, client: selectedClient });
    
    // Reset form
    setSelectedClient(null);
    setSaleItems([]);
    setInvoiceNumber(`FAC-${String(Date.now()).slice(-3)}`);
    
    addToast({
      type: 'success',
      title: 'Venta completada',
      message: 'La venta ha sido registrada exitosamente'
    });
  };

  const handleShowPDF = () => {
    if (!lastSale) {
      addToast({
        type: 'warning',
        title: 'No hay venta',
        message: 'Debe completar una venta primero'
      });
      return;
    }
    setShowPDF(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Ventas - ADD</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleShowPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Ver PDF</span>
          </button>
          <button
            type="submit"
            form="sales-form"
            className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Nueva Factura
          </button>
        </div>
      </div>

      <form id="sales-form" onSubmit={handleSubmitSale} className="space-y-6">
        {/* Document Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Información del Documento</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <ClientSelector
                clients={clients}
                selectedClient={selectedClient}
                onClientSelect={setSelectedClient}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="factura">Factura</option>
                <option value="credito_fiscal">Comprobante de Crédito Fiscal</option>
                <option value="nota_remision">Nota de Remisión</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Comprobante *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: FAC-001"
                required
              />
            </div>
          </div>
        </div>

        {/* Tax and Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Impuesto y forma de pago</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Impuesto *
              </label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="IVA 13%">IVA 13%</option>
                <option value="Sin IVA">Sin IVA</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de pago *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por código..."
                  value={productCode}
                  onChange={(e) => handleProductCodeChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <ProductSelector
                products={products}
                onProductSelect={handleAddProduct}
              />
            </div>
          </div>
          
          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalle producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio unitario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saleItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No hay productos agregados
                    </td>
                  </tr>
                ) : (
                  saleItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productCode}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <p className="font-medium">{item.productName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        {saleItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuesto ({taxType}):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* PDF Modal */}
      {showPDF && lastSale && (
        <SalesPDF
          sale={lastSale}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
};

export default SalesForm;