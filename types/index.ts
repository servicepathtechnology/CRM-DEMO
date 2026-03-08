export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Cold Outreach'
  | 'Social Media'
  | 'Google Ads'
  | 'LinkedIn'
  | 'Event'
  | 'Other';

export type PipelineStage =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Closed Won'
  | 'Closed Lost';

export interface Activity {
  id: string;
  type: 'Note' | 'Call' | 'Email' | 'Meeting' | 'Status Change' | 'Assignment';
  content: string;
  performedBy: string; // Agent name
  createdAt: string; // ISO timestamp
}

export interface Lead {
  id: string; // UUID v4
  name: string; // Full name — required
  email: string; // Email address — required, unique
  phone: string; // Phone number
  company: string; // Company name
  jobTitle: string; // Job title / role
  leadSource: LeadSource; // Enum
  status: PipelineStage; // Enum
  assignedTo: string; // Agent name or ID
  value: number; // Estimated deal value in USD
  priority: 'Low' | 'Medium' | 'High';
  tags: string[]; // Array of custom tags
  notes: string; // General notes text
  activities: Activity[]; // Array of activity log entries
  followUpDate: string | null; // ISO date string for next follow-up
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt?: string | null;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string; // Initials (e.g., "JS")
  color: string; // Tailwind bg color class
  leadsCount: number; // Computed
}
