export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier';
  createdAt: Date;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dui: string;
  nit: string;
  address: string;
  createdAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  date: Date;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  documentType: 'factura' | 'credito_fiscal' | 'nota_remision';
  taxType: 'IVA 13%' | 'Sin IVA';
  status: 'draft' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface DTEDocument {
  id: string;
  documentNumber: string;
  type: 'factura' | 'credito_fiscal' | 'nota_remision';
  clientName: string;
  date: Date;
  total: number;
  status: 'enviado' | 'procesando' | 'pendiente' | 'rechazado';
  generationCode: string;
  receptionSeal: string;
  actions: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}