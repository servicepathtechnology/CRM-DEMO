import { Lead, Activity } from '@/types';

export interface DatabaseAdapter {
  getLeads(params: any): Promise<{ leads: Lead[]; total: number }>;
  getLeadById(id: string): Promise<Lead | null>;
  createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): Promise<Lead>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null>;
  deleteLead(id: string): Promise<boolean>;
  addActivity(leadId: string, activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity[] | null>;
  getAnalytics(): Promise<any>;
}
