import Papa from 'papaparse';
import { Lead } from '@/types';

export function leadsToCSV(leads: Lead[]): string {
  const rows = leads.map((lead) => ({
    'Name': lead.name,
    'Email': lead.email,
    'Phone': lead.phone || '',
    'Company': lead.company || '',
    'Job Title': lead.jobTitle || '',
    'Lead Source': lead.leadSource,
    'Status': lead.status,
    'Assigned To': lead.assignedTo,
    'Deal Value': lead.value || 0,
    'Priority': lead.priority,
    'Tags': lead.tags ? lead.tags.join(', ') : '',
    'Follow-Up Date': lead.followUpDate || '',
    'Notes': lead.notes || '',
    'Created At': lead.createdAt,
  }));
  return Papa.unparse(rows);
}
