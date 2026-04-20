import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import { LeadSource, SOURCES } from '../../types/lead';
import { Button } from '../ui/Button';

export const LeadFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useLeadsStore();

  const hasActiveFilters =
    filters.search || filters.fuente || filters.fecha_desde || filters.fecha_hasta;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Source filter */}
        <select
          value={filters.fuente}
          onChange={(e) => setFilters({ fuente: e.target.value as LeadSource | '' })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Todas las fuentes</option>
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        {/* Date range */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={filters.fecha_desde}
              onChange={(e) => setFilters({ fecha_desde: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={filters.fecha_hasta}
              onChange={(e) => setFilters({ fecha_hasta: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw size={14} />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};
