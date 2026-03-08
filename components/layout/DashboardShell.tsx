"use client";

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  
  // Quick initializer for seeding local db via api in this demo approach
  useEffect(() => {
    fetch('/api/leads?limit=1').catch(console.error); // The GET /api/leads triggers seed logic
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 bg-slate-50 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
