import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { Briefcase, MapPin, Search } from 'lucide-react';

const prisma = new PrismaClient();

export const revalidate = 0; // Disable static rendering for this page since it reads from DB directly

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { function: fn, location: loc } = await searchParams;

  const filter: any = { status: 'OPEN' };
  if (typeof fn === 'string' && fn) {
    filter.department = { contains: fn, mode: 'insensitive' };
  }
  if (typeof loc === 'string' && loc) {
    filter.location = { contains: loc, mode: 'insensitive' };
  }

  const jobs = await prisma.jobOpening.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Discover your next career opportunity.</p>
      </div>

      <form className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
        <div className="flex-1 relative">
          <Briefcase className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input 
            name="function"
            defaultValue={typeof fn === 'string' ? fn : ''}
            placeholder="Department / Function"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
          <input 
            name="location"
            defaultValue={typeof loc === 'string' ? loc : ''}
            placeholder="Location"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 justify-center transition-colors">
          <Search className="h-5 w-5" />
          Search
        </button>
      </form>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-zinc-500">No open roles found matching your criteria.</p>
          </div>
        ) : (
          jobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.department}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
