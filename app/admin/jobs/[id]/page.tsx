import JobForm from '@/app/components/JobForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const job = await prisma.jobOpening.findUnique({
    where: { id }
  });

  if (!job) return notFound();

  // Convert Json field to appropriate type for the form
  const safeJob = {
    ...job,
    formConfig: job.formConfig as any
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-10">
        <Link href="/admin" className="hover:text-zinc-900 transition-colors">Admin Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-900">Edit Job</span>
      </nav>

      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <JobForm initialData={safeJob} />
      </div>
    </div>

    </div>
  );
}
