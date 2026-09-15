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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">Thank you for applying. We will review your application and get back to you soon.</p>
        <button onClick={() => router.push('/')} className="text-blue-600 hover:underline font-medium">
          Return to Job Board
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {formConfig.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'file' ? 'text' : field.type} // Using text for URL/file for now
              placeholder={field.type === 'file' ? 'Enter a link to your resume (e.g. Google Drive, Dropbox)' : ''}
              required={field.required}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ))}

      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
