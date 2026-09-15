import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
        <span className="text-zinc-900">{job.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-200 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-medium text-zinc-900 mb-4">{job.title}</h1>
          <div className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            {job.location} <span className="mx-2">/</span> {job.department} <span className="mx-2">/</span> Full-Time
          </div>
        </div>
        <Link 
          href={`/jobs/${job.id}/apply`}
          className="inline-flex whitespace-nowrap items-center justify-center px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors uppercase"
          style={{ backgroundColor: '#4278b8' }}
        >
          Apply for this job
        </Link>
      </div>

      <div className="prose prose-zinc max-w-none prose-headings:font-medium prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 mb-16">
        <ReactMarkdown>{job.description}</ReactMarkdown>
      </div>

      <div className="border-t border-zinc-200 pt-10 text-center">
        <Link 
          href={`/jobs/${job.id}/apply`}
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide text-white transition-colors uppercase"
          style={{ backgroundColor: '#4278b8' }}
        >
          Apply for this job
        </Link>
      </div>
    </div>
  );
}
