import { Lead, LeadSource, SOURCES } from '../types/lead';
import { subDays, isAfter, parseISO } from 'date-fns';

export interface AISummaryResult {
  analisis_general: string;
  fuente_principal: string;
  presupuesto_promedio: string;
  tendencia: string;
  recomendaciones: string[];
}

export function generateLocalSummary(
  leads: Lead[],
  filterSource?: LeadSource | '',
  filterDateFrom?: string,
  filterDateTo?: string
): AISummaryResult {
  let filtered = [...leads];

  if (filterSource) {
    filtered = filtered.filter((l) => l.fuente === filterSource);
  }
  if (filterDateFrom) {
    filtered = filtered.filter(
      (l) => l.fecha_creacion >= filterDateFrom
    );
  }
  if (filterDateTo) {
    filtered = filtered.filter(
      (l) => l.fecha_creacion <= filterDateTo + 'T23:59:59Z'
    );
  }

  const total = filtered.length;
  if (total === 0) {
    return {
      analisis_general: 'No hay leads para el período o fuente seleccionados.',
      fuente_principal: 'N/A',
      presupuesto_promedio: 'N/A',
      tendencia: 'Sin datos suficientes.',
      recomendaciones: ['Ajusta los filtros para incluir más leads en el análisis.'],
    };
  }

  // Count by source
  const bySource: Record<string, number> = {};
  for (const l of filtered) {
    bySource[l.fuente] = (bySource[l.fuente] ?? 0) + 1;
  }

  const topSourceKey = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0][0] as LeadSource;
  const topSourceLabel = SOURCES.find((s) => s.value === topSourceKey)?.label ?? topSourceKey;
  const topSourceCount = bySource[topSourceKey];
  const topSourcePct = Math.round((topSourceCount / total) * 100);

  // Budget stats
  const withBudget = filtered.filter((l) => l.presupuesto !== undefined && l.presupuesto !== null);
  const avgBudget =
    withBudget.length > 0
      ? Math.round(withBudget.reduce((s, l) => s + (l.presupuesto ?? 0), 0) / withBudget.length)
      : null;

  // Recent trend (last 7 days)
  const cutoff = subDays(new Date(), 7);
  const recent = filtered.filter((l) => isAfter(parseISO(l.fecha_creacion), cutoff));
  const recentPct = Math.round((recent.length / total) * 100);

  // Build analysis
  const analisis_general = `Se analizaron ${total} lead${total !== 1 ? 's' : ''} en el período seleccionado. La principal fuente de captación es ${topSourceLabel}, concentrando el ${topSourcePct}% del total. ${avgBudget !== null ? `El presupuesto promedio declarado es de $${avgBudget} USD.` : 'La mayoría de leads no especificó presupuesto.'}`;

  const tendencia =
    recent.length > 0
      ? `En los últimos 7 días se registraron ${recent.length} nuevo${recent.length !== 1 ? 's' : ''} lead${recent.length !== 1 ? 's' : ''} (${recentPct}% del total), indicando ${recentPct >= 30 ? 'una tendencia activa de captación' : 'un ritmo moderado'}.`
      : 'No se registraron leads en los últimos 7 días. Se recomienda revisar las campañas activas.';

  // Recommendations
  const recomendaciones: string[] = [];

  recomendaciones.push(
    `Concentrar esfuerzos en ${topSourceLabel}, que genera el mayor volumen de leads (${topSourceCount} de ${total}).`
  );

  const lowSources = Object.entries(bySource)
    .filter(([, count]) => count < Math.max(1, Math.floor(total * 0.1)))
    .map(([src]) => SOURCES.find((s) => s.value === src)?.label ?? src);

  if (lowSources.length > 0) {
    recomendaciones.push(
      `Evaluar la inversión en fuentes con bajo rendimiento: ${lowSources.join(', ')}.`
    );
  }

  if (avgBudget !== null && avgBudget > 500) {
    recomendaciones.push(
      `El presupuesto promedio de $${avgBudget} USD sugiere potencial para ofertas premium. Considera crear un funnel de alta conversión.`
    );
  } else if (avgBudget !== null && avgBudget <= 200) {
    recomendaciones.push(
      `El presupuesto promedio es bajo ($${avgBudget} USD). Considera productos de entrada o estrategias de upselling.`
    );
  }

  if (recentPct < 20) {
    recomendaciones.push('El volumen de captación reciente es bajo. Revisar campañas y publicaciones activas.');
  } else {
    recomendaciones.push('Mantener el ritmo de captación actual y hacer seguimiento rápido a los leads recientes.');
  }

  return {
    analisis_general,
    fuente_principal: `${topSourceLabel} (${topSourceCount} leads — ${topSourcePct}%)`,
    presupuesto_promedio: avgBudget !== null ? `$${avgBudget} USD` : 'No disponible',
    tendencia,
    recomendaciones,
  };
}
