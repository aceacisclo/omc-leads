import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLeadsStore } from '../../store/useLeadsStore';
import { SOURCES } from '../../types/lead';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const sourceValues = ['instagram', 'facebook', 'landing_page', 'referido', 'otro'] as const;

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: z.string().email('Email no válido'),
  telefono: z.string().optional(),
  fuente: z.enum(sourceValues, {
    errorMap: () => ({ message: 'Selecciona una fuente válida' }),
  }),
  producto_interes: z.string().optional(),
  presupuesto: z.preprocess(
    (val) => {
      if (val === '' || val === undefined || val === null) return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(0, 'Debe ser mayor o igual a 0').optional()
  ),
});

type FormData = z.infer<typeof schema>;

export const LeadForm: React.FC = () => {
  const { isFormOpen, editingLead, closeForm, addLead, updateLead } = useLeadsStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: editingLead
      ? {
          nombre: editingLead.nombre,
          email: editingLead.email,
          telefono: editingLead.telefono ?? '',
          fuente: editingLead.fuente,
          producto_interes: editingLead.producto_interes ?? '',
          presupuesto: editingLead.presupuesto,
        }
      : {
          nombre: '',
          email: '',
          telefono: '',
          fuente: undefined,
          producto_interes: '',
          presupuesto: undefined,
        },
  });

  React.useEffect(() => {
    if (isFormOpen) {
      reset(
        editingLead
          ? {
              nombre: editingLead.nombre,
              email: editingLead.email,
              telefono: editingLead.telefono ?? '',
              fuente: editingLead.fuente,
              producto_interes: editingLead.producto_interes ?? '',
              presupuesto: editingLead.presupuesto,
            }
          : {
              nombre: '',
              email: '',
              telefono: '',
              fuente: undefined,
              producto_interes: '',
              presupuesto: undefined,
            }
      );
    }
  }, [isFormOpen, editingLead, reset]);

  const onSubmit = (data: FormData) => {
    if (editingLead) {
      updateLead(editingLead.id, {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || undefined,
        fuente: data.fuente,
        producto_interes: data.producto_interes || undefined,
        presupuesto: data.presupuesto,
      });
    } else {
      addLead({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || undefined,
        fuente: data.fuente,
        producto_interes: data.producto_interes || undefined,
        presupuesto: data.presupuesto,
      });
    }
    closeForm();
  };

  const Field: React.FC<{
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }> = ({ label, error, required, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <Modal
      open={isFormOpen}
      onClose={closeForm}
      title={editingLead ? 'Editar lead' : 'Nuevo lead'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.nombre?.message} required>
            <input
              {...register('nombre')}
              className={inputClass(!!errors.nombre)}
              placeholder="Juan Pérez"
            />
          </Field>

          <Field label="Email" error={errors.email?.message} required>
            <input
              {...register('email')}
              type="email"
              className={inputClass(!!errors.email)}
              placeholder="juan@email.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Teléfono" error={errors.telefono?.message}>
            <input
              {...register('telefono')}
              type="tel"
              className={inputClass(!!errors.telefono)}
              placeholder="+57 300 000 0000"
            />
          </Field>

          <Field label="Fuente" error={errors.fuente?.message} required>
            <select
              {...register('fuente')}
              className={inputClass(!!errors.fuente) + ' bg-white'}
            >
              <option value="">Seleccionar fuente</option>
              {SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Producto de interés" error={errors.producto_interes?.message}>
          <input
            {...register('producto_interes')}
            className={inputClass(!!errors.producto_interes)}
            placeholder="Curso de Marketing Digital"
          />
        </Field>

        <Field label="Presupuesto (USD)" error={errors.presupuesto?.message}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              {...register('presupuesto')}
              type="number"
              min="0"
              step="0.01"
              className={inputClass(!!errors.presupuesto) + ' pl-7'}
              placeholder="0.00"
            />
          </div>
        </Field>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={closeForm}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {editingLead ? 'Guardar cambios' : 'Crear lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
