import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeadForm } from '@/components/leads/LeadForm';

export default function NewLeadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Add New Lead" />
      <div className="p-6 md:p-8 flex-1 bg-slate-50/50">
        <LeadForm />
      </div>
    </div>
  );
}
