"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead } from '@/types';
import { formatCurrency, formatRelativeDate } from '@/lib/utils';
import { SOURCE_COLORS, STAGE_COLORS } from '@/lib/constants';
import { Mail, Phone, Building2, Briefcase, Calendar, Tag, AlertTriangle } from 'lucide-react';

interface LeadProfileProps {
  lead: Lead;
}

export function LeadProfile({ lead }: LeadProfileProps) {
  const sourceClass = SOURCE_COLORS[lead.leadSource] || 'bg-slate-100 text-slate-700';
  const stageDesign = STAGE_COLORS[lead.status] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };

  return (
    <Card className="p-6 md:p-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{lead.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge colorClass={`${stageDesign.bg} ${stageDesign.text}`} dotClass={stageDesign.dot}>
              {lead.status}
            </Badge>
            <Badge colorClass={sourceClass}>
              {lead.leadSource}
            </Badge>
            {lead.priority === 'High' && (
              <Badge colorClass="bg-red-50 text-red-700 border border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" /> High Priority
              </Badge>
            )}
          </div>
        </div>

        <div className="text-left md:text-right bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Deal Value</p>
          <p className="text-2xl font-bold text-indigo-900">{formatCurrency(lead.value)}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Contact Details</h3>
          
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <a href={`mailto:${lead.email}`} className="hover:text-indigo-600 transition-colors">{lead.email}</a>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            {lead.phone ? (
               <a href={`tel:${lead.phone}`} className="hover:text-indigo-600 transition-colors">{lead.phone}</a>
            ) : (
              <span className="text-slate-400 italic">No phone provided</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            {lead.company || <span className="text-slate-400 italic">No company provided</span>}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-400" />
            {lead.jobTitle || <span className="text-slate-400 italic">No title provided</span>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Additional Info</h3>
          
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Created {formatRelativeDate(lead.createdAt)}</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-600">
            <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
            <div className="flex flex-wrap gap-1.5 flex-1">
              {lead.tags && lead.tags.length > 0 ? (
                lead.tags.map(tag => (
                  <span key={tag} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No tags</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Notes</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
        </div>
      )}

    </Card>
  );
}
