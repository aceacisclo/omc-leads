import React, { useMemo } from 'react';
import { subDays, isAfter, parseISO } from 'date-fns';
import { Users, TrendingUp, DollarSign, Clock, LayoutDashboard } from 'lucide-react';
import { useLeadsStore } from '../store/useLeadsStore';
import { SOURCES, LeadSource, SOURCE_COLORS } from '../types/lead';
import { StatCard } from '../components/dashboard/StatCard';
import { SourceChart } from '../components/dashboard/SourceChart';

export const DashboardPage: React.FC = () => {
  const { leads } = useLeadsStore();

  const stats = useMemo(() => {
    const total = leads.length;

    const withBudget = leads.filter((l) => l.presupuesto !== undefined);
    const avgBudget =
      withBudget.length > 0
        ? Math.round(
            withBudget.reduce((s, l) => s + (l.presupuesto ?? 0), 0) / withBudget.length
          )
        : 0;

    const cutoff = subDays(new Date(), 7);
    const recent = leads.filter((l) => isAfter(parseISO(l.fecha_creacion), cutoff)).length;

    const bySource = SOURCES.map((s) => ({
      label: s.label,
      value: s.value as LeadSource,
      count: leads.filter((l) => l.fuente === s.value).length,
    })).sort((a, b) => b.count - a.count);

    return { total, avgBudget, recent, bySource };
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard size={20} className="text-indigo-600" />
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de leads"
          value={stats.total}
          icon={<Users size={18} />}
          color="indigo"
          subtitle="Todos los registros"
        />
        <StatCard
          title="Últimos 7 días"
          value={stats.recent}
          icon={<Clock size={18} />}
          color="emerald"
          subtitle="Nuevos leads recientes"
        />
        <StatCard
          title="Presupuesto promedio"
          value={`$${stats.avgBudget.toLocaleString('es-CO')}`}
          icon={<DollarSign size={18} />}
          color="amber"
          subtitle="USD declarados"
        />
        <StatCard
          title="Fuente top"
          value={stats.bySource[0]?.label ?? '—'}
          icon={<TrendingUp size={18} />}
          color="rose"
          subtitle={`${stats.bySource[0]?.count ?? 0} leads`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourceChart leads={leads} />

        {/* Source breakdown table */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Desglose por fuente</h3>
          <div className="space-y-3">
            {stats.bySource
              .filter((s) => s.count > 0)
              .map((s) => {
                const pct =
                  stats.total > 0 ? Math.round((s.count / stats.total) * 100) : 0;
                return (
                  <div key={s.value}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{s.label}</span>
                      <span className="text-sm font-medium text-gray-800">
                        {s.count}{' '}
                        <span className="text-gray-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: SOURCE_COLORS[s.value],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
