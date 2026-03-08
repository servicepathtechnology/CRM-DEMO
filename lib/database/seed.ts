import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import { AGENTS, PIPELINE_STAGES, LEAD_SOURCES } from '../constants';
import { Lead } from '@/types';

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDaysAgo: number, endDaysAgo: number): string {
  const date = new Date();
  const offset = Math.floor(Math.random() * (startDaysAgo - endDaysAgo + 1) + endDaysAgo);
  date.setDate(date.getDate() - offset);
  return date.toISOString();
}

export async function seedDatabase() {
  const { total } = await db.getLeads({});
  if (total > 0) {
    console.log('Database already has leads. Skipping seed.');
    return;
  }

  console.log('Seeding 20 realistic leads...');

  const mockNames = [
    'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Evan Wright',
    'Fiona Gallagher', 'George Costanza', 'Hannah Abbott', 'Ian Malcolm', 'Jessica Day',
    'Kevin Space', 'Laura Croft', 'Mike Ross', 'Nancy Wheeler', 'Oliver Queen',
    'Pam Beesly', 'Quinn Fabray', 'Rachel Green', 'Sam Winchester', 'Tom Haverford'
  ];

  const mockCompanies = [
    'Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella Corp',
    'Stark Ind', 'Wayne Ent', 'Cyberdyne', 'Massive Dynamic', 'Hooli'
  ];

  const mockTitles = [
    'CEO', 'CTO', 'VP of Sales', 'Marketing Director', 'Product Manager',
    'Operations Head', 'Founder', 'Managing Director'
  ];

  for (let i = 0; i < 60; i++) {
    const randomNameIndex = Math.floor(Math.random() * mockNames.length);
    const createdAt = randomDate(60, 0); // between 60 days ago and today
    const followUpDate = randomChoice([randomDate(7, -7), null]); // recent past or next week
    
    // Distribute stages logically based on age
    const stage = randomChoice(PIPELINE_STAGES);
    const agent = randomChoice(AGENTS).name; // Using name instead of ID for ease of display in this demo
    
    const leadData = {
      name: mockNames[randomNameIndex],
      email: `${mockNames[randomNameIndex].toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+1-555-01${Math.floor(Math.random() * 90) + 10}`,
      company: randomChoice(mockCompanies),
      jobTitle: randomChoice(mockTitles),
      leadSource: randomChoice(LEAD_SOURCES),
      status: stage,
      assignedTo: agent,
      value: Math.floor(Math.random() * 500) * 100 + 1000, // $1k - $51k
      priority: randomChoice(['Low', 'Medium', 'High']) as 'Low' | 'Medium' | 'High',
      tags: [randomChoice(['Enterprise', 'Startup', 'SaaS', 'E-commerce'])],
      notes: 'Initial contact made.',
      followUpDate: followUpDate,
    };

    const created = await db.createLead(leadData);

    // Override the created date which was set to "now" by the adapter
    await db.updateLead(created.id, { createdAt });

    // Add some random activities
    const activityCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < activityCount; j++) {
      await db.addActivity(created.id, {
        type: randomChoice(['Note', 'Call', 'Email', 'Meeting']),
        content: `Follow up activity ${j + 1}`,
        performedBy: agent,
      });
    }
  }

  console.log('Database seeded successfully.');
}
