import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ApplyForm from './ApplyForm';

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
    <div className="max-w-4xl mx-auto w-full px-6 py-12 bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-10">
        <Link href="/" className="hover:text-zinc-900 transition-colors">CVEnhance Careers</Link>
        <span>/</span>
        <Link href={`/jobs/${job.id}`} className="hover:text-zinc-900 transition-colors">{job.title}</Link>
        <span>/</span>
        <span className="text-zinc-900">Application</span>
      </nav>

      <div className="border-b border-zinc-200 pb-8 mb-12">
        <h1 className="text-3xl font-medium text-zinc-900 mb-4">{job.title}</h1>
        <div className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          {job.location} <span className="mx-2">/</span> {job.department} <span className="mx-2">/</span> {job.jobType}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Submit your application</h3>
      </div>

      <ApplyForm jobId={job.id} formConfig={job.formConfig as any[]} />
    </div>
  );
}
