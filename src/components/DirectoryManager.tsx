import React, { useState } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Users, PawPrint, Stethoscope, Plus, Trash2, Edit2 } from 'lucide-react';
import { Client, Patient, Vet } from '../types';

const DirectoryManager: React.FC = () => {
  const { 
    clients, saveClient, deleteClient,
    patients, savePatient, deletePatient,
    vets, saveVet, deleteVet
  } = useDataStore();

  const [activeTab, setActiveTab] = useState<'clients' | 'patients' | 'vets'>('clients');

  // Client form state
  const [cId, setCId] = useState('');
  const [cName, setCName] = useState('');
  const [cCedula, setCCedula] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cPhone, setCPhone] = useState('');

  // Patient form state
  const [pId, setPId] = useState('');
  const [pClientId, setPClientId] = useState('');
  const [pName, setPName] = useState('');
  const [pSpecies, setPSpecies] = useState('');
  const [pBreed, setPBreed] = useState('');
  const [pThirdName, setPThirdName] = useState('');
  const [pThirdCedula, setPThirdCedula] = useState('');

  const resetClientForm = () => { setCId(''); setCName(''); setCCedula(''); setCAddress(''); setCPhone(''); };
  const resetPatientForm = () => { setPId(''); setPClientId(''); setPName(''); setPSpecies(''); setPBreed(''); setPThirdName(''); setPThirdCedula(''); };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: cId || Math.random().toString(36).substring(7),
      name: cName, cedula: cCedula, address: cAddress, phone: cPhone,
      createdAt: new Date().toISOString()
    };
    saveClient(newClient);
    resetClientForm();
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pClientId) { alert('Debes seleccionar un cliente'); return; }
    const newPat: Patient = {
      id: pId || Math.random().toString(36).substring(7),
      clientId: pClientId, name: pName, species: pSpecies, breed: pBreed,
      thirdPartyName: pThirdName, thirdPartyCedula: pThirdCedula,
      createdAt: new Date().toISOString()
    };
    savePatient(newPat);
    resetPatientForm();
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hc-pink/30 text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[70vh]">
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'clients' ? 'border-b-2 border-hc-pink text-hc-pink' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={18} /> Clientes
        </button>
        <button 
          className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'patients' ? 'border-b-2 border-hc-blue text-hc-blue' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('patients')}
        >
          <PawPrint size={18} /> Pacientes
        </button>
        <button 
          className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition-colors ${activeTab === 'vets' ? 'border-b-2 border-hc-gray text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('vets')}
        >
          <Stethoscope size={18} /> Veterinarios
        </button>
      </div>

      <div className="p-6">
        
        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">{cId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <form onSubmit={handleSaveClient} className="space-y-3">
                <div>
                  <label className={labelClass}>Nombre Completo</label>
                  <input required value={cName} onChange={e=>setCName(e.target.value)} className={inputClass} placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className={labelClass}>Cédula / RIF</label>
                  <input required value={cCedula} onChange={e=>setCCedula(e.target.value)} className={inputClass} placeholder="V-12345678" />
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input value={cPhone} onChange={e=>setCPhone(e.target.value)} className={inputClass} placeholder="0414-0000000" />
                </div>
                <div>
                  <label className={labelClass}>Dirección</label>
                  <textarea value={cAddress} onChange={e=>setCAddress(e.target.value)} className={inputClass} rows={2} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-hc-pink text-white py-2 rounded-md hover:bg-hc-pinkHover text-sm font-medium">Guardar</button>
                  {cId && <button type="button" onClick={resetClientForm} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 text-sm">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="font-bold text-gray-800 mb-4">Lista de Clientes ({clients.length})</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {clients.map(client => (
                  <div key={client.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-800">{client.name} <span className="text-sm font-normal text-gray-500 ml-2">{client.cedula}</span></div>
                      <div className="text-xs text-gray-500">{client.phone} • {patients.filter(p=>p.clientId===client.id).length} paciente(s)</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {setCId(client.id); setCName(client.name); setCCedula(client.cedula); setCAddress(client.address); setCPhone(client.phone);}} className="p-1.5 text-hc-blue hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(window.confirm('¿Borrar cliente y desenlazar sus pacientes?')) deleteClient(client.id) }} className="p-1.5 text-hc-gray hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
                {clients.length === 0 && <p className="text-gray-500 italic">No hay clientes registrados.</p>}
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-4">{pId ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>
              <form onSubmit={handleSavePatient} className="space-y-3">
                <div>
                  <label className={labelClass}>Cliente (Dueño)</label>
                  <select required value={pClientId} onChange={e=>setPClientId(e.target.value)} className={inputClass}>
                    <option value="">Seleccione un cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.cedula})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Nombre del Animal</label>
                  <input required value={pName} onChange={e=>setPName(e.target.value)} className={inputClass} placeholder="Ej. Luna" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Especie</label>
                    <input required value={pSpecies} onChange={e=>setPSpecies(e.target.value)} className={inputClass} placeholder="Canino, Felino..." />
                  </div>
                  <div>
                    <label className={labelClass}>Raza</label>
                    <input value={pBreed} onChange={e=>setPBreed(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <details className="pt-2">
                  <summary className="text-xs text-hc-blue font-semibold cursor-pointer mb-2">¿Traído por un tercero?</summary>
                  <div className="space-y-2 p-2 bg-white rounded border border-blue-100">
                    <div>
                      <label className={labelClass}>Nombre del Tercero</label>
                      <input value={pThirdName} onChange={e=>setPThirdName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Cédula del Tercero</label>
                      <input value={pThirdCedula} onChange={e=>setPThirdCedula(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </details>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-hc-blue text-white py-2 rounded-md hover:bg-blue-500 text-sm font-medium">Guardar</button>
                  {pId && <button type="button" onClick={resetPatientForm} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 text-sm">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="font-bold text-gray-800 mb-4">Lista de Pacientes ({patients.length})</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {patients.map(pat => {
                  const owner = clients.find(c => c.id === pat.clientId);
                  return (
                  <div key={pat.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-800">{pat.name} <span className="text-sm font-normal text-gray-500 ml-2">{pat.species} - {pat.breed}</span></div>
                      <div className="text-xs text-gray-500">Dueño: {owner ? owner.name : 'Desconocido'} {pat.thirdPartyName && `(Traído por: ${pat.thirdPartyName})`}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {setPId(pat.id); setPClientId(pat.clientId); setPName(pat.name); setPSpecies(pat.species); setPBreed(pat.breed); setPThirdName(pat.thirdPartyName||''); setPThirdCedula(pat.thirdPartyCedula||'');}} className="p-1.5 text-hc-blue hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(window.confirm('¿Borrar paciente?')) deletePatient(pat.id) }} className="p-1.5 text-hc-gray hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                  </div>
                )})}
                {patients.length === 0 && <p className="text-gray-500 italic">No hay pacientes registrados.</p>}
              </div>
            </div>
          </div>
        )}

        {/* VETS TAB */}
        {activeTab === 'vets' && (
           <div className="flex flex-col items-center py-8 text-center text-gray-500">
             <Stethoscope size={48} className="text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-700">Módulo de Veterinarios</h3>
             <p className="max-w-md mt-2 mb-6">Actualmente hay {vets.length} veterinario(s) registrado(s). Este módulo puede extenderse para mostrar el historial de consultas de cada uno.</p>
             <div className="w-full max-w-lg bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                {vets.map(v => (
                  <div key={v.id} className="font-bold text-gray-800 py-2 border-b border-gray-200 last:border-0">{v.name} <span className="text-sm font-normal text-gray-500 ml-2">{v.specialty}</span></div>
                ))}
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default DirectoryManager;
