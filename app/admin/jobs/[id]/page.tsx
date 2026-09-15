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
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <JobForm initialData={safeJob} />
      </div>
    </div>
  );
}
