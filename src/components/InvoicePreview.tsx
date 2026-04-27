import React from 'react';
import { Invoice } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  invoice: Invoice;
}

const InvoicePreview: React.FC<Props> = ({ invoice }) => {
  let formattedDate = invoice.date;
  try {
    if (invoice.date) {
      formattedDate = format(new Date(invoice.date), "d 'de' MMMM, yyyy", { locale: es });
    }
  } catch (e) {
    // ignore
  }

  return (
    <div className="bg-white shadow-xl shadow-gray-200/50 w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] text-[10pt] font-sans text-gray-800 relative mx-auto print:shadow-none print:w-full print:h-auto print:p-[15mm]">
      
      {/* Header */}
      <header className="flex justify-between items-start mb-10 border-b-2 border-hc-pink pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-hc-bg border-2 border-hc-pink flex items-center justify-center text-hc-blue font-bold text-2xl shadow-sm">
            HC
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">{invoice.clinicName || 'Nombre Clínica'}</h1>
            <p className="text-gray-600 m-0 mt-1">{invoice.clinicAddress}</p>
            <p className="text-gray-600 m-0">RIF: {invoice.clinicNif}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-hc-gray tracking-widest mb-2 uppercase">Factura</h2>
          <div className="grid grid-cols-2 gap-x-4 text-right justify-end">
            <span className="font-semibold text-gray-600">Nº Factura:</span>
            <span className="font-mono">{invoice.invoiceNumber}</span>
            <span className="font-semibold text-gray-600">Fecha:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Info Blocks */}
      <div className="flex gap-8 mb-8">
        
        {/* Client */}
        <div className="flex-1 bg-gray-50 p-4 rounded-md border border-gray-100">
          <h3 className="text-xs font-bold text-hc-pink uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Facturado a</h3>
          <p className="font-bold text-gray-800 m-0 text-base">{invoice.clientSnapshot.name || 'Nombre del Cliente'}</p>
          {invoice.clientSnapshot.address && <p className="text-gray-600 m-0 mt-1">{invoice.clientSnapshot.address}</p>}
          <p className="text-gray-600 m-0 mt-1">
            <span className="font-semibold">Cédula/RIF:</span> {invoice.clientSnapshot.cedula || '-'}
          </p>
        </div>

        {/* Patient / Vet */}
        <div className="flex-1 space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
             <h3 className="text-xs font-bold text-hc-blue uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Paciente</h3>
             <div className="grid grid-cols-2 gap-y-1">
                <span className="font-semibold text-gray-600">Nombre:</span>
                <span>{invoice.patientSnapshot.name || '-'}</span>
                <span className="font-semibold text-gray-600">Especie:</span>
                <span>{invoice.patientSnapshot.species || '-'}</span>
                {invoice.patientSnapshot.breed && (
                  <>
                    <span className="font-semibold text-gray-600">Raza:</span>
                    <span>{invoice.patientSnapshot.breed}</span>
                  </>
                )}
             </div>
             {invoice.patientSnapshot.thirdPartyName && (
                <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-600">Traído por:</span> {invoice.patientSnapshot.thirdPartyName} ({invoice.patientSnapshot.thirdPartyCedula})
                </div>
             )}
          </div>
          {invoice.vetSnapshot.name && (
            <div className="px-4">
              <span className="font-semibold text-gray-600">Médico Tratante:</span> {invoice.vetSnapshot.name}
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 text-gray-600">
            <th className="py-2 text-left font-semibold uppercase text-xs tracking-wider w-[50%]">Concepto</th>
            <th className="py-2 text-center font-semibold uppercase text-xs tracking-wider w-[15%]">Cantidad</th>
            <th className="py-2 text-right font-semibold uppercase text-xs tracking-wider w-[15%]">Precio ($)</th>
            <th className="py-2 text-right font-semibold uppercase text-xs tracking-wider w-[20%]">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id || i} className="border-b border-gray-100 text-gray-800">
              <td className="py-3 text-left">{item.concept || '-'}</td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-right">$ {item.price.toFixed(2)}</td>
              <td className="py-3 text-right font-medium">$ {(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Totals */}
      <div className="flex justify-between items-start mt-8">
        {/* Payment Info */}
        <div className="w-1/2 text-gray-600 text-sm">
          {invoice.paymentMethod && (
            <div className="mb-2">
              <span className="font-semibold text-gray-800 block">Método de pago:</span>
              {invoice.paymentMethod}
            </div>
          )}
          {invoice.paymentReference && (
            <div>
              <span className="font-semibold text-gray-800 block">Referencia:</span>
              {invoice.paymentReference}
            </div>
          )}
        </div>

        {/* Totals Table */}
        <div className="w-[45%] bg-gray-50 rounded-md p-4 border border-gray-200">
          <table className="w-full text-right text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-semibold text-gray-600">Subtotal:</td>
                <td className="py-1">$ {invoice.subtotal.toFixed(2)}</td>
              </tr>
              {invoice.hasIva && (
                <tr>
                  <td className="py-1 font-semibold text-gray-600">IVA (16%):</td>
                  <td className="py-1">$ {invoice.ivaAmount.toFixed(2)}</td>
                </tr>
              )}
              {invoice.applyIgtf && (
                <tr>
                  <td className="py-1 font-semibold text-gray-600">IGTF (3% Divisas):</td>
                  <td className="py-1 text-hc-blue">$ {invoice.igtfAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-gray-300">
                <td className="pt-3 font-bold text-base text-gray-800">Total a Pagar:</td>
                <td className="pt-3 font-bold text-xl text-hc-pink">$ {invoice.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] text-center text-xs text-gray-400 border-t border-gray-200 pt-4 print:bottom-4">
        Gracias por confiar en {invoice.clinicName}. Documento generado el {new Date().toLocaleDateString('es-VE')}. Todos los montos están expresados en Dólares Estadounidenses (USD).
      </div>

    </div>
  );
};

export default InvoicePreview;
