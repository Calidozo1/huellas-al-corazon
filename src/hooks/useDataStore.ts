import { useState, useEffect } from 'react';
import { Client, Patient, Vet, Invoice } from '../types';

// Changing storage keys to start fresh
const STORAGE_KEYS = {
  clients: 'hc_clients_v2',
  patients: 'hc_patients_v2',
  vets: 'hc_vets_v2',
  invoices: 'hc_invoices_v2'
};

const INITIAL_VET: Vet = {
  id: 'vet-1',
  name: 'Dr. Alejandro Martínez',
  specialty: 'Medicina General',
  cedula: 'V-12345678',
  active: true,
  createdAt: new Date().toISOString()
};

export function useDataStore() {
  // Load data synchronously
  const load = (key: string, defaultData: any = []) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } 
      catch (e) { return defaultData; }
    }
    return defaultData;
  };

  const [clients, setClients] = useState<Client[]>(() => load(STORAGE_KEYS.clients));
  const [patients, setPatients] = useState<Patient[]>(() => load(STORAGE_KEYS.patients));
  const [vets, setVets] = useState<Vet[]>(() => {
    const loaded = load(STORAGE_KEYS.vets);
    if (loaded.length === 0) {
      localStorage.setItem(STORAGE_KEYS.vets, JSON.stringify([INITIAL_VET]));
      return [INITIAL_VET];
    }
    return loaded;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => load(STORAGE_KEYS.invoices));
  const isLoaded = true;

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- Clients ---
  const saveClient = (client: Client) => {
    const updated = [...clients];
    const idx = updated.findIndex(c => c.id === client.id);
    if (idx >= 0) updated[idx] = client;
    else updated.push(client);
    setClients(updated);
    saveToStorage(STORAGE_KEYS.clients, updated);
  };
  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    saveToStorage(STORAGE_KEYS.clients, updated);
    // Casacade delete patients? For now, let's keep it simple or do it here
    const remainingPatients = patients.filter(p => p.clientId !== id);
    if (remainingPatients.length !== patients.length) {
      setPatients(remainingPatients);
      saveToStorage(STORAGE_KEYS.patients, remainingPatients);
    }
  };

  // --- Patients ---
  const savePatient = (patient: Patient) => {
    const updated = [...patients];
    const idx = updated.findIndex(p => p.id === patient.id);
    if (idx >= 0) updated[idx] = patient;
    else updated.push(patient);
    setPatients(updated);
    saveToStorage(STORAGE_KEYS.patients, updated);
  };
  const deletePatient = (id: string) => {
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
    saveToStorage(STORAGE_KEYS.patients, updated);
  };

  // --- Vets ---
  const saveVet = (vet: Vet) => {
    const updated = [...vets];
    const idx = updated.findIndex(v => v.id === vet.id);
    if (idx >= 0) updated[idx] = vet;
    else updated.push(vet);
    setVets(updated);
    saveToStorage(STORAGE_KEYS.vets, updated);
  };
  const deleteVet = (id: string) => {
    const updated = vets.filter(v => v.id !== id);
    setVets(updated);
    saveToStorage(STORAGE_KEYS.vets, updated);
  };

  // --- Invoices ---
  const saveInvoice = (invoice: Invoice) => {
    const updated = [...invoices];
    const idx = updated.findIndex(i => i.id === invoice.id);
    if (idx >= 0) updated[idx] = invoice;
    else updated.push(invoice);
    setInvoices(updated);
    saveToStorage(STORAGE_KEYS.invoices, updated);
  };
  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(i => i.id !== id);
    setInvoices(updated);
    saveToStorage(STORAGE_KEYS.invoices, updated);
  };
  const getInvoice = (id: string) => invoices.find(i => i.id === id);

  return {
    isLoaded,
    clients, saveClient, deleteClient,
    patients, savePatient, deletePatient,
    vets, saveVet, deleteVet,
    invoices, saveInvoice, deleteInvoice, getInvoice
  };
}
