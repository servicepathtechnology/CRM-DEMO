import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { STAGE_COLORS, SOURCE_COLORS, AGENTS } from '@/lib/constants';
import { formatRelativeDate } from '@/lib/utils';
import { Lead } from '@/types';

interface RecentLeadsTableProps {
  leads: Lead[];
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  
  const getAgentAvatar = (nameName: string) => {
    const agent = AGENTS.find(a => a.name === nameName);
    if (!agent) return { color: 'bg-slate-200 text-slate-600', initials: '?' };
    return { color: agent.color, initials: agent.avatar };
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Recent Leads</h3>
        <Link href="/leads" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View All Leads &rarr;
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 whitespace-nowrap">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Assigned To</th>
              <th className="px-6 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const stageDesign = STAGE_COLORS[lead.status];
              const sourceClass = SOURCE_COLORS[lead.leadSource];
              const agent = getAgentAvatar(lead.assignedTo);
              
              return (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <p className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.company}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge colorClass={`${stageDesign.bg} ${stageDesign.text}`} dotClass={stageDesign.dot}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge colorClass={sourceClass}>
                      {lead.leadSource}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white ${agent.color}`}>
                        {agent.initials}
                      </div>
                      <span className="text-slate-700">{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatRelativeDate(lead.createdAt)}
                  </td>
                </tr>
              );
            })}
            
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
