
import { prisma } from '@/lib/db';
import { RequestsClient } from './RequestsClient';

export default async function AdminRequestsPage() {
  const requests = await (prisma as any).featureRequest.findMany({
    include: {
      vendor: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Intelligence Inbox</h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Monitor and triage architectural requests from your vendor network.</p>
        </div>
        <div className="h-12 px-6 flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 whitespace-nowrap overflow-hidden italic shadow-inner">
           <span className="animate-pulse mr-2">●</span> Transmission Sync Active
        </div>
      </div>

      <RequestsClient initialRequests={requests} />
    </div>
  );
}
