import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, LeadFilters } from '../types/lead';
import { initialLeads } from '../data/initialLeads';

interface LeadsStore {
  leads: Lead[];
  filters: LeadFilters;
  currentPage: number;
  pageSize: number;
  selectedLead: Lead | null;
  isFormOpen: boolean;
  isDetailOpen: boolean;
  editingLead: Lead | null;

  addLead: (lead: Omit<Lead, 'id' | 'fecha_creacion'>) => void;
  updateLead: (id: string, data: Partial<Omit<Lead, 'id'>>) => void;
  deleteLead: (id: string) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  openForm: (lead?: Lead) => void;
  closeForm: () => void;
  openDetail: (lead: Lead) => void;
  closeDetail: () => void;
}

const defaultFilters: LeadFilters = {
  search: '',
  fuente: '',
  fecha_desde: '',
  fecha_hasta: '',
};

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set) => ({
      leads: initialLeads,
      filters: defaultFilters,
      currentPage: 1,
      pageSize: 8,
      selectedLead: null,
      isFormOpen: false,
      isDetailOpen: false,
      editingLead: null,

      addLead: (data) =>
        set((state) => ({
          leads: [
            {
              ...data,
              id: crypto.randomUUID(),
              fecha_creacion: new Date().toISOString(),
            },
            ...state.leads,
          ],
          currentPage: 1,
        })),

      updateLead: (id, data) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1,
        })),

      resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),

      setCurrentPage: (page) => set({ currentPage: page }),

      openForm: (lead) =>
        set({ isFormOpen: true, editingLead: lead ?? null }),

      closeForm: () => set({ isFormOpen: false, editingLead: null }),

      openDetail: (lead) =>
        set({ selectedLead: lead, isDetailOpen: true }),

      closeDetail: () => set({ isDetailOpen: false, selectedLead: null }),
    }),
    {
      name: 'omc-leads-storage',
      partialize: (state) => ({ leads: state.leads }),
      onRehydrateStorage: () => (state) => {
        if (state && state.leads.length === 0) {
          state.leads = initialLeads;
        }
      },
    }
  )
);
