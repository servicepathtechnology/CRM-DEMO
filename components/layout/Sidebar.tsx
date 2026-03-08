"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  UserPlus, 
  UserCircle, 
  Download,
  LogOut,
  ChevronUp
} from 'lucide-react';
import { AGENTS } from '@/lib/constants';

export function Sidebar() {
  const pathname = usePathname();
  // Mock standard active agent as a1 (Jordan Smith) for demo purposes
  const activeAgent = AGENTS[0];

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pipeline', href: '/pipeline', icon: Kanban },
    { name: 'All Leads', href: '/leads', icon: Users },
    { name: 'Add Lead', href: '/leads/new', icon: UserPlus },
  ];

  const handleExport = async () => {
    // Export will be handled by downloading the CSV from the API endpoint
    window.open('/api/leads/export', '_blank');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transition-transform duration-300 md:translate-x-0 -translate-x-full">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
        <LayoutDashboard className="w-6 h-6 text-indigo-500 mr-2" />
        <span className="text-xl font-bold text-white uppercase tracking-wider">CRM</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</h3>
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
           <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Settings</h3>
           <ul className="space-y-1">
            <li>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                onClick={() => alert('Agent management not in demo scope.')}
              >
                <UserCircle className="w-5 h-5 text-slate-400" />
                Agents
              </button>
            </li>
            <li>
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Download className="w-5 h-5 text-slate-400" />
                Export CSV
              </button>
            </li>
           </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium", activeAgent.color)}>
            {activeAgent.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 truncate">Viewing as:</p>
            <p className="text-sm font-medium text-white truncate">{activeAgent.name}</p>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
