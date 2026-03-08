"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { AGENTS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { UserPlus } from 'lucide-react';

interface AgentAssignmentProps {
  leadId: string;
  currentAgent: string;
  onUpdate: () => void;
}

export function AgentAssignment({ leadId, currentAgent, onUpdate }: AgentAssignmentProps) {
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState(currentAgent);
  const [isUpdating, setIsUpdating] = useState(false);

  const activeAgentData = AGENTS.find(a => a.name === currentAgent);

  const handleUpdate = async () => {
    if (selectedAgent === currentAgent) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: selectedAgent }),
      });

      if (!res.ok) throw new Error('Failed to reassign agent');
      toast.success(`Lead reassigned to ${selectedAgent}`);
      onUpdate();
    } catch (error) {
      toast.error('Reassignment failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-slate-900">Assigned Agent</h3>
      </div>

      <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-white shadow-sm ${activeAgentData?.color || 'bg-slate-300'}`}>
          {activeAgentData?.avatar || '?'}
        </div>
        <div>
          <p className="font-medium text-slate-900">{currentAgent}</p>
          <p className="text-xs text-slate-500">{activeAgentData?.email || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Select 
          value={selectedAgent} 
          onChange={(e) => setSelectedAgent(e.target.value)}
          disabled={isUpdating}
        >
          {AGENTS.map(agent => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
        </Select>
        
        {selectedAgent !== currentAgent && (
          <Button 
            className="w-full text-sm" 
            onClick={handleUpdate} 
            isLoading={isUpdating}
            variant="primary"
          >
            Confirm Reassignment
          </Button>
        )}
      </div>
    </Card>
  );
}
