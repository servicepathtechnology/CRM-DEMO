"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { BulkActionBar } from '@/components/leads/BulkActionBar';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/components/ui/Toast';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const { toast } = useToast();
  
  // Table state
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' as 'asc' | 'desc' });
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch data
  const { leads, total, isLoading, mutate } = useLeads({
    ...filters,
    page,
    limit,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction,
  });

  const totalPages = Math.ceil(total / limit);

  const selectedLeads = useMemo(() => {
    return leads.filter(l => selectedIds.includes(l.id));
  }, [leads, selectedIds]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // reset pagination
  }, []);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (allIds: string[]) => {
    setSelectedIds(allIds);
  };

  // Bulk Actions
  const handleBulkUpdate = async (field: string, value: string) => {
    try {
      // Execute all patch requests in parallel
      await Promise.all(
        selectedIds.map(id => 
          fetch(`/api/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value }),
          })
        )
      );
      toast.success(`Successfully updated ${selectedIds.length} leads.`);
      mutate();
      setSelectedIds([]); // clear selection after action
    } catch (error) {
      toast.error('Failed to apply bulk update.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map(id => fetch(`/api/leads/${id}`, { method: 'DELETE' }))
      );
      toast.success(`Successfully deleted ${selectedIds.length} leads.`);
      mutate();
      setSelectedIds([]);
      // Edge case: if we deleted all items on last page, we might need to decrement page
      if (page > 1 && selectedIds.length === leads.length) {
        setPage(p => p - 1);
      }
    } catch (error) {
      toast.error('Failed to delete leads.');
    }
  };

  const handleExportAll = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, String(v));
    });
    window.open(`/api/leads/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen relative pb-24">
      <TopBar title="All Leads" />
      
      <div className="p-6 md:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/leads/new">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleExportAll}>
            Export Current View
          </Button>
        </div>

        {/* Filters */}
        <LeadFilters onFilterChange={handleFilterChange} />

        {/* Table Area */}
        {isLoading && leads.length === 0 ? (
          <div className="flex items-center justify-center p-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-4">
            <LeadsTable 
              leads={leads}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              sortConfig={sortConfig}
              onSort={handleSort}
            />

            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-900">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
                  <span className="font-medium text-slate-900">{Math.min(page * limit, total)}</span> of{' '}
                  <span className="font-medium text-slate-900">{total}</span> leads
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BulkActionBar 
        selectedLeads={selectedLeads} 
        onClearSelection={() => setSelectedIds([])} 
        onBulkUpdate={handleBulkUpdate}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}
