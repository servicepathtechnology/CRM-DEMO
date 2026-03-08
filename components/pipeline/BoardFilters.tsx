"use client";

import React from 'react';
import { Search, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { AGENTS, LEAD_SOURCES } from '@/lib/constants';

interface BoardFiltersProps {
  filters: {
    search: string;
    assignedTo: string;
    source: string;
    priority: string;
  };
  setFilters: (filters: any) => void;
}

export function BoardFilters({ filters, setFilters }: BoardFiltersProps) {
  
  const handleReset = () => {
    setFilters({ search: '', assignedTo: '', source: '', priority: '' });
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex-1 w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search board..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full sm:max-w-xs pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <Select 
          value={filters.assignedTo} 
          onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
          className="w-full sm:w-36 py-2.5 bg-slate-50"
        >
          <option value="">All Agents</option>
          {AGENTS.map(agent => (
            <option key={agent.id} value={agent.name}>{agent.name}</option>
          ))}
        </Select>
        
        <Select 
          value={filters.source} 
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="w-full sm:w-36 py-2.5 bg-slate-50"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </Select>

        <Select 
          value={filters.priority} 
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="w-full sm:w-36 py-2.5 bg-slate-50"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>

        {(filters.search || filters.assignedTo || filters.source || filters.priority) && (
          <button 
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center gap-1 px-2"
          >
            <X className="w-4 h-4" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
