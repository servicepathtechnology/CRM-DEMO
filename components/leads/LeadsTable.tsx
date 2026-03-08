"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { STAGE_COLORS, SOURCE_COLORS, AGENTS } from '@/lib/constants';
import { formatCurrency, formatRelativeDate } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertCircle, CalendarClock, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (allIds: string[]) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
}

export function LeadsTable({ leads, selectedIds, onToggleSelect, onToggleSelectAll, sortConfig, onSort }: LeadsTableProps) {
  
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onToggleSelectAll([]);
    } else {
      onToggleSelectAll(leads.map(l => l.id));
    }
  };

  const getAgentAvatar = (nameName: string) => {
    const agent = AGENTS.find(a => a.name === nameName);
    if (!agent) return { color: 'bg-slate-200 text-slate-600', initials: '?' };
    return { color: agent.color, initials: agent.avatar };
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 inline-block ml-1" /> : <ArrowDown className="w-3 h-3 inline-block ml-1" />;
  };

  const Th = ({ label, columnKey, className }: { label: string; columnKey: string; className?: string }) => (
    <th 
      className={`px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors ${className}`}
      onClick={() => onSort(columnKey)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 whitespace-nowrap">
            <tr>
              <th className="px-4 py-3 w-10">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <Th label="Name" columnKey="name" />
              <Th label="Status" columnKey="status" />
              <Th label="Source" columnKey="leadSource" />
              <Th label="Assigned To" columnKey="assignedTo" />
              <Th label="Value" columnKey="value" />
              <Th label="Follow-Up" columnKey="followUpDate" />
              <Th label="Created" columnKey="createdAt" />
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-base font-medium mb-1">No leads found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const stageDesign = STAGE_COLORS[lead.status] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
                const sourceClass = SOURCE_COLORS[lead.leadSource] || 'bg-slate-100 text-slate-700';
                const agent = getAgentAvatar(lead.assignedTo);
                const isSelected = selectedIds.includes(lead.id);
                
                let followUpStatus = null;
                if (lead.followUpDate) {
                  const diff = differenceInDays(parseISO(lead.followUpDate), new Date());
                  const isOverdue = diff < 0;
                  followUpStatus = (
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
                      <span className="truncate max-w-[100px]">{formatRelativeDate(lead.followUpDate)}</span>
                    </div>
                  );
                }

                return (
                  <tr 
                    key={lead.id} 
                    className={`transition-colors hover:bg-slate-50 ${isSelected ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => onToggleSelect(lead.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/leads/${lead.id}`} className="block group">
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]" title={lead.email}>
                          {lead.company || lead.email}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge colorClass={`${stageDesign.bg} ${stageDesign.text}`} dotClass={stageDesign.dot}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge colorClass={sourceClass}>
                        {lead.leadSource}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2" title={lead.assignedTo}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white ${agent.color}`}>
                          {agent.initials}
                        </div>
                        <span className="text-sm text-slate-700 truncate max-w-[100px] hidden lg:inline-block">{lead.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {formatCurrency(lead.value)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {followUpStatus || <span className="text-slate-400 text-xs">-</span>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-xs">
                      {formatRelativeDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <Link 
                        href={`/leads/${lead.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
