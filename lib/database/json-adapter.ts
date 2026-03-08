import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Lead, Activity, PipelineStage, LeadSource } from '@/types';
import { DatabaseAdapter } from './adapter';

const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
  }
}

async function readData(): Promise<Lead[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Lead[];
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

async function writeData(data: Lead[]): Promise<void> {
  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

export const jsonAdapter: DatabaseAdapter = {
  async getLeads(params: any) {
    let leads = await readData();

    // Filters
    if (params.search) {
      const q = params.search.toLowerCase();
      leads = leads.filter(
        (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      const statuses = params.status.split(',');
      leads = leads.filter((l) => statuses.includes(l.status));
    }
    if (params.source) leads = leads.filter((l) => l.leadSource === params.source);
    if (params.assignedTo) leads = leads.filter((l) => l.assignedTo === params.assignedTo);
    if (params.priority) leads = leads.filter((l) => l.priority === params.priority);
    if (params.dateFrom) leads = leads.filter((l) => l.createdAt >= params.dateFrom);
    if (params.dateTo) leads = leads.filter((l) => l.createdAt <= params.dateTo);

    // Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    leads.sort((a, b) => {
      const valA = (a as any)[sortBy] || '';
      const valB = (b as any)[sortBy] || '';
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    const total = leads.length;

    // Pagination (0 limit means all)
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 25;
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      leads = leads.slice(startIndex, startIndex + limit);
    }

    return { leads, total };
  },

  async getLeadById(id: string) {
    const leads = await readData();
    return leads.find((l) => l.id === id) || null;
  },

  async createLead(leadData) {
    const leads = await readData();
    const now = new Date().toISOString();
    
    const newLead: Lead = {
      ...leadData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      activities: [
        {
          id: uuidv4(),
          type: 'Note',
          content: 'Lead created in system.',
          performedBy: 'System',
          createdAt: now,
        }
      ],
    };
    
    leads.push(newLead);
    await writeData(leads);
    return newLead;
  },

  async updateLead(id, updates) {
    const leads = await readData();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const lead = leads[index];
    const now = new Date().toISOString();
    
    // Check for status change activity
    if (updates.status && updates.status !== lead.status) {
      lead.activities.unshift({
        id: uuidv4(),
        type: 'Status Change',
        content: `Status changed from ${lead.status} to ${updates.status}`,
        performedBy: updates.assignedTo || lead.assignedTo || 'System',
        createdAt: now,
      });
    }

    // Check for assignedTo change
    if (updates.assignedTo && updates.assignedTo !== lead.assignedTo) {
      lead.activities.unshift({
        id: uuidv4(),
        type: 'Assignment',
        content: `Lead assigned to ${updates.assignedTo}`,
        performedBy: 'System',
        createdAt: now,
      });
    }

    const updatedLead = { ...lead, ...updates, updatedAt: now };
    leads[index] = updatedLead;
    await writeData(leads);
    return updatedLead;
  },

  async deleteLead(id) {
    const leads = await readData();
    const filteredLeads = leads.filter((l) => l.id !== id);
    if (filteredLeads.length === leads.length) return false;
    await writeData(filteredLeads);
    return true;
  },

  async addActivity(leadId, activity) {
    const leads = await readData();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
      createdAt: now,
    };

    leads[index].activities.unshift(newActivity);
    leads[index].updatedAt = now;
    
    await writeData(leads);
    return leads[index].activities;
  },

  async getAnalytics() {
    const leads = await readData();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const totalLeads = leads.length;
    let newThisWeek = 0;
    let closedWon = 0;
    
    const leadsByStage: Record<string, number> = {};
    const leadsBySource: Record<string, number> = {};
    const agentStats: Record<string, { count: number; closedWon: number }> = {};
    const timelineData: Record<string, number> = {};

    leads.forEach((l) => {
      // Basic metrics
      if (l.createdAt >= oneWeekAgo) newThisWeek++;
      if (l.status === 'Closed Won') closedWon++;

      // Stage
      leadsByStage[l.status] = (leadsByStage[l.status] || 0) + 1;
      
      // Source
      leadsBySource[l.leadSource] = (leadsBySource[l.leadSource] || 0) + 1;

      // Agent
      if (!agentStats[l.assignedTo]) {
        agentStats[l.assignedTo] = { count: 0, closedWon: 0 };
      }
      agentStats[l.assignedTo].count++;
      if (l.status === 'Closed Won') agentStats[l.assignedTo].closedWon++;

      // Timeline (last 30 days aggregation would go here, simple version below)
      const dateStr = l.createdAt.split('T')[0];
      timelineData[dateStr] = (timelineData[dateStr] || 0) + 1;
    });

    // Formatting for Recharts
    const leadsByAgent = Object.keys(agentStats).map((name) => ({
      name,
      count: agentStats[name].count,
      closedWon: agentStats[name].closedWon,
    }));

    const leadsOverTime = Object.keys(timelineData)
      .sort()
      .slice(-30) // last 30 days
      .map((date) => ({
        date,
        count: timelineData[date],
      }));

    return {
      totalLeads,
      newThisWeek,
      closedWon,
      conversionRate: totalLeads ? ((closedWon / totalLeads) * 100).toFixed(1) : 0,
      leadsByStage,
      leadsBySource,
      leadsByAgent,
      leadsOverTime,
    };
  }
};
