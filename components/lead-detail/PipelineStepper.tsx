"use client";

import React, { useState } from 'react';
import { PIPELINE_STAGES } from '@/lib/constants';
import { PipelineStage } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { Check } from 'lucide-react';

interface PipelineStepperProps {
  leadId: string;
  currentStage: PipelineStage;
  onStageChange: () => void;
}

export function PipelineStepper({ leadId, currentStage, onStageChange }: PipelineStepperProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);

  const handleStageClick = async (stage: PipelineStage, index: number) => {
    if (stage === currentStage || isUpdating) return;
    
    // Optional: add confirmation dialogue if moving backwards
    if (index < currentIndex && !window.confirm(`Are you sure you want to move the lead backwards to "${stage}"?`)) {
        return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: stage }),
      });

      if (!res.ok) throw new Error('Failed to update stage');
      
      toast.success(`Pipeline stage updated to ${stage}`);
      onStageChange();
    } catch (error) {
      toast.error('Failed to update stage');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 snap-x">
        {PIPELINE_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClosedWon = stage === 'Closed Won';
          const isClosedLost = stage === 'Closed Lost';
          
          let colorClass = 'bg-slate-100 text-slate-500 border-slate-200';
          let textColor = 'text-slate-500';

          if (isCompleted) {
            colorClass = 'bg-indigo-600 text-white border-indigo-600 cursor-pointer hover:bg-indigo-700';
            textColor = 'text-indigo-900';
          } else if (isCurrent) {
            if (isClosedWon) {
              colorClass = 'bg-emerald-500 text-white border-emerald-500 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.5)]';
              textColor = 'text-emerald-700';
            } else if (isClosedLost) {
              colorClass = 'bg-red-500 text-white border-red-500 cursor-default';
              textColor = 'text-red-700';
            } else {
              colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-500 cursor-default ring-2 ring-indigo-500 ring-offset-2';
              textColor = 'text-indigo-900 font-bold';
            }
          } else {
             // Future stages are clickable to fast-forward
             colorClass = 'bg-white text-slate-400 border-slate-300 border-dashed cursor-pointer hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50';
          }

          // Special styling for Closed Lost if it's not the current state. Often it's hidden or visually distinct
          if (isClosedLost && !isCurrent) {
             colorClass = 'bg-white text-red-300 border-red-200 border-dashed cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-600';
             textColor = 'text-red-400';
          }

          return (
            <div key={stage} className="flex-1 flex flex-col items-center min-w-[100px] snap-center relative group">
              {/* Connecting Line (except for last, which is "Closed Lost" and visually separate sometimes, but we render standard) */}
              {index < PIPELINE_STAGES.length - 1 && (
                <div 
                  className={`absolute top-4 left-[50%] right-[-50%] h-0.5 z-0 ${index < currentIndex ? 'bg-indigo-600' : 'bg-slate-200'}`} 
                />
              )}

              <button
                onClick={() => handleStageClick(stage, index)}
                disabled={isUpdating || isCurrent}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all duration-300 ${colorClass}`}
                title={isCurrent ? 'Current Stage' : `Move to ${stage}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </button>
              
              <span className={`text-[11px] uppercase tracking-wider font-semibold mt-3 text-center transition-colors ${textColor}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
