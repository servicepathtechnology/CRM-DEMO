"use client";

import React from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { AGENTS, PIPELINE_STAGES } from '@/lib/constants';
import { Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Lead } from '@/types';
import { leadsToCSV } from '@/lib/csv-export';

interface BulkActionBarProps {
  selectedLeads: Lead[];
  onClearSelection: () => void;
  onBulkUpdate: (field: string, value: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
}

export function BulkActionBar({ selectedLeads, onClearSelection, onBulkUpdate, onBulkDelete }: BulkActionBarProps) {
  
  if (selectedLeads.length === 0) return null;

  const count = selectedLeads.length;

  const handleExport = () => {
    const csvStr = leadsToCSV(selectedLeads);
    // Create a Blob and trigger download
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      onBulkUpdate('status', e.target.value);
      e.target.value = ''; // reset select
    }
  };

  const handleAssignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      onBulkUpdate('assignedTo', e.target.value);
      e.target.value = ''; // reset select
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {count}
          </div>
          <span className="text-sm font-medium">selected</span>
        </div>

        <div className="w-px h-6 bg-slate-700" />

        <div className="flex items-center gap-3">
          <Select 
            onChange={handleStatusChange} 
            className="w-36 py-1.5 px-3 text-xs bg-slate-800 border-slate-700 text-white focus:ring-indigo-500 appearance-none"
            defaultValue=""
          >
            <option value="" disabled className="text-slate-400">Change Status</option>
            {PIPELINE_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
          </Select>

          <Select 
            onChange={handleAssignChange} 
            className="w-36 py-1.5 px-3 text-xs bg-slate-800 border-slate-700 text-white focus:ring-indigo-500 appearance-none"
            defaultValue=""
          >
            <option value="" disabled className="text-slate-400">Assign To</option>
            {AGENTS.map(agent => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
          </Select>
          
          <div className="w-px h-6 bg-slate-700 mx-1" />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport}
            className="text-slate-300 hover:text-white hover:bg-slate-800 px-2 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${count} leads? This action cannot be undone.`)) {
                onBulkDelete();
              }
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>

          <button onClick={onClearSelection} className="ml-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition">
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
