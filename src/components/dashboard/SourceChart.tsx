import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Lead, LeadSource, SOURCES, SOURCE_COLORS } from '../../types/lead';

interface SourceChartProps {
  leads: Lead[];
}

export const SourceChart: React.FC<SourceChartProps> = ({ leads }) => {
  const data = SOURCES.map((s) => ({
    name: s.label,
    value: leads.filter((l) => l.fuente === s.value).length,
    source: s.value as LeadSource,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 h-64 flex items-center justify-center text-gray-400 text-sm">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Leads por fuente</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
            formatter={(v: number) => [v, 'Leads']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.source} fill={SOURCE_COLORS[entry.source]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
