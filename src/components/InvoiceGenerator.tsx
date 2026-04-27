import React, { useState, useEffect, useRef } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import { Invoice } from '../types';
import { useDataStore } from '../hooks/useDataStore';

const createEmptyInvoice = (): Invoice => ({
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
  invoiceNumber: `FV-${new Date().getFullYear()}-0001`,
  date: new Date().toISOString().split('T')[0],
  
  clientId: '',
  clientSnapshot: { name: '', cedula: '', address: '' },
  patientId: '',
  patientSnapshot: { name: '', species: '', breed: '' },
  vetId: '',
  vetSnapshot: { name: '' },

  clinicName: 'Huellas al Corazón',
  clinicAddress: 'Calle Amor Animal 456, 28045 Madrid',
  clinicNif: 'J-12345678-9',
  
  items: [{ id: '1', concept: '', quantity: 1, price: 0 }],
  paymentMethod: 'Transferencia',
  paymentReference: '',
  hasIva: true,
  applyIgtf: false,
  subtotal: 0,
  ivaAmount: 0,
  igtfAmount: 0,
  total: 0,
});

interface Props {
  invoiceToEditId: string | null;
  clearEdit: () => void;
  goToSaved: () => void;
}

const InvoiceGenerator: React.FC<Props> = ({ invoiceToEditId, clearEdit, goToSaved }) => {
  const [invoice, setInvoice] = useState<Invoice>(createEmptyInvoice());
  const { getInvoice, saveInvoice } = useDataStore();
  
  // Ref for printing
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invoiceToEditId) {
      const existing = getInvoice(invoiceToEditId);
      if (existing) {
        setInvoice(existing);
      }
    } else {
      setInvoice(createEmptyInvoice());
    }
  }, [invoiceToEditId]);

  const handleSave = () => {
    if (!invoice.clientId || !invoice.patientId) {
      alert("Debes seleccionar un cliente y un paciente antes de guardar la factura.");
      return;
    }
    saveInvoice(invoice);
    goToSaved();
  };

  const handleNew = () => {
    clearEdit();
    setInvoice(createEmptyInvoice());
  };

  const handlePrint = () => {
    if (!invoice.clientId || !invoice.patientId) {
      alert("Debes seleccionar un cliente y un paciente antes de imprimir la factura.");
      return;
    }
    window.print();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full print:block print:w-full print:h-auto print:bg-white print:m-0 print:p-0 print:overflow-visible">
      {/* Columna Izquierda: Formulario (Oculto al imprimir) */}
      <div className="w-full xl:w-1/2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 overflow-y-auto print:hidden" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {invoiceToEditId ? 'Editar Factura' : 'Nueva Factura'}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handleNew}
              className="text-sm font-medium text-hc-gray hover:text-gray-800 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-end xl:hidden">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-hc-gray text-white rounded-md font-medium hover:bg-hc-grayHover transition-colors flex items-center gap-2"
            >
              Imprimir / PDF
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-hc-pink text-white rounded-md font-medium hover:bg-hc-pinkHover transition-colors shadow-sm shadow-hc-pink/20 flex items-center gap-2"
            >
              Guardar Factura
            </button>
        </div>
      </div>

      {/* Columna Derecha: Vista Previa */}
      <div className="w-full xl:w-1/2 flex flex-col h-full print:w-full print:block print:h-auto print:m-0 print:p-0 print:overflow-visible">
        <div className="flex items-center justify-between mb-4 px-2 print:hidden">
          <h2 className="text-xl font-bold text-gray-700 hidden xl:block">Vista Previa</h2>
          <div className="flex gap-3 ml-auto">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-hc-pink text-white rounded-md font-medium hover:bg-hc-pinkHover transition-colors shadow-sm shadow-hc-pink/20 hidden xl:flex items-center gap-2 text-sm"
            >
              Descargar PDF
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-black transition-colors hidden xl:flex items-center gap-2 text-sm"
            >
              Guardar Factura
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-200/50 rounded-xl p-4 md:p-8 overflow-y-auto flex justify-center items-start shadow-inner print:p-0 print:bg-white print:overflow-visible print:shadow-none print:block print:h-auto print:w-full print:m-0">
          <div ref={previewRef} className="print:w-full print:block print:h-auto print:m-0 print:p-0 mx-auto">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
