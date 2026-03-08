import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export const metadata = {
  title: 'Pipeline | CRM Dashboard',
};

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-screen"> {/* h-screen is essential for full-height board scroll */}
      <TopBar title="Pipeline Board" />
      <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col min-h-0 bg-slate-50/50">
        <KanbanBoard />
      </div>
    </div>
  );
}
