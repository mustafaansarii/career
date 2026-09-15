import JobForm from '@/app/components/JobForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Create New Job Opening</h1>
        <p className="text-zinc-500">Fill in the details below to open a new role.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <JobForm />
      </div>
    </div>
  );
}
