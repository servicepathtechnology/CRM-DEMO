"use client";

import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, PipelineStage } from '@/types';
import { LeadCard } from './LeadCard';
import { STAGE_COLORS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
}

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const router = useRouter();
  
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: 'Column', stage }
  });

  const leadIds = useMemo(() => leads.map(l => l.id), [leads]);
  
  const totalValue = useMemo(() => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  }, [leads]);

  const colors = STAGE_COLORS[stage];

  return (
    <div className="min-w-72 w-72 flex flex-col h-full">
      {/* Column Header */}
      <div className="bg-slate-100 rounded-xl px-4 py-3 mb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
          <h3 className="font-semibold text-slate-800">{stage}</h3>
          <span className="bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium">
            {leads.length}
          </span>
        </div>
        <button 
          onClick={() => router.push(`/leads/new?stage=${encodeURIComponent(stage)}`)}
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded transition-colors"
          title={`Add new lead to ${stage}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-1 mb-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Total: {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto pb-4 transition-colors rounded-xl p-1.5 min-h-[150px]",
          isOver ? "bg-indigo-50/50 border-2 border-indigo-200 border-dashed" : "border-2 border-transparent"
        )}
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onClick={() => router.push(`/leads/${lead.id}`)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
