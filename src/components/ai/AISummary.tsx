import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import { useLeadsStore } from '../../store/useLeadsStore';
import { LeadSource, SOURCES } from '../../types/lead';
import { generateLocalSummary, AISummaryResult } from '../../utils/aiSummary';
import { Button } from '../ui/Button';

export const AISummary: React.FC = () => {
  const { leads } = useLeadsStore();
  const [filterSource, setFilterSource] = useState<LeadSource | ''>('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [result, setResult] = useState<AISummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const summary = generateLocalSummary(leads, filterSource, filterFrom, filterTo);
      setResult(summary);
    } catch {
      setError('No se pudo generar el resumen. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Configurar análisis</h3>
            <p className="text-xs text-gray-400">Filtra los datos antes de generar el resumen</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fuente</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as LeadSource | '')}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Todas las fuentes</option>
              {SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <Button onClick={handleGenerate} loading={loading} className="w-full sm:w-auto">
          <Sparkles size={14} />
          {loading ? 'Analizando...' : 'Generar resumen inteligente'}
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-indigo-100 p-10 flex flex-col items-center gap-3 text-indigo-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm font-medium">Analizando datos de leads...</p>
          <p className="text-xs text-gray-400">Esto tomará solo un momento</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-5 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={16} className="text-indigo-600" />
              <h4 className="text-sm font-semibold text-indigo-800">Análisis general</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{result.analisis_general}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target size={15} className="text-emerald-600" />
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Fuente principal
                </h4>
              </div>
              <p className="text-sm font-medium text-gray-800">{result.fuente_principal}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-amber-600" />
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Presupuesto promedio
                </h4>
              </div>
              <p className="text-sm font-medium text-gray-800">{result.presupuesto_promedio}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={15} className="text-blue-600" />
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Tendencia reciente
              </h4>
            </div>
            <p className="text-sm text-gray-700">{result.tendencia}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={15} className="text-yellow-600" />
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Recomendaciones
              </h4>
            </div>
            <ul className="space-y-2">
              {result.recomendaciones.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 flex flex-col items-center gap-3 text-gray-400">
          <Sparkles size={32} />
          <p className="text-sm font-medium">Listo para analizar</p>
          <p className="text-xs text-center max-w-xs">
            Configura los filtros opcionales y pulsa "Generar resumen inteligente" para obtener un
            análisis de tus leads.
          </p>
        </div>
      )}
    </div>
  );
};
