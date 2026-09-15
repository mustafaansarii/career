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
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-10">
        <span className="text-zinc-900">Admin Dashboard</span>
      </nav>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-1">Manage your job openings and view applications.</p>
          </div>
          <Link href="/admin/jobs/new" className="inline-flex items-center justify-center gap-2 bg-[#c96442] hover:bg-[#b5573a] text-white px-5 py-2.5 rounded-lg font-bold transition-colors">
            <Plus className="h-4 w-4" /> New Job
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Applications</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No jobs created yet.</td>
                  </tr>
                )}
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{job.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">{job.department}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/jobs/${job.id}/applications`} className="inline-flex items-center gap-2 text-[#4278b8] hover:text-[#2b58a1] font-bold transition-colors">
                        <Users className="h-4 w-4" /> {job._count.applications} candidate{job._count.applications !== 1 && 's'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/jobs/${job.id}`} className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-all shadow-sm">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
