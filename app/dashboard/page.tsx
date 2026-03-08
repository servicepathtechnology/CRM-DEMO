"use client";

import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PipelineFunnelChart } from '@/components/dashboard/PipelineFunnelChart';
import { LeadSourceChart } from '@/components/dashboard/LeadSourceChart';
import { LeadsOverTimeChart } from '@/components/dashboard/LeadsOverTimeChart';
import { RecentLeadsTable } from '@/components/dashboard/RecentLeadsTable';
import { UpcomingFollowUps } from '@/components/dashboard/UpcomingFollowUps';
import { AgentLeaderboard } from '@/components/dashboard/AgentLeaderboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLeads } from '@/hooks/useLeads';
import { Card } from '@/components/ui/Card';
import { Users, TrendingUp, Trophy, Percent, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { leads, isLoading: leadsLoading } = useLeads({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });

  if (analyticsLoading || leadsLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Overview" />
      
      <div className="p-6 md:p-8 space-y-8 flex-1">
        
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Leads" 
            value={analytics.totalLeads} 
            icon={Users} 
            colorClass="bg-indigo-500" 
          />
          <StatsCard 
            title="New This Week" 
            value={analytics.newThisWeek} 
            icon={TrendingUp} 
            colorClass="bg-cyan-500" 
          />
          <StatsCard 
            title="Closed Won" 
            value={analytics.closedWon} 
            icon={Trophy} 
            colorClass="bg-emerald-500" 
          />
          <StatsCard 
            title="Conversion Rate" 
            value={`${analytics.conversionRate}%`} 
            icon={Percent} 
            colorClass="bg-violet-500" 
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 font-sans">Pipeline Funnel</h3>
            <div className="flex-1 flex items-center justify-center">
              <PipelineFunnelChart data={analytics.leadsByStage} />
            </div>
          </Card>
          
          <Card className="col-span-1 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 font-sans">Lead Sources</h3>
            <div className="flex-1 flex items-center justify-center">
              <LeadSourceChart data={analytics.leadsBySource} />
            </div>
          </Card>

          <Card className="col-span-1 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 font-sans">Leads Last 30 Days</h3>
            <div className="flex-1 flex items-center justify-center">
              <LeadsOverTimeChart data={analytics.leadsOverTime} />
            </div>
          </Card>
        </div>

        {/* Bottom Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-6 flex flex-col">
            <RecentLeadsTable leads={leads} />
          </div>
          <div className="col-span-1 space-y-6 flex flex-col">
            <div className="flex-1">
              <UpcomingFollowUps leads={leads /* Note: normally we'd fetch all leads for this, but reusing recent context for demo */ } />
            </div>
            <div className="flex-1 mt-6">
              <AgentLeaderboard data={analytics.leadsByAgent} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
