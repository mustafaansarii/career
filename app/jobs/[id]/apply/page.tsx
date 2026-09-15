import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import ApplyForm from './ApplyForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const job = await prisma.jobOpening.findUnique({
    where: { id, status: 'OPEN' }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <Link href={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to job details
      </Link>

      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Apply for {job.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          Submit your application for the {job.title} role in {job.location}.
        </p>

        <ApplyForm jobId={job.id} formConfig={job.formConfig as any[]} />
      </div>
    </div>
  );
}
