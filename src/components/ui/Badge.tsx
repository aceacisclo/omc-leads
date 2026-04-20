import React from 'react';
import { LeadSource, SOURCE_COLORS } from '../../types/lead';

interface BadgeProps {
  source: LeadSource;
  label: string;
}

export const SourceBadge: React.FC<BadgeProps> = ({ source, label }) => {
  const color = SOURCE_COLORS[source];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
};
