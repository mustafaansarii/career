'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FieldConfig = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

export default function ApplyForm({ jobId, formConfig }: { jobId: string; formConfig: FieldConfig[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-medium mb-4">Application Submitted!</h2>
        <p className="text-zinc-500 mb-8">Thank you for applying. We will review your application and get back to you soon.</p>
        <button onClick={() => router.push('/')} className="text-[#4278b8] hover:underline font-medium">
          Return to open positions
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {formConfig.map((field) => (
        <div key={field.name} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
          <div className="sm:w-1/3 pt-2">
            <label htmlFor={field.name} className="block text-sm text-zinc-600">
              {field.label} {field.required && <span className="text-[#e26955]">*</span>}
            </label>
          </div>
          
          <div className="flex-1">
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:border-[#4278b8] transition-colors resize-y"
              />
            ) : field.type === 'file' ? (
              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  type="url"
                  placeholder="Link to your Resume/CV (e.g. Google Drive)"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:border-[#4278b8] transition-colors"
                />
              </div>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white outline-none focus:border-[#4278b8] transition-colors"
              />
            )}
          </div>
        </div>
      ))}

      <div className="pt-8 border-t border-zinc-200 text-center sm:text-left sm:pl-[calc(33.333333%+2rem)]">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors uppercase disabled:opacity-50"
          style={{ backgroundColor: '#4278b8' }}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
