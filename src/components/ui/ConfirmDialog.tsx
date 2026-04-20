import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3 items-start mb-6">
      <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle size={20} className="text-red-600" />
      </div>
      <p className="text-sm text-gray-600 mt-2">{message}</p>
    </div>
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);
