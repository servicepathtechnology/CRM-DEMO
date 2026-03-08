"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { useLead } from '@/hooks/useLeads';
import { LeadProfile } from '@/components/lead-detail/LeadProfile';
import { PipelineStepper } from '@/components/lead-detail/PipelineStepper';
import { AgentAssignment } from '@/components/lead-detail/AgentAssignment';
import { FollowUpWidget } from '@/components/lead-detail/FollowUpWidget';
import { AddActivityForm } from '@/components/lead-detail/AddActivityForm';
import { ActivityFeed } from '@/components/lead-detail/ActivityFeed';
import { PencilLine, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  const { lead, isLoading, error, mutate } = useLead(leadId);

  // Quick refresh mechanism
  const refreshLead = () => {
    mutate();
  };

  const handleDelete = async () => {
    if (!lead) return;
    if (window.confirm(`Are you sure you want to delete ${lead.name}? This cannot be undone.`)) {
      try {
        await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
        router.push('/leads');
      } catch (err) {
        console.error('Failed to delete');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Loading Lead..." />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Lead Not Found" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Lead Not Found</h2>
          <Button onClick={() => router.push('/leads')}>Return to Leads</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <TopBar title="Lead Details" />
      
      <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
        
        {/* Navigation & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link href="/leads" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Leads
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href={`/leads/${lead.id}/edit`}>
              <Button variant="secondary" className="bg-white">
                <PencilLine className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Stepper */}
        <PipelineStepper leadId={lead.id} currentStage={lead.status} onStageChange={refreshLead} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Core Data */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <LeadProfile lead={lead} />
            
            {/* Activities Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex-1">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Activity Timeline</h3>
              </div>
              
              <AddActivityForm leadId={lead.id} onActivityAdded={refreshLead} />
              <ActivityFeed activities={lead.activities || []} />
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-1 space-y-6">
            <AgentAssignment leadId={lead.id} currentAgent={lead.assignedTo} onUpdate={refreshLead} />
            <FollowUpWidget leadId={lead.id} currentDate={lead.followUpDate || undefined} onUpdate={refreshLead} />
          </div>

        </div>

      </div>
    </div>
  );
}
