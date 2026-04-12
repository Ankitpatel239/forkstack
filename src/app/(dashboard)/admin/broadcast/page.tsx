'use client';

import { useState } from 'react';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Mail, 
  Zap, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [history] = useState([
    { id: '1', title: 'Platform Maintenance Notice', target: 'All Vendors', status: 'Delivered', reach: '1,280', date: 'Oct 12, 2026' },
    { id: '2', title: 'New Feature: WhatsApp Pro', target: 'Pro & Enterprise', status: 'Sent', reach: '520', date: 'Oct 10, 2026' },
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Broadcast initiated successfully!", {
        description: "Your message is being queued for delivery across all selected channels."
      });
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Platform Broadcast Hub</h1>
          <p className="text-zinc-500 font-medium">Coordinate global communications across the entire vendor ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-8 border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-4 font-black uppercase tracking-widest text-[10px]">
             Active Relay Nodes: 4
           </Badge>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Composer Section */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="p-8 border-b border-zinc-800 bg-zinc-950/20">
                 <h2 className="text-xl font-black text-white italic tracking-tight uppercase">Emergency Composer</h2>
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">Instant reach via Dashboard, Email & WhatsApp.</p>
              </div>
              
              <form onSubmit={handleBroadcast} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Broadcast Subject</Label>
                    <Input className="bg-zinc-950 border-zinc-800 h-12 text-zinc-100 font-bold" placeholder="e.g. Critical System Update v4.2" required />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Target Audience</Label>
                       <Select defaultValue="all">
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11">
                             <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                             <SelectItem value="all">All Active Vendors</SelectItem>
                             <SelectItem value="enterprise">Enterprise Only</SelectItem>
                             <SelectItem value="pro">Pro Tiers</SelectItem>
                             <SelectItem value="new">New signups (7 days)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Priority Level</Label>
                       <Select defaultValue="normal">
                          <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11">
                             <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                             <SelectItem value="low">Low (Routine)</SelectItem>
                             <SelectItem value="normal">Standard Notice</SelectItem>
                             <SelectItem value="high" className="text-orange-500">High (Action Required)</SelectItem>
                             <SelectItem value="critical" className="text-red-500">CRITICAL (Alert)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Message Content</Label>
                    <Textarea 
                       className="bg-zinc-950 border-zinc-800 min-h-[160px] text-zinc-300 font-medium resize-none p-4" 
                       placeholder="Draft your platform-wide announcement here..."
                       required
                    />
                 </div>

                 <div className="flex flex-wrap gap-4 pt-4">
                    {[
                      { label: 'Dashboard Notice', icon: Zap, active: true },
                      { label: 'Email Relay', icon: Mail, active: true },
                      { label: 'WhatsApp Alert', icon: MessageSquare, active: false }
                    ].map((channel, i) => (
                      <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${channel.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'} cursor-pointer hover:border-emerald-500/30 transition-all`}>
                         <channel.icon size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{channel.label}</span>
                      </div>
                    ))}
                 </div>

                 <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-14 mt-6 shadow-2xl shadow-emerald-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Send size={18} className="mr-3" /> Execute Global Broadcast
                      </>
                    )}
                 </Button>
              </form>
           </div>
        </div>

        {/* History & Reach Section */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl">
              <h3 className="text-lg font-black text-white italic tracking-tight uppercase leading-none border-b border-zinc-800 pb-4">Transmission History</h3>
              
              <div className="space-y-6">
                 {history.map((item) => (
                    <div key={item.id} className="relative pl-6 border-l border-zinc-800 space-y-2 group">
                       <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{item.date}</span>
                          <Badge className="bg-zinc-800 text-zinc-400 text-[8px] border-none px-2 h-5 font-black uppercase tracking-widest">{item.status}</Badge>
                       </div>
                       <h4 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                       <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                          <span className="flex items-center gap-1"><Users size={12} /> Reach: {item.reach}</span>
                          <span className="flex items-center gap-1 uppercase italic">• To: {item.target}</span>
                       </div>
                       <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="link" className="h-auto p-0 text-red-500/60 hover:text-red-500 text-[9px] font-black uppercase tracking-widest">
                             <Trash2 size={12} className="mr-1" /> Remove from Logs
                          </Button>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 text-center">
                 <AlertCircle size={24} className="text-zinc-700 mx-auto mb-3" />
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                   Global broadcasts are recorded in the platform audit trail for 90 days. Critical alerts ignore vendor notification preferences.
                 </p>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center group">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Avg Open Rate</p>
                 <h4 className="text-2xl font-black text-emerald-500 italic">92.4%</h4>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Engagements</p>
                 <h4 className="text-2xl font-black text-blue-500 italic">4.8k</h4>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
