'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

type FieldConfig = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

type JobOpening = {
  id?: string;
  title: string;
  department: string;
  location: string;
  description: string;
  formConfig: FieldConfig[];
  status: string;
};

const DEFAULT_FIELDS: FieldConfig[] = [
  { name: 'resume', label: 'Resume/CV', type: 'file', required: true },
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
];

export default function JobForm({ initialData }: { initialData?: JobOpening }) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<JobOpening>({
    title: initialData?.title || '',
    department: initialData?.department || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    status: initialData?.status || 'OPEN',
    formConfig: initialData?.formConfig?.length ? initialData.formConfig : DEFAULT_FIELDS,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (index: number, key: keyof FieldConfig, value: any) => {
    const newConfig = [...formData.formConfig];
    newConfig[index] = { ...newConfig[index], [key]: value };
    setFormData({ ...formData, formConfig: newConfig });
  };

  const removeField = (index: number) => {
    const newConfig = [...formData.formConfig];
    newConfig.splice(index, 1);
    setFormData({ ...formData, formConfig: newConfig });
  };

  const addField = () => {
    setFormData({
      ...formData,
      formConfig: [...formData.formConfig, { name: '', label: '', type: 'text', required: false }]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/admin/jobs/${initialData.id}` : '/api/admin/jobs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save job');

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Title</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Senior Software Engineer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Department / Function</label>
          <input required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Engineering" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Remote" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Job Description (Markdown supported)</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={12} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder="## About the role..." />
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Application Form Fields</h3>
          <button type="button" onClick={addField} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="h-4 w-4" /> Add Field
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.formConfig.map((field, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Field Label (UI)</label>
                  <input required value={field.label} onChange={e => handleFieldChange(i, 'label', e.target.value)} className="w-full px-2 py-1.5 text-sm border rounded" placeholder="e.g. LinkedIn URL" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Property Name (JSON)</label>
                  <input required value={field.name} onChange={e => handleFieldChange(i, 'name', e.target.value)} className="w-full px-2 py-1.5 text-sm border rounded" placeholder="e.g. linkedin" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Input Type</label>
                  <select value={field.type} onChange={e => handleFieldChange(i, 'type', e.target.value)} className="w-full px-2 py-1.5 text-sm border rounded">
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="url">URL</option>
                    <option value="textarea">Textarea</option>
                    <option value="file">File (Link)</option>
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={field.required} onChange={e => handleFieldChange(i, 'required', e.target.checked)} className="rounded" />
                    Required
                  </label>
                </div>
              </div>
              <button type="button" onClick={() => removeField(i)} className="mt-6 text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Job')}
        </button>
      </div>
    </form>
  );
}
