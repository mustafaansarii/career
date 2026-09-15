import JobForm from '@/app/components/JobForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewJobPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-10">
        <Link href="/admin" className="hover:text-zinc-900 transition-colors">Admin Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-900">New Job</span>
      </nav>

      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Job Opening</h1>
        <p className="text-zinc-500">Fill in the details below to open a new role.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <JobForm />
      </div>
    </div>

    </div>
  );
}
