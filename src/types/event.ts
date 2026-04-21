export type EventStatus = "Planejamento" | "Confirmado" | "Concluído" | "Cancelado";
export type NegotiationStatus = "Buscando contato" | "Em negociação" | "Contrato Fechado" | "Descartado";
export type GuestStatus = "Pendente" | "Confirmado" | "Recusado";

export interface EventData {
  id: string;
  name: string;
  iniDate: string;
  endDate: string;
  iniTime: string;
  endTime: string;
  location: string;
  budget: number;
  status: EventStatus;
  createdAt: string;
}

export interface Supplier {
  id: string;
  company: string;
  price: number;
  contact: string;
  status: NegotiationStatus;
  winner: boolean;
}

export interface BudgetItem {
  id: string;
  eventId: string;
  name: string;
  suppliers: Supplier[];
  hasAWinner: boolean;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  status: GuestStatus;
}
