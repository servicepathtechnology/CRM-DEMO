"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeadForm } from '@/components/leads/LeadForm';
import { useLead } from '@/hooks/useLeads';
import { Loader2 } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';

export default function EditLeadPage() {
  const params = useParams();
  const { lead, isLoading, error } = useLead(params.id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Edit Lead" />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={`Edit Lead: ${lead.name}`} />
      <div className="p-6 md:p-8 flex-1 bg-slate-50/50">
        <LeadForm initialData={lead} isEdit />
      </div>
    </div>
  );
}
