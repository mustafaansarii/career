'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function ApplyPage() {
  const { user, loading, loginRedirect } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    resumeLink: '',
  });
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Set default values when user loads
  if (user && !formData.name && !formData.email) {
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user?.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit application');
      }

      setStatus({ type: 'success', message: 'Application submitted successfully!' });
      setFormData(prev => ({ ...prev, phone: '', role: '', resumeLink: '' }));
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred while submitting your application.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 text-center mt-16">
        <div className="p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Authentication Required</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
            Please sign in to apply for a job. We'll pre-fill your information!
          </p>
          <button
            onClick={loginRedirect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-transform hover:scale-105"
          >
            Sign In to Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 mt-8">
      <h2 className="text-3xl font-bold mb-8">Job Application Form</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xl p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col gap-6">
        
        {status && (
          <div className={`p-4 rounded border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
            {status.message}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="role">Role Applied For</label>
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a role</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
            <option value="designer">Product Designer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="resumeLink">Resume / Portfolio Link</label>
          <input
            type="url"
            id="resumeLink"
            name="resumeLink"
            required
            value={formData.resumeLink}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-md font-bold text-lg transition-transform hover:scale-[1.02]"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

