import React, { useState, useEffect } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Eye, Trash2, Download, Search } from 'lucide-react';
import InvoicePreview from './InvoicePreview';
import { Invoice } from '../types';

interface Props {
  onEditInvoice: (id: string) => void;
}

const SavedInvoices: React.FC<Props> = ({ onEditInvoice }) => {
  const { invoices, deleteInvoice } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for direct printing
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (printInvoice) {
      // Usamos setTimeout para asegurar que React ya haya pintado el DOM en pantalla
      const timer = setTimeout(() => {
        window.print();
      }, 200); // 200ms da tiempo suficiente al navegador para renderizar
      
      return () => clearTimeout(timer);
    }
  }, [printInvoice]);

  // Limpiar el estado de impresión después de que se cierre el diálogo de impresión
  useEffect(() => {
    const handleAfterPrint = () => setPrintInvoice(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const searchStr = searchTerm.toLowerCase();
    return inv.invoiceNumber.toLowerCase().includes(searchStr) ||
           (inv.clientSnapshot?.name || '').toLowerCase().includes(searchStr) ||
           (inv.patientSnapshot?.name || '').toLowerCase().includes(searchStr);
  });

  const handlePrint = (invoice: Invoice) => {
    setPrintInvoice(invoice);
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center print:hidden">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay facturas</h2>
          <p className="text-gray-500">
            Aún no has guardado ninguna factura. Crea la primera desde la sección de Facturación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-5xl mx-auto print:bg-transparent print:border-none print:shadow-none print:p-0">
      
      {/* Si estamos imprimiendo, mostramos SOLO la factura en pantalla para asegurar que el navegador la capture */}
      {printInvoice ? (
        <div className="w-full h-full flex justify-center items-center py-10 print:py-0">
          <InvoicePreview invoice={printInvoice} />
        </div>
      ) : (
        <div className="print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Facturas Guardadas</h2>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente, paciente o nº..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-hc-pink/30 focus:border-hc-pink w-full md:w-80 transition-all text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200 text-gray-600 text-sm">
                  <th className="py-3 px-4 font-semibold">Nº Factura</th>
                  <th className="py-3 px-4 font-semibold">Fecha</th>
                  <th className="py-3 px-4 font-semibold">Cliente</th>
                  <th className="py-3 px-4 font-semibold">Paciente</th>
                  <th className="py-3 px-4 font-semibold text-right">Total ($)</th>
                  <th className="py-3 px-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4 font-mono text-sm text-gray-700">{inv.invoiceNumber}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{new Date(inv.date).toLocaleDateString('es-VE')}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-800">{inv.clientSnapshot?.name || '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{inv.patientSnapshot?.name || '-'}</td>
                    <td className="py-4 px-4 text-sm font-bold text-right text-hc-pink">$ {inv.total.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEditInvoice(inv.id)}
                          className="p-1.5 text-hc-blue hover:bg-blue-50 rounded-md transition-colors"
                          title="Ver / Editar"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handlePrint(inv)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Descargar PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('¿Seguro que deseas eliminar esta factura?')) {
                              deleteInvoice(inv.id);
                            }
                          }}
                          className="p-1.5 text-hc-gray hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No se encontraron facturas que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedInvoices;
