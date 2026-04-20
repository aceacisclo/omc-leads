import React from 'react';
import { Sparkles } from 'lucide-react';
import { AISummary } from '../components/ai/AISummary';

export const AISummaryPage: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Sparkles size={20} className="text-indigo-600" />
      <h1 className="text-lg font-semibold text-gray-900">Resumen inteligente</h1>
    </div>
    <p className="text-sm text-gray-500">
      Genera un análisis ejecutivo de tus leads usando lógica local con los datos disponibles.
    </p>
    <AISummary />
  </div>
);
