import React, { createContext, useContext, useState, useCallback } from "react";
import { EventData, BudgetItem, Guest, Supplier } from "@/types/event";

interface EventContextType {
  events: EventData[];
  budgetItems: BudgetItem[];
  guests: Guest[];
  addEvent: (event: Omit<EventData, "id" | "createdAt">) => void;
  updateEvent: (id: string, event: Partial<EventData>) => void;
  deleteEvent: (id: string) => void;
  addBudgetItem: (item: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (id: string, item: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  addSupplier: (budgetItemId: string, supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (budgetItemId: string, supplierId: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (budgetItemId: string, supplierId: string) => void;
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuest: (id: string, guest: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

const SAMPLE_EVENTS: EventData[] = [
  { id: "e1", name: "Conferência Tech 2026", iniDate: "2026-05-16", iniTime: "09:00", endDate: "2026-05-17", endTime: "09:00", location: "Centro de Convenções SP", budget: 50000, status: "Confirmado", createdAt: "2026-04-01" },
  { id: "e2", name: "Workshop de Design", iniDate: "2026-06-20", iniTime: "14:00", endDate: "2026-06-20", endTime: "14:00", location: "Hub Criativo RJ", budget: 15000, status: "Planejamento", createdAt: "2026-04-05" },
  { id: "e3", name: "Festa de Fim de Ano", iniDate: "2026-12-18", iniTime: "20:00", endDate: "2026-12-18", endTime: "20:00", location: "Espaço Jardins", budget: 80000, status: "Planejamento", createdAt: "2026-04-10" },
];

const SAMPLE_BUDGET_ITEMS: BudgetItem[] = [
  { id: "b1", eventId: "e1", name: "Buffet", suppliers: [
    { id: "s1", company: "Buffet Premium", price: 12000, contact: "(11) 99999-0001", status: "Contrato Fechado" },
    { id: "s2", company: "Gourmet Express", price: 15000, contact: "(11) 99999-0002", status: "Descartado" },
  ]},
  { id: "b2", eventId: "e1", name: "Som e Iluminação", suppliers: [
    { id: "s3", company: "AudioMax", price: 8000, contact: "(11) 99999-0003", status: "Em negociação" },
  ]},
  { id: "b3", eventId: "e1", name: "Espaço", suppliers: [
    { id: "s4", company: "Centro de Convenções SP", price: 20000, contact: "(11) 99999-0004", status: "Contrato Fechado" },
  ]},
];

const SAMPLE_GUESTS: Guest[] = [
  { id: "g1", eventId: "e1", name: "Ana Silva", email: "ana@email.com", phone: "(11) 98888-0001", status: "Confirmado" },
  { id: "g2", eventId: "e1", name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 98888-0002", status: "Pendente" },
  { id: "g3", eventId: "e1", name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 98888-0003", status: "Recusado" },
];

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventData[]>(SAMPLE_EVENTS);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(SAMPLE_BUDGET_ITEMS);
  const [guests, setGuests] = useState<Guest[]>(SAMPLE_GUESTS);

  const addEvent = useCallback((event: Omit<EventData, "id" | "createdAt">) => {
    setEvents(prev => [...prev, { ...event, id: generateId(), createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const updateEvent = useCallback((id: string, data: Partial<EventData>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setBudgetItems(prev => prev.filter(b => b.eventId !== id));
    setGuests(prev => prev.filter(g => g.eventId !== id));
  }, []);

  const addBudgetItem = useCallback((item: Omit<BudgetItem, "id">) => {
    setBudgetItems(prev => [...prev, { ...item, id: generateId() }]);
  }, []);

  const updateBudgetItem = useCallback((id: string, data: Partial<BudgetItem>) => {
    setBudgetItems(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  }, []);

  const deleteBudgetItem = useCallback((id: string) => {
    setBudgetItems(prev => prev.filter(b => b.id !== id));
  }, []);

  const addSupplier = useCallback((budgetItemId: string, supplier: Omit<Supplier, "id">) => {
    setBudgetItems(prev => prev.map(b => b.id === budgetItemId
      ? { ...b, suppliers: [...b.suppliers, { ...supplier, id: generateId() }] }
      : b
    ));
  }, []);

  const updateSupplier = useCallback((budgetItemId: string, supplierId: string, data: Partial<Supplier>) => {
    setBudgetItems(prev => prev.map(b => b.id === budgetItemId
      ? { ...b, suppliers: b.suppliers.map(s => s.id === supplierId ? { ...s, ...data } : s) }
      : b
    ));
  }, []);

  const deleteSupplier = useCallback((budgetItemId: string, supplierId: string) => {
    setBudgetItems(prev => prev.map(b => b.id === budgetItemId
      ? { ...b, suppliers: b.suppliers.filter(s => s.id !== supplierId) }
      : b
    ));
  }, []);

  const addGuest = useCallback((guest: Omit<Guest, "id">) => {
    setGuests(prev => [...prev, { ...guest, id: generateId() }]);
  }, []);

  const updateGuest = useCallback((id: string, data: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  }, []);

  const deleteGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  }, []);

  return (
    <EventContext.Provider value={{
      events, budgetItems, guests,
      addEvent, updateEvent, deleteEvent,
      addBudgetItem, updateBudgetItem, deleteBudgetItem,
      addSupplier, updateSupplier, deleteSupplier,
      addGuest, updateGuest, deleteGuest,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used within EventProvider");
  return ctx;
}
