import React from 'react';
import { Plus, Users } from 'lucide-react';
import { useLeadsStore } from '../store/useLeadsStore';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Button } from '../components/ui/Button';

export const LeadsPage: React.FC = () => {
  const { leads, openForm } = useLeadsStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-900">Leads</h1>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>
        <Button onClick={() => openForm()}>
          <Plus size={15} />
          Nuevo lead
        </Button>
      </div>

      <LeadFilters />
      <LeadTable />
      <LeadForm />
    </div>
  );
};
