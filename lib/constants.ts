import { Agent, LeadSource, PipelineStage } from '@/types';

export const PIPELINE_STAGES: PipelineStage[] = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Closed Won',
  'Closed Lost',
];

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Cold Outreach',
  'Social Media',
  'Google Ads',
  'LinkedIn',
  'Event',
  'Other',
];

export const STAGE_COLORS: Record<PipelineStage, { bg: string; text: string; dot: string }> = {
  'New Lead': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  'Contacted': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Qualified': { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  'Proposal Sent': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Closed Won': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Closed Lost': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  'Website': 'bg-indigo-100 text-indigo-700',
  'Referral': 'bg-emerald-100 text-emerald-700',
  'Cold Outreach': 'bg-slate-100 text-slate-700',
  'Social Media': 'bg-pink-100 text-pink-700',
  'Google Ads': 'bg-amber-100 text-amber-700',
  'LinkedIn': 'bg-blue-100 text-blue-700',
  'Event': 'bg-violet-100 text-violet-700',
  'Other': 'bg-gray-100 text-gray-700',
};

export const AGENTS: Agent[] = [
  { id: 'a1', name: 'Jordan Smith', email: 'jordan@company.com', avatar: 'JS', color: 'bg-violet-500', leadsCount: 0 },
  { id: 'a2', name: 'Priya Kapoor', email: 'priya@company.com', avatar: 'PK', color: 'bg-cyan-500', leadsCount: 0 },
  { id: 'a3', name: 'Marcus Chen', email: 'marcus@company.com', avatar: 'MC', color: 'bg-amber-500', leadsCount: 0 },
  { id: 'a4', name: 'Sara Williams', email: 'sara@company.com', avatar: 'SW', color: 'bg-rose-500', leadsCount: 0 },
];
