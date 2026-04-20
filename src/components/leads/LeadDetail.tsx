import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil, Mail, Phone, Tag, DollarSign, Calendar, Globe } from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import { SOURCES } from '../../types/lead';
import { Modal } from '../ui/Modal';
import { SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LeadDetail: React.FC = () => {
  const { isDetailOpen, selectedLead, closeDetail, openForm } = useLeadsStore();

  if (!selectedLead) return null;

  const sourceLabel = SOURCES.find((s) => s.value === selectedLead.fuente)?.label ?? selectedLead.fuente;

  const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: string | number;
    children?: React.ReactNode;
  }> = ({ icon, label, value, children }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800">{children ?? value ?? '—'}</p>
      </div>
    </div>
  );

  return (
    <Modal open={isDetailOpen} onClose={closeDetail} title="Detalle del lead" size="md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-gray-900">{selectedLead.nombre}</h3>
          <SourceBadge source={selectedLead.fuente} label={sourceLabel} />
        </div>
        <p className="text-sm text-gray-400">ID: {selectedLead.id}</p>
      </div>

      <div className="space-y-0.5">
        <InfoRow icon={<Mail size={15} />} label="Email" value={selectedLead.email} />
        <InfoRow icon={<Phone size={15} />} label="Teléfono" value={selectedLead.telefono} />
        <InfoRow icon={<Globe size={15} />} label="Fuente">
          <SourceBadge source={selectedLead.fuente} label={sourceLabel} />
        </InfoRow>
        <InfoRow icon={<Tag size={15} />} label="Producto de interés" value={selectedLead.producto_interes} />
        <InfoRow
          icon={<DollarSign size={15} />}
          label="Presupuesto"
          value={
            selectedLead.presupuesto !== undefined
              ? `$${selectedLead.presupuesto.toLocaleString('es-CO')} USD`
              : undefined
          }
        />
        <InfoRow
          icon={<Calendar size={15} />}
          label="Fecha de creación"
          value={format(parseISO(selectedLead.fecha_creacion), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
        />
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
        <Button
          onClick={() => {
            closeDetail();
            openForm(selectedLead);
          }}
        >
          <Pencil size={14} />
          Editar lead
        </Button>
      </div>
    </Modal>
  );
};
