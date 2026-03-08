"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface AddActivityFormProps {
  leadId: string;
  onActivityAdded: () => void;
}

export function AddActivityForm({ leadId, onActivityAdded }: AddActivityFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Note',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real app the user would be picked from auth context
      const payload = { ...formData, performedBy: 'Current User' };
      
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to add activity');
      
      toast.success('Activity added successfully');
      setFormData({ type: 'Note', content: '' });
      setIsOpen(false);
      onActivityAdded();
    } catch (error) {
      toast.error('Failed to add activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" className="w-full mb-6" onClick={() => setIsOpen(true)}>
        + Log Activity
      </Button>
    );
  }

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
      <h4 className="text-sm font-semibold text-slate-900 mb-3">Log New Activity</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-2 mb-3">
          {['Note', 'Call', 'Email', 'Meeting'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                formData.type === type 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="What happened? e.g. Left a voicemail..."
          rows={3}
          className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          required
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Save Activity
          </Button>
        </div>
      </form>
    </div>
  );
}
