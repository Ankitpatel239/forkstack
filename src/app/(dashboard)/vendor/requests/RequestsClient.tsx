
'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { submitFeatureRequest } from '@/app/actions/requests';
import { toast } from 'sonner';

export function RequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'NORMAL'
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const res = await submitFeatureRequest(formData);
      if (res.success) {
        toast.success('Transmission received. Architecture team notified.');
        setRequests([res.data, ...requests]);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', priority: 'NORMAL' });
      } else {
        toast.error(res.error || 'Fault in transmission');
      }
    } catch (e) {
      toast.error('Critical node failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Architecture Requests</h1>
          <p className="text-zinc-500 font-medium">Transmit your feature requirements and bridge operational gaps with our dev team.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5 mr-1" /> New Request
        </Button>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] py-32 text-center">
             <div className="flex flex-col items-center gap-6 opacity-20">
                <MessageSquare size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No requests broadcasted yet.</p>
             </div>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 hover:border-emerald-500/30 transition-all">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        <Badge className={`border-none text-[9px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                           {req.status}
                        </Badge>
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                           {req.priority} Priority
                        </span>
                     </div>
                     <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">{req.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                     Node: {req.id.slice(-8).toUpperCase()} • {new Date(req.createdAt).toLocaleDateString()}
                  </span>
               </div>

               <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-4xl">{req.description}</p>

               {req.adminNotes && (
                  <div className="pt-6 border-t border-zinc-800">
                     <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                           <CheckCircle2 size={40} />
                        </div>
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 italic">
                           <MessageSquare size={14} /> Backend Response Node
                        </h4>
                        <p className="text-xs font-bold text-zinc-500 italic max-w-2xl">{req.adminNotes}</p>
                     </div>
                  </div>
               )}
            </div>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white w-[95vw] sm:max-w-[600px] rounded-[2rem] md:rounded-[2.5rem] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 md:p-10 border-b border-zinc-800 relative shrink-0">
             <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 hidden sm:block">
                <Send size={100} />
             </div>
             <DialogHeader className="relative z-10">
               <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 md:mb-6">
                  <MessageSquare size={24} className="md:w-7 md:h-7" />
               </div>
               <DialogTitle className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Broadcast Requirement</DialogTitle>
               <DialogDescription className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 leading-relaxed">Transmit critical architectural needs directly to the platform team.</DialogDescription>
             </DialogHeader>
          </div>

          <div className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar flex-1">
             <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Concept Title</Label>
                      <Input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Advanced SEO Nodes" 
                        className="bg-zinc-950 border-zinc-800 h-12 md:h-14 px-4 md:px-6 font-bold text-xs md:text-sm rounded-xl md:rounded-2xl" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Priority Vector</Label>
                      <Select 
                        value={formData.priority}
                        onValueChange={v => setFormData({...formData, priority: v})}
                      >
                         <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12 md:h-14 px-4 md:px-6 font-bold text-xs md:text-sm rounded-xl md:rounded-2xl text-white">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold text-[10px] md:text-xs">
                            <SelectItem value="LOW">LOW</SelectItem>
                            <SelectItem value="NORMAL">NORMAL</SelectItem>
                            <SelectItem value="HIGH">HIGH</SelectItem>
                            <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Detailed Technical Description</Label>
                   <Textarea 
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                     placeholder="Explain the functional necessity and operational impact..." 
                     className="bg-zinc-950 border-zinc-800 min-h-[120px] md:min-h-[150px] p-4 md:p-6 font-bold text-xs md:text-sm rounded-xl md:rounded-2xl resize-none" 
                   />
                </div>
             </div>
          </div>

          <div className="p-4 md:p-8 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 shrink-0">
             <Button 
               onClick={() => setIsModalOpen(false)}
               variant="ghost" 
               className="h-12 md:h-14 w-full sm:w-auto px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
             >
                Abort
             </Button>
             <Button 
               onClick={handleSubmit}
               disabled={loading}
               className="h-12 md:h-14 w-full sm:w-auto px-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl shadow-xl shadow-emerald-500/10 sm:min-w-[180px]"
             >
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={16} className="mr-2" /> Broadcast Sync</>}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
