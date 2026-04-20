import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import { Lead, SOURCES } from '../../types/lead';
import { SourceBadge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { LeadDetail } from './LeadDetail';

type SortField = 'nombre' | 'fecha_creacion' | 'presupuesto' | 'fuente';
type SortDir = 'asc' | 'desc';

export const LeadTable: React.FC = () => {
  const {
    leads,
    filters,
    currentPage,
    pageSize,
    setCurrentPage,
    openForm,
    openDetail,
    deleteLead,
  } = useLeadsStore();

  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: 'fecha_creacion',
    dir: 'desc',
  });
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...leads];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
      );
    }

    if (filters.fuente) {
      result = result.filter((l) => l.fuente === filters.fuente);
    }

    if (filters.fecha_desde) {
      result = result.filter((l) => l.fecha_creacion >= filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      result = result.filter(
        (l) => l.fecha_creacion <= filters.fecha_hasta + 'T23:59:59Z'
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'fecha_creacion') {
        cmp = a.fecha_creacion.localeCompare(b.fecha_creacion);
      } else if (sort.field === 'nombre') {
        cmp = a.nombre.localeCompare(b.nombre);
      } else if (sort.field === 'presupuesto') {
        cmp = (a.presupuesto ?? -1) - (b.presupuesto ?? -1);
      } else if (sort.field === 'fuente') {
        cmp = a.fuente.localeCompare(b.fuente);
      }
      return sort.dir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [leads, filters, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'desc' }
    );
    setCurrentPage(1);
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sort.field !== field) return <ChevronsUpDown size={14} className="text-gray-300" />;
    return sort.dir === 'asc' ? (
      <ChevronUp size={14} className="text-indigo-600" />
    ) : (
      <ChevronDown size={14} className="text-indigo-600" />
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    deleteLead(deleteTarget.id);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  if (filtered.length === 0) {
    const isFiltered =
      filters.search || filters.fuente || filters.fecha_desde || filters.fecha_hasta;
    return (
      <>
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center gap-3 text-gray-400">
          {isFiltered ? (
            <>
              <AlertCircle size={40} />
              <p className="text-sm font-medium">Sin resultados para los filtros actuales</p>
              <p className="text-xs">Intenta cambiar los filtros de búsqueda</p>
            </>
          ) : (
            <>
              <UserX size={40} />
              <p className="text-sm font-medium">No hay leads registrados</p>
              <p className="text-xs">Crea el primer lead usando el botón "Nuevo lead"</p>
            </>
          )}
        </div>
        <LeadDetail />
      </>
    );
  }

  const headerCell = (label: string, field: SortField) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <SortIcon field={field} />
      </span>
    </th>
  );

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {headerCell('Nombre', 'nombre')}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / Teléfono
                </th>
                {headerCell('Fuente', 'fuente')}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                {headerCell('Presupuesto', 'presupuesto')}
                {headerCell('Fecha', 'fecha_creacion')}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.map((lead) => {
                const sourceLabel =
                  SOURCES.find((s) => s.value === lead.fuente)?.label ?? lead.fuente;
                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openDetail(lead)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{lead.nombre}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{lead.email}</div>
                      {lead.telefono && (
                        <div className="text-xs text-gray-400 mt-0.5">{lead.telefono}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <SourceBadge source={lead.fuente} label={sourceLabel} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 truncate max-w-[140px] block">
                        {lead.producto_interes ?? (
                          <span className="text-gray-300">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-700">
                        {lead.presupuesto !== undefined ? (
                          `$${lead.presupuesto.toLocaleString('es-CO')}`
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {format(parseISO(lead.fecha_creacion), 'd MMM yyyy', { locale: es })}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetail(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openForm(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">
              Mostrando {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filtered.length)} de {filtered.length} leads
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const page = start + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1 text-xs border rounded-lg transition ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar lead"
        message={`¿Estás seguro de que quieres eliminar a "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        loading={isDeleting}
      />

      <LeadDetail />
    </>
  );
};
