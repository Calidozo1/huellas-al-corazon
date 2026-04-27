import React, { useState, useEffect, useRef } from 'react';
import { Invoice, LineItem, Client, Patient, Vet } from '../types';
import { PlusCircle, Trash2, User, PawPrint, Stethoscope, Search } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';

interface Props {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const InvoiceForm: React.FC<Props> = ({ invoice, setInvoice }) => {
  const { clients, patients, vets } = useDataStore();
  
  // Autocomplete states
  const [clientSearch, setClientSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [showClientResults, setShowClientResults] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

  // When editing an existing invoice, pre-fill the search inputs
  useEffect(() => {
    if (invoice.clientId && invoice.clientSnapshot.name) {
      setClientSearch(`${invoice.clientSnapshot.name} (${invoice.clientSnapshot.cedula})`);
    } else {
      setClientSearch('');
    }
    if (invoice.patientId && invoice.patientSnapshot.name) {
      setPatientSearch(`${invoice.patientSnapshot.name} - ${invoice.patientSnapshot.species}`);
    } else {
      setPatientSearch('');
    }
  }, [invoice.id, invoice.clientId, invoice.patientId]);

  // Recalculate totals (Venezuela: USD, IVA 16%, IGTF 3%)
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const ivaAmount = invoice.hasIva ? subtotal * 0.16 : 0;
    
    // IGTF se calcula normalmente sobre el subtotal+iva si todo se paga en divisas.
    const totalConIva = subtotal + ivaAmount;
    const igtfAmount = invoice.applyIgtf ? totalConIva * 0.03 : 0;
    
    const total = totalConIva + igtfAmount;

    setInvoice(prev => ({ ...prev, subtotal, ivaAmount, igtfAmount, total }));
  }, [invoice.items, invoice.hasIva, invoice.applyIgtf, setInvoice]);

  const updateField = (field: keyof Invoice, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const selectClient = (client: Client) => {
    setClientSearch(`${client.name} (${client.cedula})`);
    setShowClientResults(false);
    
    // Auto-select first patient if they only have one
    const clientPatients = patients.filter(p => p.clientId === client.id);
    let autoPat = '';
    let autoPatSnap = { name: '', species: '', breed: '', thirdPartyName: '', thirdPartyCedula: '' };
    let patSearchStr = '';
    if (clientPatients.length === 1) {
       autoPat = clientPatients[0].id;
       autoPatSnap = { 
         name: clientPatients[0].name, species: clientPatients[0].species, breed: clientPatients[0].breed,
         thirdPartyName: clientPatients[0].thirdPartyName, thirdPartyCedula: clientPatients[0].thirdPartyCedula 
       };
       patSearchStr = `${clientPatients[0].name} - ${clientPatients[0].species}`;
    }

    setInvoice(prev => ({ 
      ...prev, 
      clientId: client.id,
      clientSnapshot: { name: client.name, cedula: client.cedula, address: client.address },
      patientId: autoPat,
      patientSnapshot: autoPatSnap
    }));
    
    if (patSearchStr) setPatientSearch(patSearchStr);
    else setPatientSearch('');
  };

  const selectPatient = (patient: Patient) => {
    setPatientSearch(`${patient.name} - ${patient.species}`);
    setShowPatientResults(false);
    setInvoice(prev => ({
      ...prev,
      patientId: patient.id,
      patientSnapshot: { 
        name: patient.name, species: patient.species, breed: patient.breed,
        thirdPartyName: patient.thirdPartyName, thirdPartyCedula: patient.thirdPartyCedula 
      }
    }));
  };

  const selectVet = (vetId: string) => {
    const vet = vets.find(v => v.id === vetId);
    setInvoice(prev => ({
      ...prev,
      vetId: vetId,
      vetSnapshot: vet ? { name: vet.name } : { name: '' }
    }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({ ...prev, items: [...prev.items, { id: Math.random().toString(36).substring(7), concept: '', quantity: 1, price: 0 }] }));
  };

  const removeItem = (id: string) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    }
  };

  const inputClass = "w-full p-2 border border-hc-gray/40 rounded-md focus:outline-none focus:ring-2 focus:ring-hc-pink/30 focus:border-hc-pink transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider";

  // Filter logic
  const filteredClients = clientSearch && showClientResults ? clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.cedula.toLowerCase().includes(clientSearch.toLowerCase())
  ) : [];

  const clientPatients = patients.filter(p => p.clientId === invoice.clientId);
  const filteredPatients = patientSearch && showPatientResults ? clientPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8">
      
      {/* Datos Documento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div>
          <label className={labelClass}>Número de Factura</label>
          <input type="text" value={invoice.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} className={`${inputClass} font-mono font-medium`} />
        </div>
        <div>
          <label className={labelClass}>Fecha</label>
          <input type="date" value={invoice.date} onChange={(e) => updateField('date', e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos Cliente */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-hc-pink font-semibold"><User size={18} /> Cliente</div>
            {!invoice.clientId && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">* Requerido</span>}
          </div>
          
          <div className="relative">
            <label className={labelClass}>Buscar Cliente (Nombre o Cédula)</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ej. Juan Pérez o V-12345678" 
                value={clientSearch}
                onChange={(e) => { setClientSearch(e.target.value); setShowClientResults(true); if(invoice.clientId) updateField('clientId', ''); }}
                onFocus={() => setShowClientResults(true)}
                className={inputClass}
              />
              <Search className="absolute right-2 top-2.5 text-gray-400" size={16} />
            </div>
            
            {showClientResults && clientSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredClients.map(c => (
                  <div key={c.id} onClick={() => selectClient(c)} className="p-2 hover:bg-hc-pink/5 cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.cedula}</div>
                  </div>
                ))}
                {filteredClients.length === 0 && <div className="p-2 text-sm text-gray-500">No se encontraron clientes. Regístralo en el Directorio.</div>}
              </div>
            )}
          </div>

          {invoice.clientId && (
            <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-100">
              <p><strong>Cédula:</strong> {invoice.clientSnapshot.cedula}</p>
              <p><strong>Dirección:</strong> {invoice.clientSnapshot.address || 'N/A'}</p>
            </div>
          )}
        </div>

        {/* Datos Paciente / Vet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2 text-hc-blue font-semibold"><PawPrint size={18} /> Paciente</div>
            {!invoice.patientId && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">* Requerido</span>}
          </div>

          <div className="relative">
            <label className={labelClass}>Buscar Paciente</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder={invoice.clientId ? "Buscar por nombre del animal..." : "Selecciona un cliente primero"} 
                value={patientSearch}
                disabled={!invoice.clientId}
                onChange={(e) => { setPatientSearch(e.target.value); setShowPatientResults(true); if(invoice.patientId) updateField('patientId', ''); }}
                onFocus={() => setShowPatientResults(true)}
                className={`${inputClass} ${!invoice.clientId ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
              />
              <Search className="absolute right-2 top-2.5 text-gray-400" size={16} />
            </div>

            {showPatientResults && patientSearch && invoice.clientId && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredPatients.map(p => (
                  <div key={p.id} onClick={() => selectPatient(p)} className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.species} - {p.breed}</div>
                  </div>
                ))}
                {filteredPatients.length === 0 && <div className="p-2 text-sm text-gray-500">No se encontraron pacientes para este cliente.</div>}
              </div>
            )}
          </div>

          {invoice.patientId && (
            <div className="bg-blue-50/30 p-3 rounded-md text-sm border border-blue-50">
              <p><strong>Especie/Raza:</strong> {invoice.patientSnapshot.species} {invoice.patientSnapshot.breed ? `- ${invoice.patientSnapshot.breed}` : ''}</p>
              {invoice.patientSnapshot.thirdPartyName && (
                <p className="text-xs text-gray-500 mt-1 mt-1 border-t border-blue-100 pt-1">
                  Traído por: {invoice.patientSnapshot.thirdPartyName} ({invoice.patientSnapshot.thirdPartyCedula})
                </p>
              )}
            </div>
          )}

          <div className="pt-2">
            <label className={labelClass}><span className="flex items-center gap-1"><Stethoscope size={12} /> Veterinario Tratante</span></label>
            <select value={invoice.vetId} onChange={(e) => selectVet(e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">Seleccione un veterinario...</option>
              {vets.map(v => <option key={v.id} value={v.id}>{v.name} ({v.specialty})</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Líneas de Factura */}
      <div>
        <div className="font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Conceptos (Expresado en $)</div>
        
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Concepto</div>
            <div className="col-span-2 text-center">Cant.</div>
            <div className="col-span-3 text-right">Precio Ud. ($)</div>
            <div className="col-span-1"></div>
          </div>

          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50 p-3 md:p-1 md:bg-transparent rounded-lg border border-gray-100 md:border-none">
              <div className="md:col-span-6">
                <input type="text" placeholder="Descripción..." value={item.concept} onChange={(e) => updateItem(item.id, 'concept', e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <input type="number" min="1" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className={`${inputClass} text-center`} />
              </div>
              <div className="md:col-span-3">
                <input type="number" min="0" step="0.01" value={item.price || ''} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className={`${inputClass} text-right`} />
              </div>
              <div className="md:col-span-1 flex justify-end md:justify-center">
                <button onClick={() => removeItem(item.id)} disabled={invoice.items.length === 1} className="p-2 text-hc-gray hover:text-red-500 disabled:opacity-30"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addItem} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-hc-pink hover:text-hc-pinkHover bg-hc-pink/10 px-3 py-1.5 rounded-md transition-colors"><PlusCircle size={16} /> Agregar Línea</button>
      </div>

      {/* Pago e Impuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
        
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Método de Pago</label>
            <select value={invoice.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)} className={`${inputClass} bg-white`}>
              <option value="Transferencia">Transferencia</option>
              <option value="Pago Móvil">Pago Móvil</option>
              <option value="Zelle">Zelle</option>
              <option value="Efectivo">Efectivo ($ o Bs)</option>
              <option value="Punto de Venta">Punto de Venta</option>
              <option value="Tarjeta">Tarjeta de Crédito Internacional</option>
              <option value="">Pendiente</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Referencia</label>
            <input type="text" placeholder="Nro Referencia / Teléfono" value={invoice.paymentReference} onChange={(e) => updateField('paymentReference', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="space-y-3 mb-4 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IVA (16%)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={invoice.hasIva} onChange={(e) => updateField('hasIva', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-hc-pink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IGTF (3% Divisas)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={invoice.applyIgtf} onChange={(e) => updateField('applyIgtf', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-hc-blue after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal:</span><span>$ {invoice.subtotal.toFixed(2)}</span></div>
            {invoice.hasIva && <div className="flex justify-between"><span>IVA (16%):</span><span>$ {invoice.ivaAmount.toFixed(2)}</span></div>}
            {invoice.applyIgtf && <div className="flex justify-between text-hc-blue"><span>IGTF (3%):</span><span>$ {invoice.igtfAmount.toFixed(2)}</span></div>}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
              <span className="text-base font-bold text-gray-800">TOTAL:</span>
              <span className="text-2xl font-bold text-hc-pink">$ {invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceForm;
