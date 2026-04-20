export type LeadSource = 'instagram' | 'facebook' | 'landing_page' | 'referido' | 'otro';

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fuente: LeadSource;
  producto_interes?: string;
  presupuesto?: number;
  fecha_creacion: string; // ISO string
}

export interface LeadFilters {
  search: string;
  fuente: LeadSource | '';
  fecha_desde: string;
  fecha_hasta: string;
}

export const SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'referido', label: 'Referido' },
  { value: 'otro', label: 'Otro' },
];

export const SOURCE_COLORS: Record<LeadSource, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  landing_page: '#10B981',
  referido: '#F59E0B',
  otro: '#6B7280',
};
