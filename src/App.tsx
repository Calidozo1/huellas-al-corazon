import { useState } from 'react';
import Navbar from './components/Navbar';
import InvoiceGenerator from './components/InvoiceGenerator';
import SavedInvoices from './components/SavedInvoices';
import DirectoryManager from './components/DirectoryManager';

export type Tab = 'home' | 'directory' | 'generator' | 'saved';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  // Pass state to InvoiceGenerator if editing from saved invoices
  const [invoiceToEdit, setInvoiceToEdit] = useState<string | null>(null);

  const handleEditInvoice = (id: string) => {
    setInvoiceToEdit(id);
    setCurrentTab('generator');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-hc-bg print:block print:min-h-0 print:bg-white print:overflow-visible">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none print:block print:w-full print:h-auto print:overflow-visible">
        
        {currentTab === 'home' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center print:hidden">
            <h1 className="text-4xl md:text-6xl font-bold text-hc-pink mb-4">Bienvenido a Huellas al Corazón</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Sistema integral de gestión veterinaria. Administra tu directorio de clientes y pacientes, y genera facturas adaptadas a la normativa.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentTab('directory')}
                className="bg-white text-hc-pink border border-hc-pink px-8 py-3 rounded-full font-medium transition-colors text-lg shadow-sm hover:bg-hc-pink/5"
              >
                Ir al Directorio
              </button>
              <button 
                onClick={() => setCurrentTab('generator')}
                className="bg-hc-pink hover:bg-hc-pinkHover text-white px-8 py-3 rounded-full font-medium transition-colors text-lg shadow-lg shadow-hc-pink/30"
              >
                Crear Nueva Factura
              </button>
            </div>
          </div>
        )}

        {currentTab === 'directory' && (
          <div className="print:hidden">
            <DirectoryManager />
          </div>
        )}

        {currentTab === 'saved' && (
          <SavedInvoices onEditInvoice={handleEditInvoice} />
        )}

        {/* Invoice Generator handles its own print hiding */}
        {currentTab === 'generator' && (
          <InvoiceGenerator 
            invoiceToEditId={invoiceToEdit} 
            clearEdit={() => setInvoiceToEdit(null)} 
            goToSaved={() => setCurrentTab('saved')}
          />
        )}

      </main>
    </div>
  );
}

export default App;
