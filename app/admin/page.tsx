import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Plus, Users, Edit } from 'lucide-react';

const prisma = new PrismaClient();

export const revalidate = 0;

export default async function AdminDashboard() {
  const jobs = await prisma.jobOpening.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-zinc-500">Manage your job openings and applications.</p>
        </div>
        <Link href="/admin/jobs/new" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> New Job
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Applications</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No jobs created yet.</td>
              </tr>
            )}
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">{job.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500">{job.department}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/jobs/${job.id}/applications`} className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium">
                    <Users className="h-4 w-4" /> {job._count.applications}
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/jobs/${job.id}`} className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
