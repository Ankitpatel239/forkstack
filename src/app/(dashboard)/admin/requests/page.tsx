
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminRequestsPage() {
  const requests = await (prisma as any).featureRequest.findMany({
    include: {
      vendor: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-zinc-800 text-zinc-400';
      case 'REVIEWING': return 'bg-blue-500/10 text-blue-400';
      case 'PLANNED': return 'bg-emerald-500/10 text-emerald-400';
      case 'COMPLETED': return 'bg-emerald-500 text-zinc-950';
      case 'REJECTED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Intelligence Inbox</h1>
          <p className="text-zinc-500 font-medium">Monitor and triage architectural requests from your vendor network.</p>
        </div>
        <div className="h-12 px-6 flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 whitespace-nowrap overflow-hidden italic shadow-inner">
           <span className="animate-pulse mr-2">●</span> Real-time Sync Active
        </div>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] py-32 text-center">
             <div className="flex flex-col items-center gap-6 opacity-20">
                <MessageSquare size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No incoming transmission detected.</p>
             </div>
          </div>
        ) : (
          requests.map((req:any) => (
            <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all active:scale-[0.99] cursor-pointer">
              <div className="flex flex-col md:flex-row">
                 {/* Left Panel: Content */}
                 <div className="flex-1 p-8 space-y-6 border-b md:border-b-0 md:border-r border-zinc-800">
                    <div className="flex items-start justify-between">
                       <div className="space-y-1">
                          <div className="flex items-center gap-3 mb-2">
                             <Badge className={`border-none text-[9px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                {req.status}
                             </Badge>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${getPriorityColor(req.priority)}`}>
                                {req.priority} Priority
                             </span>
                          </div>
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">
                             {req.title}
                          </h3>
                       </div>
                       <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          {new Date(req.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    
                    <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-3xl">
                       {req.description}
                    </p>

                    {req.adminNotes && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1 italic">
                            <CheckCircle2 size={12} /> Response Node
                         </div>
                         <p className="text-xs font-bold text-zinc-500 italic">
                            {req.adminNotes}
                         </p>
                      </div>
                    )}
                 </div>

                 {/* Right Panel: Metadata & Actions */}
                 <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-zinc-950/20">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Source Vendor</p>
                          <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
                             <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                                <User size={20} />
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black text-white uppercase italic leading-none">{req.vendor.businessName}</h4>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1 italic">slug: {req.vendor.tenantSlug}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8">
                       <Button className="w-full h-12 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-2">
                          Execute Response <ChevronRight size={16} />
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
