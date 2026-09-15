import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();
export const revalidate = 0;

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const job = await prisma.jobOpening.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!job) return notFound();

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-10">
        <Link href="/admin" className="hover:text-zinc-900 transition-colors">Admin Dashboard</Link>
        <span>/</span>
        <span className="text-zinc-900">{job.title} - Applications</span>
      </nav>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Applications</h1>
          <p className="text-zinc-500 mt-1">Viewing all candidates for <span className="font-semibold text-zinc-900">{job.title}</span></p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {job.applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No applications received yet.</td>
                  </tr>
                )}
                {job.applications.map(app => (
                  <tr key={app.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-zinc-900">{app.applicantName}</td>
                    <td className="px-6 py-4 text-zinc-500">{app.applicantEmail}</td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#4278b8]">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <details className="relative inline-block text-left cursor-pointer z-10">
                        <summary className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-[#4278b8] hover:bg-blue-50 rounded-lg transition-colors list-none [&::-webkit-details-marker]:hidden">
                          <FileText className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 shadow-xl rounded-xl p-5 z-50">
                          <h4 className="font-bold mb-4 pb-3 border-b text-zinc-900">Application Data</h4>
                          <div className="space-y-4 text-left max-h-96 overflow-y-auto pr-2">
                            {Object.entries(app.answers as Record<string, any>).map(([key, value]) => (
                              <div key={key}>
                                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                {typeof value === 'string' && (value.startsWith('http') || value.startsWith('www')) ? (
                                  <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4278b8] hover:underline break-all font-medium">
                                    {value}
                                  </a>
                                ) : (
                                  <div className="text-sm text-zinc-900 break-words whitespace-pre-wrap">{value || '-'}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
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
