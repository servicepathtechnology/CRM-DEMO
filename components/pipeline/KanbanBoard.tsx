"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragEndEvent, 
  DragOverEvent 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { PipelineStage, Lead } from '@/types';
import { PIPELINE_STAGES } from '@/lib/constants';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';
import { BoardFilters } from './BoardFilters';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';

export function KanbanBoard() {
  const { toast } = useToast();
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    assignedTo: '',
    source: '',
    priority: '',
  });

  // Fetch leads
  const { leads: initialLeads, isLoading, mutate } = useLeads({
    limit: 0, // Get all for board (in production you might paginate or load on scroll)
    ...filters
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (initialLeads) {
      setLeads(initialLeads);
    }
  }, [initialLeads]);

  // Group leads by stage
  const columns = useMemo(() => {
    const cols: Record<PipelineStage, Lead[]> = {
      'New Lead': [],
      'Contacted': [],
      'Qualified': [],
      'Proposal Sent': [],
      'Closed Won': [],
      'Closed Lost': [],
    };
    
    leads.forEach(lead => {
      if (cols[lead.status]) {
        cols[lead.status].push(lead);
      }
    });
    
    return cols;
  }, [leads]);

  // DND Sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);
    
    if (!over) return;

    const leadId = active.id;
    // Data can be from the column or another item
    const newStatus = (over.data.current?.stage || over.data.current?.lead?.status) as PipelineStage;
    const leadToUpdate = leads.find(l => l.id === leadId);

    if (leadToUpdate && leadToUpdate.status !== newStatus) {
      // Optimistic Update
      const previousLeads = [...leads];
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

      try {
        const res = await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error('Failed to update stage');
        toast.success(`Moved to ${newStatus}`);
      } catch (error) {
        toast.error('Failed to move lead');
        setLeads(previousLeads); // Revert on failure
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <BoardFilters filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Scrollable board area */}
          <div className="flex-1 flex gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x">
            {PIPELINE_STAGES.map(stage => (
              <div key={stage} className="snap-start flex-shrink-0 flex">
                <KanbanColumn stage={stage} leads={columns[stage]} />
              </div>
            ))}
          </div>

          {/* Drag Overlay overlay component while dragging */}
          <DragOverlay>
            {activeLead ? (
              <div className="opacity-90 scale-105 rotate-2 shadow-2xl z-50 transition-transform">
                <LeadCard lead={activeLead} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
