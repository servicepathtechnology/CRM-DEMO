"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PIPELINE_STAGES, STAGE_COLORS } from '@/lib/constants';

interface PipelineFunnelChartProps {
  data: Record<string, number>;
}

export function PipelineFunnelChart({ data }: PipelineFunnelChartProps) {
  const chartData = PIPELINE_STAGES.map((stage) => ({
    name: stage,
    count: data[stage] || 0,
    // Map Tailwind classes to hex colors for Recharts
    color: getHexColorForStage(stage)
  }));

  // Recharts needs valid CSS color strings, not tailwind classes for Cell fills
  function getHexColorForStage(stage: string) {
    switch (stage) {
      case 'New Lead': return '#94A3B8'; // slate-400
      case 'Contacted': return '#3B82F6'; // blue-500
      case 'Qualified': return '#8B5CF6'; // violet-500
      case 'Proposal Sent': return '#F59E0B'; // amber-500
      case 'Closed Won': return '#10B981'; // emerald-500
      case 'Closed Lost': return '#EF4444'; // red-500
      default: return '#94A3B8';
    }
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
