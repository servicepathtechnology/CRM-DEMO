"use client";

import React from 'react';
import { Activity } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { MessageSquare, Phone, Mail, ArrowRightLeft, FileText, CheckCircle2 } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {

  // Sort by newest first
  const sortedActivities = [...activities].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Note': return <FileText className="w-4 h-4" />;
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <MessageSquare className="w-4 h-4" />;
      case 'Status Change': return <ArrowRightLeft className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Note': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Call': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Email': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Meeting': return 'bg-violet-100 text-violet-600 border-violet-200';
      case 'Status Change': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
        <p className="text-sm text-slate-500">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {sortedActivities.map((activity) => (
        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          
          {/* Icon Marker */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          
          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{activity.type}</span>
              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                {formatRelativeDate(activity.createdAt)}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {activity.content}
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 border-t border-slate-50 pt-3">
              <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-medium text-slate-600">
                {activity.performedBy.charAt(0)}
              </span>
              {activity.performedBy}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
