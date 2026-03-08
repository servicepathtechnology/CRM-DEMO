import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Lead } from '@/types';
import { differenceInDays, parseISO } from 'date-fns';
import { CalendarClock, AlertCircle } from 'lucide-react';

interface UpcomingFollowUpsProps {
  leads: Lead[];
}

export function UpcomingFollowUps({ leads }: UpcomingFollowUpsProps) {
  
  // Filter and sort for the widget: upcoming or overdue, limit 5
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const relevantList = leads
    .filter(l => l.followUpDate)
    .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())
    .slice(0, 5);

  const getDayInfo = (dateStr: string) => {
    const followDate = parseISO(dateStr);
    const diff = differenceInDays(followDate, today);
    
    if (diff < 0) return { label: `${Math.abs(diff)} days overdue`, isOverdue: true };
    if (diff === 0) return { label: 'Today', isOverdue: false, isUrgent: true };
    if (diff === 1) return { label: 'Tomorrow', isOverdue: false };
    return { label: `In ${diff} days`, isOverdue: false };
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-indigo-500" />
          Agenda
        </h3>
      </div>
      <div className="p-0 flex-1 flex flex-col">
        {relevantList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-slate-500 text-sm">No upcoming follow-ups scheduled.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 flex-1">
            {relevantList.map(lead => {
              const { label, isOverdue, isUrgent } = getDayInfo(lead.followUpDate!);
              return (
                <li key={lead.id}>
                  <Link href={`/leads/${lead.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                      <p className="text-xs text-slate-500 truncate">{lead.company}</p>
                    </div>
                    <div className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1
                      ${isOverdue ? 'bg-red-50 text-red-600' : isUrgent ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}
                    `}>
                      {isOverdue && <AlertCircle className="w-3 h-3" />}
                      {label}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
