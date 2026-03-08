import React from 'react';
import { Card } from '@/components/ui/Card';
import { AGENTS } from '@/lib/constants';
import { Trophy } from 'lucide-react';

interface AgentLeaderboardProps {
  data: { name: string; count: number; closedWon: number }[];
}

export function AgentLeaderboard({ data }: AgentLeaderboardProps) {

  // Sort by closed won then by count
  const sortedData = [...data].sort((a,b) => {
    if (b.closedWon !== a.closedWon) return b.closedWon - a.closedWon;
    return b.count - a.count;
  });

  const topScore = Math.max(...sortedData.map(d => d.closedWon), 1);

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Top Performers
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {sortedData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center">No data available.</p>
        ) : (
          sortedData.map((stat, idx) => {
            const agent = AGENTS.find(a => a.name === stat.name);
            const percent = (stat.closedWon / topScore) * 100;
            
            return (
              <div key={stat.name} className="flex items-center gap-4">
                <div className="flex-shrink-0 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${agent?.color || 'bg-slate-300'}`}>
                    {agent?.avatar || '?'}
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[8px] font-bold text-amber-900">1</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{stat.name}</p>
                    <p className="text-xs font-medium text-slate-600">{stat.closedWon} Won / {stat.count} Total</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
