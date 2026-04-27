import { useState, useEffect } from 'react';
import { Invoice } from '../types';

const STORAGE_KEY = 'facturasHuellas';

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'mock-1',
    invoiceNumber: 'FV-2026-0001',
    date: new Date().toISOString().split('T')[0],
    clinicName: 'Huellas al Corazón',
    clinicAddress: 'Calle Amor Animal 456, 28045 Madrid',
    clinicNif: 'B87654321',
    clientName: 'María García',
    clientAddress: 'Av. Libertad 12, 3B',
    clientNif: '12345678Z',
    patientName: 'Luna',
    patientSpecies: 'Perro',
    patientBreed: 'Golden Retriever',
    vetName: 'Dr. Carlos Sánchez',
    items: [
      { id: 'item-1', concept: 'Consulta General', quantity: 1, price: 40 },
      { id: 'item-2', concept: 'Vacuna Rabia', quantity: 1, price: 25 },
    ],
    paymentMethod: 'Tarjeta',
    paymentReference: 'REF-8822',
    hasIva: true,
    applyIrpf: false,
    subtotal: 65,
    ivaAmount: 13.65,
    irpfAmount: 0,
    total: 78.65,
  },
  {
    id: 'mock-2',
    invoiceNumber: 'FV-2026-0002',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    clinicName: 'Huellas al Corazón',
    clinicAddress: 'Calle Amor Animal 456, 28045 Madrid',
    clinicNif: 'B87654321',
    clientName: 'Juan Pérez',
    clientAddress: 'Calle Mayor 8, Bajo',
    clientNif: '87654321X',
    patientName: 'Max',
    patientSpecies: 'Gato',
    patientBreed: 'Común Europeo',
    vetName: 'Dra. Ana López',
    items: [
      { id: 'item-3', concept: 'Esterilización', quantity: 1, price: 120 },
      { id: 'item-4', concept: 'Medicación Post-operatoria', quantity: 1, price: 15 },
    ],
    paymentMethod: 'Efectivo',
    paymentReference: '',
    hasIva: true,
    applyIrpf: false,
    subtotal: 135,
    ivaAmount: 28.35,
    irpfAmount: 0,
    total: 163.35,
  }
];

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored invoices", e);
        setInvoices(MOCK_INVOICES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INVOICES));
      }
    } else {
      // Load mocks if empty
      setInvoices(MOCK_INVOICES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INVOICES));
    }
  }, []);

  const saveInvoice = (invoice: Invoice) => {
    const updatedInvoices = [...invoices];
    const index = updatedInvoices.findIndex(inv => inv.id === invoice.id);
    
    if (index >= 0) {
      updatedInvoices[index] = invoice; // Update
    } else {
      updatedInvoices.push(invoice); // Add new
    }
    
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(inv => inv.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  const getInvoice = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  return {
    invoices,
    saveInvoice,
    deleteInvoice,
    getInvoice
  };
}
