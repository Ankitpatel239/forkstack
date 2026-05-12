
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight,
  User,
  Clock,
  Settings2,
  Trash2,
  Loader2,
  X,
  Zap,
  Info
} from 'lucide-react';
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
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateFeatureRequest, deleteFeatureRequest } from '@/app/actions/admin-requests';

export function RequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    adminNotes: '',
    priority: ''
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

  const handleOpenModal = (req: any) => {
    setSelectedRequest(req);
    setFormData({
      status: req.status,
      adminNotes: req.adminNotes || '',
      priority: req.priority
    });
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      const result = await updateFeatureRequest(selectedRequest.id, formData);
      if (result.success) {
        toast.success('Response broadcasted to vendor');
        setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, ...formData } : r));
        setSelectedRequest(null);
      } else {
        toast.error(result.error || 'Failed to update request');
      }
    } catch (e) {
      toast.error('Transmission error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transmission?')) return;
    try {
      const result = await deleteFeatureRequest(id);
      if (result.success) {
        toast.success('Request purged');
        setRequests(requests.filter(r => r.id !== id));
      }
    } catch (e) {
      toast.error('Deletion error');
    }
  };

  return (
    <>
      <div className="grid gap-6">
        {requests.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] py-32 text-center">
             <div className="flex flex-col items-center gap-6 opacity-20">
                <MessageSquare size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No incoming transmission detected.</p>
             </div>
          </div>
        ) : (
          requests.map((req: any) => (
            <div 
              key={req.id} 
              onClick={() => handleOpenModal(req)}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
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
                       <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    
                    <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-3xl">
                       {req.description}
                    </p>

                    {req.adminNotes && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl relative overflow-hidden group/note">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Info size={40} />
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1 italic relative z-10">
                            <CheckCircle2 size={12} /> Response Node
                         </div>
                         <p className="text-xs font-bold text-zinc-500 italic relative z-10">
                            {req.adminNotes}
                         </p>
                      </div>
                    )}
                 </div>

                 <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-zinc-950/20">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Source Vendor</p>
                          <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
                             <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-inner">
                                <User size={20} />
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black text-white uppercase italic leading-none">{req.vendor.businessName}</h4>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1 italic">slug: {req.vendor.tenantSlug}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 space-y-3">
                       <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(req);
                        }}
                        className="w-full h-12 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-2"
                       >
                          Execute Response <ChevronRight size={16} />
                       </Button>
                       <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(req.id);
                        }}
                        variant="ghost"
                        className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all"
                       >
                          Purge Transmission
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 border-b border-zinc-800 relative">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <Settings2 size={100} />
             </div>
             <DialogHeader className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                  <Zap size={28} />
               </div>
               <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                  Intelligence Resolution
               </DialogTitle>
               <DialogDescription className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                  Configure the platform response for this feature request.
               </DialogDescription>
             </DialogHeader>
          </div>

          <div className="p-10 space-y-8">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Pipeline Status</Label>
                   <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({...formData, status: val})}
                   >
                      <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl px-6 font-bold text-xs">
                         <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                         <SelectItem value="PENDING">Pending</SelectItem>
                         <SelectItem value="REVIEWING">Reviewing</SelectItem>
                         <SelectItem value="PLANNED">Planned</SelectItem>
                         <SelectItem value="COMPLETED">Completed</SelectItem>
                         <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Urgency Vector</Label>
                   <Select 
                    value={formData.priority} 
                    onValueChange={(val) => setFormData({...formData, priority: val})}
                   >
                      <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl px-6 font-bold text-xs">
                         <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                         <SelectItem value="NORMAL">Normal</SelectItem>
                         <SelectItem value="HIGH">High</SelectItem>
                         <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>

             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Admin Resolution Notes</Label>
                <Textarea 
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({...formData, adminNotes: e.target.value})}
                  placeholder="Draft your response to the vendor..."
                  className="bg-zinc-950 border-zinc-800 min-h-[150px] rounded-2xl px-6 py-4 font-bold text-sm focus:border-emerald-500/50 resize-none"
                />
             </div>
          </div>

          <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-4">
             <Button 
              variant="ghost" 
              onClick={() => setSelectedRequest(null)}
              className="h-14 px-8 text-zinc-500 font-black uppercase tracking-widest text-[10px]"
             >
                Abort
             </Button>
             <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/10 min-w-[180px]"
             >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Broadcast Resolution'}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
