"use client";

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { AGENTS, LEAD_SOURCES, PIPELINE_STAGES } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';

interface LeadFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function LeadFilters({ onFilterChange }: LeadFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    assignedTo: '',
    priority: '',
  });

  // Notify parent of changes to debounced search or filters
  useEffect(() => {
    onFilterChange({ search: debouncedSearch, ...filters });
  }, [debouncedSearch, filters, onFilterChange]);

  const handleReset = () => {
    setSearchTerm('');
    setFilters({ status: '', source: '', assignedTo: '', priority: '' });
  };

  const hasActiveFilters = searchTerm || filters.status || filters.source || filters.assignedTo || filters.priority;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
      <div className="w-full md:w-80 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search name, email, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <Select 
          value={filters.status} 
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="py-2 bg-slate-50 rounded-lg text-sm"
          wrapperClassName="w-full sm:w-[140px]"
        >
          <option value="">All Statuses</option>
          {PIPELINE_STAGES.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </Select>

        <Select 
          value={filters.assignedTo} 
          onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
          className="py-2 bg-slate-50 rounded-lg text-sm"
          wrapperClassName="w-full sm:w-[140px]"
        >
          <option value="">All Agents</option>
          {AGENTS.map(agent => (
            <option key={agent.id} value={agent.name}>{agent.name}</option>
          ))}
        </Select>
        
        <Select 
          value={filters.source} 
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="py-2 bg-slate-50 rounded-lg text-sm"
          wrapperClassName="w-full sm:w-[140px]"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </Select>

        {hasActiveFilters && (
          <button 
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 px-2 py-2 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
