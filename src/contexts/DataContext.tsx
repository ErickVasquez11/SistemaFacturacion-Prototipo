import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Client, Sale, DTEDocument } from '../types';

interface DataContextType {
  products: Product[];
  clients: Client[];
  sales: Sale[];
  dteDocuments: DTEDocument[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  getProductByCode: (code: string) => Product | undefined;
  getClientById: (id: string) => Client | undefined;
  updateDTEDocument: (id: string, updates: Partial<DTEDocument>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Demo data
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    code: 'PROD001',
    name: 'Laptop Dell Inspiron 15',
    description: 'Laptop Dell Inspiron 15 pulgadas, 8GB RAM, 256GB SSD',
    price: 899.99,
    stock: 25,
    category: 'Electrónicos',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    code: 'PROD002',
    name: 'Mouse Inalámbrico Logitech',
    description: 'Mouse inalámbrico Logitech MX Master 3',
    price: 45.50,
    stock: 100,
    category: 'Accesorios',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    code: 'PROD003',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico con iluminación RGB',
    price: 120.00,
    stock: 50,
    category: 'Accesorios',
    createdAt: new Date('2024-01-17'),
  },
];

const DEMO_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '7555-1234',
    dui: '12345678-9',
    nit: '0614-120589-101-2',
    address: 'Col. Escalón, San Salvador',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '7555-5678',
    dui: '87654321-0',
    nit: '0614-150690-102-1',
    address: 'Col. San Benito, San Salvador',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '7555-9012',
    dui: '11223344-5',
    nit: '0614-180791-103-5',
    address: 'Col. Centroamérica, San Salvador',
    createdAt: new Date('2024-01-12'),
  },
];

const DEMO_DTE_DOCUMENTS: DTEDocument[] = [
  {
    id: '1',
    documentNumber: 'DTE001-001',
    type: 'factura',
    clientName: 'Juan Pérez',
    date: new Date('2024-01-15'),
    total: 125.50,
    status: 'enviado',
    generationCode: 'A1DC304-C374-8901-ABC0-12345678912',
    receptionSeal: 'MH-DTE-2024-001',
    actions: ['download', 'print', 'resend'],
  },
  {
    id: '2',
    documentNumber: 'DTE001-002',
    type: 'credito_fiscal',
    clientName: 'María González',
    date: new Date('2024-01-16'),
    total: 89.75,
    status: 'procesando',
    generationCode: 'B2CD455-F467-8901-BCD1-23456789123',
    receptionSeal: 'N/A',
    actions: ['download', 'cancel'],
  },
  {
    id: '3',
    documentNumber: 'DTE001-003',
    type: 'nota_remision',
    clientName: 'Carlos Rodríguez',
    date: new Date('2024-01-17'),
    total: 256.00,
    status: 'rechazado',
    generationCode: 'C3DE566-G578-9012-CDE2-34567890134',
    receptionSeal: 'N/A',
    actions: ['download', 'invalidate'],
  },
  {
    id: '4',
    documentNumber: 'DTE001-004',
    type: 'factura',
    clientName: 'Ana Martínez',
    date: new Date('2024-01-18'),
    total: 45.25,
    status: 'pendiente',
    generationCode: 'D4EF677-H689-0123-DEF3-45678901245',
    receptionSeal: 'N/A',
    actions: ['download', 'resend', 'contingency'],
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dteDocuments, setDteDocuments] = useState<DTEDocument[]>(DEMO_DTE_DOCUMENTS);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales(prev => [...prev, newSale]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const getProductByCode = (code: string) => {
    return products.find(p => p.code.toLowerCase() === code.toLowerCase());
  };

  const getClientById = (id: string) => {
    return clients.find(c => c.id === id);
  };

  const updateDTEDocument = (id: string, updates: Partial<DTEDocument>) => {
    setDteDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  return (
    <DataContext.Provider value={{
      products,
      clients,
      sales,
      dteDocuments,
      addProduct,
      addClient,
      addSale,
      updateProduct,
      updateClient,
      getProductByCode,
      getClientById,
      updateDTEDocument,
    }}>
      {children}
    </DataContext.Provider>
  );
};