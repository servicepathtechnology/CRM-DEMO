"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CalendarClock } from 'lucide-react';

interface FollowUpWidgetProps {
  leadId: string;
  currentDate: string | undefined;
  onUpdate: () => void;
}

export function FollowUpWidget({ leadId, currentDate, onUpdate }: FollowUpWidgetProps) {
  const { toast } = useToast();
  // Strip time part if present for input type date
  const defaultDate = currentDate ? Number.isNaN(Date.parse(currentDate)) ? '' : new Date(currentDate).toISOString().split('T')[0] : '';
  const [dateStr, setDateStr] = useState(defaultDate);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    let finalDate: string | null = null;
    if (dateStr) {
      finalDate = new Date(dateStr).toISOString();
    }

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpDate: finalDate }),
      });

      if (!res.ok) throw new Error('Failed to update follow-up date');
      
      toast.success('Follow-up schedule updated');
      onUpdate();
    } catch (error) {
      toast.error('Schedule update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClear = async () => {
    setDateStr('');
    setIsUpdating(true);
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpDate: null }),
      });
      toast.success('Follow-up schedule cleared');
      onUpdate();
    } catch (e) {} finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Follow-up</h3>
        </div>
        {dateStr && dateStr !== defaultDate && (
           <Button variant="ghost" size="sm" className="px-2 text-indigo-600 font-semibold" onClick={handleUpdate} isLoading={isUpdating}>
             Save
           </Button>
        )}
      </div>

      <div className="space-y-3">
        <Input 
          type="date" 
          value={dateStr} 
          onChange={(e) => setDateStr(e.target.value)} 
          disabled={isUpdating}
        />
        
        {defaultDate && dateStr === defaultDate && (
          <Button 
            variant="ghost" 
            className="w-full text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleClear}
            disabled={isUpdating}
          >
            Clear Schedule
          </Button>
        )}
      </div>
    </Card>
  );
}
