import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function JobsPage() {
  const jobs = await prisma.jobOpening.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' }
  });

  // Group by department
  const groupedJobs = jobs.reduce((acc: any, job) => {
    const dept = job.department || 'GENERAL';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 bg-white min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 uppercase">Current Openings</h1>
      </div>

      <div className="space-y-16">
        {Object.keys(groupedJobs).length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            No open roles found.
          </div>
        ) : (
          Object.keys(groupedJobs).sort().map(department => (
            <div key={department} className="space-y-8">
              <h2 className="text-xl font-bold tracking-widest text-zinc-600 uppercase border-b border-zinc-100 pb-4">
                {department}
              </h2>
              <div className="space-y-6">
                {groupedJobs[department].map((job: any) => (
                  <div key={job.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <Link href={`/jobs/${job.id}`} className="text-xl font-medium text-zinc-800 hover:text-[#c96442] transition-colors">
                          {job.title}
                        </Link>
                        <div className="text-xs font-semibold tracking-widest text-zinc-400 mt-2 uppercase">
                          {job.location} <span className="mx-2">•</span> {job.jobType}
                        </div>
                      </div>
                      <Link 
                        href={`/jobs/${job.id}`} 
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-[#3b71ca] hover:bg-[#2b58a1] transition-colors"
                        style={{ backgroundColor: '#4278b8' }}
                      >
                        APPLY
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
