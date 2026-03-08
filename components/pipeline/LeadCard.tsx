"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/types';
import { formatCurrency, cn, formatRelativeDate } from '@/lib/utils';
import { SOURCE_COLORS, AGENTS } from '@/lib/constants';
import { CalendarClock, AlertCircle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: { type: 'Lead', lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const agent = AGENTS.find(a => a.name === lead.assignedTo);
  const sourceClass = SOURCE_COLORS[lead.leadSource];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  const checkFollowUp = () => {
    if (!lead.followUpDate) return null;
    const diff = differenceInDays(parseISO(lead.followUpDate), new Date());
    const isOverdue = diff < 0;
    return (
      <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md", isOverdue ? "text-red-600 bg-red-50" : "text-slate-500 bg-slate-100")}>
        {isOverdue ? <AlertCircle className="w-3 h-3" /> : <CalendarClock className="w-3 h-3" />}
        {formatRelativeDate(lead.followUpDate)}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "relative bg-white border border-slate-200 rounded-xl p-4 mb-3 cursor-grab hover:shadow-md transition-shadow select-none",
        isDragging && "border-indigo-500 shadow-xl cursor-grabbing z-50"
      )}
    >
      {/* Priority Indicator */}
      <div 
        className={cn("absolute top-3 right-3 w-2 h-2 rounded-full", getPriorityColor(lead.priority))} 
        title={`${lead.priority} Priority`}
      />

      <div className="pr-4">
        <h4 className="font-semibold text-slate-800 truncate">{lead.name}</h4>
        <p className="text-xs text-slate-500 truncate mt-0.5">{lead.company || 'No Company'}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
          {formatCurrency(lead.value)}
        </span>
        
        <span className={cn("text-[10px] font-medium px-2 py-1 rounded-full", sourceClass)}>
          {lead.leadSource}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {/* Agent Avatar */}
        <div className="flex items-center gap-2">
          <div 
            className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white", agent?.color || 'bg-slate-300')}
            title={`Assigned to ${lead.assignedTo}`}
          >
            {agent?.avatar || '?'}
          </div>
        </div>

        {checkFollowUp()}
      </div>
    </div>
  );
}
