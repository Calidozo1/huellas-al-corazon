export interface Client {
  id: string;
  name: string;
  cedula: string;
  address: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed: string;
  thirdPartyName?: string;
  thirdPartyCedula?: string;
  createdAt: string;
}

export interface Vet {
  id: string;
  name: string;
  specialty: string;
  cedula: string;
  active: boolean;
  createdAt: string;
}

export interface LineItem {
  id: string;
  concept: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string; // Internal ID
  invoiceNumber: string;
  date: string; // ISO string
  
  // Relations (Stored snapshots in case the original entity changes/is deleted)
  clientId: string;
  clientSnapshot: { name: string; cedula: string; address: string };
  
  patientId: string;
  patientSnapshot: { name: string; species: string; breed: string; thirdPartyName?: string; thirdPartyCedula?: string };

  vetId: string;
  vetSnapshot: { name: string };

  // Clinic
  clinicName: string;
  clinicAddress: string;
  clinicNif: string;

  // Items
  items: LineItem[];

  // Payment
  paymentMethod: 'Transferencia' | 'Efectivo' | 'Tarjeta' | 'Pago Móvil' | 'Zelle' | 'Punto de Venta' | '';
  paymentReference: string;

  // Options
  hasIva: boolean;
  applyIgtf: boolean;

  // Totals
  subtotal: number;
  ivaAmount: number;
  igtfAmount: number;
  total: number;
}
