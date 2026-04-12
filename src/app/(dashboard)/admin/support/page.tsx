'use client';

import { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Reply,
  Trash2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminSupportPage() {
  const [filter, setFilter] = useState('open');
  const tickets = [
    { id: 'TK-842', vendor: 'Le Petit Bistro', subject: 'WhatsApp QR not scanning', priority: 'High', status: 'Open', time: '12m ago', owner: 'Unassigned' },
    { id: 'TK-841', vendor: 'Cafe Neo', subject: 'Plan upgrade failure', priority: 'Critical', status: 'Pending', time: '1h ago', owner: 'Sarah M.' },
    { id: 'TK-840', vendor: 'Doughnut Hub', subject: 'Inconsistent stock reporting', priority: 'Normal', status: 'Resolved', time: '4h ago', owner: 'Mike K.' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic flex items-center gap-3">
             <LifeBuoy className="text-emerald-500" size={32} /> Resolution Command
          </h1>
          <p className="text-zinc-500 font-medium">Manage cross-platform vendor concerns and technical incident reports.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl">
           <Button 
             variant="ghost" 
             onClick={() => setFilter('open')}
             className={`rounded-xl text-xs font-black uppercase tracking-widest px-6 ${filter === 'open' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
           >
             Active Queues
           </Button>
           <Button 
             variant="ghost" 
             onClick={() => setFilter('closed')}
             className={`rounded-xl text-xs font-black uppercase tracking-widest px-6 ${filter === 'closed' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
           >
             Resolved
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search Ticket ID, Vendor or Keyword..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
             <Filter className="w-4 h-4 mr-2" /> Global Filter
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
         <div className="p-0">
            {tickets.map((ticket, i) => (
               <div key={ticket.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-900/50 hover:bg-zinc-800/20 transition-all group last:border-b-0">
                  <div className="flex items-start gap-6">
                     <div className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center border shrink-0 ${
                        ticket.priority === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                        ticket.priority === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                        'bg-zinc-800 border-zinc-700 text-zinc-500'
                     }`}>
                        <span className="text-[10px] font-black leading-none mb-1">{ticket.status}</span>
                        <MessageSquare size={20} />
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h3 className="text-lg font-black text-white italic tracking-tight uppercase group-hover:text-emerald-400 transition-colors">#{ticket.id}</h3>
                           <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest ${
                              ticket.priority === 'Critical' ? 'border-red-500/30 text-red-500' :
                              ticket.priority === 'High' ? 'border-orange-500/30 text-orange-500' :
                              'border-zinc-800 text-zinc-600'
                           }`}>
                              {ticket.priority} Impact
                           </Badge>
                        </div>
                        <p className="text-base font-bold text-zinc-400 leading-none">{ticket.subject}</p>
                        <div className="flex items-center gap-4 pt-1 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                           <span className="flex items-center gap-1.5"><User size={12} className="text-blue-500" /> {ticket.vendor}</span>
                           <span className="flex items-center gap-1.5"><Clock size={12} className="text-zinc-700" /> Received {ticket.time}</span>
                           <span className="flex items-center gap-1.5 italic">• Assigned: {ticket.owner}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6 lg:mt-0 lg:ml-8">
                     <div className="hidden lg:flex flex-col items-end mr-6 border-r border-zinc-800 pr-6 space-y-1">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Resolution Progress</p>
                        <div className="h-1.5 w-32 bg-zinc-950 rounded-full overflow-hidden">
                           <div className={`h-full ${ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-blue-500'} transition-all`} style={{ width: ticket.status === 'Resolved' ? '100%' : '30%' }} />
                        </div>
                     </div>
                     <Button className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold text-xs h-12 px-6 group/btn">
                        <Reply size={16} className="mr-2 group-hover/btn:-translate-x-1 transition-transform" /> Engage
                     </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button className="h-12 w-12 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all">
                              <MoreVertical size={20} />
                           </button>
                        </DropdownMenuTrigger>
                        {/* Mocking dropdown content since I used it before and it works */}
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-52 p-2">
                           <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                              <FileText className="w-4 h-4 mr-2" /> View Audit Trail
                           </DropdownMenuItem>
                           <DropdownMenuItem className="focus:bg-emerald-500/10 focus:text-emerald-500 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve Ticket
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-zinc-800" />
                           <DropdownMenuItem className="focus:bg-red-500/10 px-2 py-2 rounded-lg cursor-pointer text-red-500 text-xs font-bold">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Entry
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            ))}
         </div>

         <div className="p-8 bg-zinc-950/20 text-center">
            <Button variant="link" className="text-zinc-700 hover:text-white text-[10px] font-black uppercase tracking-widest italic no-underline">
               Explore multi-tier customer success archives
            </Button>
         </div>
      </div>

      {/* Analytics & Meta */}
      <div className="grid gap-6 md:grid-cols-2">
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="h-24 w-24 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 animate-[spin_3s_linear_infinite] flex items-center justify-center">
               <span className="text-xl font-black text-white italic">84%</span>
            </div>
            <div className="space-y-1">
               <h4 className="text-lg font-black text-white italic uppercase tracking-tight">Satisfaction Index</h4>
               <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[260px]">Positive resolution feedback from vendors within the last 30 operational days.</p>
            </div>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="h-24 w-24 rounded-full border-8 border-blue-500/20 border-t-blue-500 flex items-center justify-center">
               <span className="text-xl font-black text-white italic">22m</span>
            </div>
            <div className="space-y-1">
               <h4 className="text-lg font-black text-white italic uppercase tracking-tight">Avg Response Node</h4>
               <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[260px]">Current platform-wide average for initial administrative engagement on new concerns.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

// Minimal Dropdown components to avoid external file deps in the same turn
function DropdownMenu({ children }: { children: React.ReactNode }) { return <div className="relative inline-block">{children}</div>; }
function DropdownMenuTrigger({ children, asChild }: any) { return children; }
function DropdownMenuContent({ children, className }: any) { return <div className={`hidden group-active:block absolute right-0 mt-2 z-50 ${className}`}>{children}</div>; }
function DropdownMenuItem({ children, className }: any) { return <div className={className}>{children}</div>; }
function DropdownMenuSeparator({ className }: any) { return <div className={className} />; }
function DropdownMenuLabel({ children, className }: any) { return <div className={className}>{children}</div>; }
