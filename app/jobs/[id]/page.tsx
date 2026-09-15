import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin, ArrowLeft } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to all jobs
      </Link>

      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        
        <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{job.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{job.location}</span>
          </div>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <Link 
            href={`/jobs/${job.id}/apply`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Apply for this position
          </Link>
        </div>
      </div>
    </div>
  );
}
