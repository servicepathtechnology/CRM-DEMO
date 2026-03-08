"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Lead } from '@/types';
import { AGENTS, LEAD_SOURCES, PIPELINE_STAGES } from '@/lib/constants';

interface LeadFormProps {
  initialData?: Lead;
  isEdit?: boolean;
}

export function LeadForm({ initialData, isEdit }: LeadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    leadSource: initialData?.leadSource || 'Website',
    status: initialData?.status || 'New Lead',
    assignedTo: initialData?.assignedTo || AGENTS[0].name,
    value: initialData?.value || 0,
    priority: initialData?.priority || 'Medium',
    followUpDate: initialData?.followUpDate ? initialData.followUpDate.split('T')[0] : '', // simple YYYY-MM-DD for input type date
    tags: initialData?.tags || [],
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTagKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && formData.tags.length < 10 && !formData.tags.includes(val)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Formatting date to ISO or leaving null
    let finalFollowUp: string | null = null;
    if (formData.followUpDate) {
      finalFollowUp = new Date(formData.followUpDate).toISOString();
    }

    const payload = { ...formData, followUpDate: finalFollowUp };

    try {
      const url = isEdit ? `/api/leads/${initialData!.id}` : '/api/leads';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save lead');
      }

      const savedLead = await res.json();
      toast.success(isEdit ? 'Lead updated successfully' : 'Lead created successfully');
      router.push(`/leads/${savedLead.id}`);
      router.refresh(); // Important for Server Components to update
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 md:p-8 relative">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Contact Info */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pb-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Jane Doe" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="jane@example.com" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (Optional)</label>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1-555-0123" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company (Optional)</label>
              <Input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title (Optional)</label>
              <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="CEO" disabled={isSubmitting} />
            </div>
          </div>
        </section>

        {/* Lead Details */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pb-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Lead Source *</label>
              <Select name="leadSource" value={formData.leadSource} onChange={handleChange} disabled={isSubmitting}>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Pipeline Stage *</label>
              <Select name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting}>
                {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned To *</label>
              <Select name="assignedTo" value={formData.assignedTo} onChange={handleChange} disabled={isSubmitting}>
                {AGENTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deal Value ($)</label>
              <Input type="number" min="0" name="value" value={formData.value} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
              <div className="flex gap-4">
                {['Low', 'Medium', 'High'].map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="priority" 
                      value={p} 
                      checked={formData.priority === p}
                      onChange={handleChange}
                      className="text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Follow Up & Tags */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Follow-Up & Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pb-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Follow-Up Date</label>
              <Input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (Press Enter)</label>
              <Input 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                onKeyDown={handleTagKeydown} 
                placeholder="e.g. Enterprise" 
                disabled={isSubmitting || formData.tags.length >= 10}
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
                        <span className="sr-only">Remove tag</span>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Notes */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Notes</h3>
          <div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Initial context, requirements, etc."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder:text-slate-400 bg-white"
              disabled={isSubmitting}
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
