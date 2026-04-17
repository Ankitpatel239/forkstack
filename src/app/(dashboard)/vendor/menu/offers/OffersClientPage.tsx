
'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Calendar, 
  Clock, 
  Percent, 
  Trash2, 
  MoreVertical,
  Edit,
  CheckCircle2,
  XCircle,
  Zap,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { deleteOffer, updateOffer } from '@/app/actions/menu';
import { toast } from 'sonner';
import { format } from 'date-fns';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function OffersClientPage({ initialOffers }: { initialOffers: any[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [search, setSearch] = useState('');

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Purge this promotion node?')) return;
    try {
      await deleteOffer(id);
      setOffers(offers.filter(o => o.id !== id));
      toast.success('Promotion purged from system');
    } catch (e) {
      toast.error('Purge failed');
    }
  };

  const toggleStatus = async (offer: any) => {
    try {
      await updateOffer(offer.id, { isActive: !offer.isActive });
      setOffers(offers.map(o => o.id === offer.id ? { ...o, isActive: !o.isActive } : o));
      toast.success(`Offer ${!offer.isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error('Sync failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Promotions Hub</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Manage day-wise offers and flash discounts.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/10">
          <Plus size={16} className="mr-2" /> Launch Promotion
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 h-12 w-full md:w-[400px] rounded-2xl focus-within:border-emerald-500/30 transition-all group">
        <Search size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter campaigns..." 
          className="bg-transparent border-none focus:ring-0 text-xs font-bold flex-1 outline-none text-white tracking-tight" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffers.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] opacity-30">
            <Gift size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No active marketing vectors detected.</p>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <div key={offer.id} className={`bg-zinc-950 border ${offer.isActive ? 'border-zinc-800 hover:border-emerald-500/30' : 'border-zinc-900 opacity-60'} p-6 rounded-[2rem] transition-all relative overflow-hidden group shadow-2xl hover:scale-[1.02]`}>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${offer.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                         <Percent size={14} />
                      </div>
                      <Badge className={`${offer.isActive ? 'bg-emerald-500 text-zinc-950 px-2' : 'bg-zinc-900 text-zinc-600'} text-[8px] font-black uppercase tracking-widest border-none`}>
                         {offer.type.replace('_', ' ')}
                      </Badge>
                   </div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight mt-2">{offer.title}</h3>
                   <p className="text-xs text-zinc-500 font-medium line-clamp-1">{offer.description || 'No description provided.'}</p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-8 w-8 flex items-center justify-center hover:bg-zinc-900 rounded-lg text-zinc-700 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white w-40 rounded-xl p-1">
                    <DropdownMenuItem onClick={() => toggleStatus(offer)} className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-emerald-500 focus:text-zinc-950">
                      {offer.isActive ? <XCircle size={14} className="mr-2" /> : <CheckCircle2 size={14} className="mr-2" />}
                      {offer.isActive ? 'Kill Feed' : 'Broadcast Live'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-zinc-900 text-zinc-400">
                      <Edit size={14} className="mr-2" /> Reconfigure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="cursor-pointer text-red-500 text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-red-500/10">
                      <Trash2 size={14} className="mr-2" /> Purge Node
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-6 space-y-4 relative z-10">
                 <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Off Value</p>
                       <p className="text-lg font-black italic text-emerald-400">
                          {offer.type === 'PERCENTAGE' ? `${offer.value}%` : `₹${offer.value}`}
                       </p>
                    </div>
                    {offer.minOrderValue > 0 && (
                      <div className="text-right space-y-0.5">
                         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Threshold</p>
                         <p className="text-xs font-bold text-zinc-300">₹{offer.minOrderValue}+</p>
                      </div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 px-1">Broadcast Schedule (Day-wise)</p>
                    <div className="flex gap-1">
                       {DAYS.map((day, idx) => {
                         const isActive = offer.validDays.length === 0 || offer.validDays.includes(idx);
                         return (
                           <div 
                             key={day} 
                             className={`flex-1 text-center py-1 rounded-md text-[8px] font-black uppercase transition-all ${
                               isActive 
                               ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                               : 'bg-zinc-900 text-zinc-800'
                             }`}
                           >
                             {day[0]}
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-zinc-600">
                       <Calendar size={12} />
                       <span className="text-[9px] font-black uppercase tracking-tight">
                         {format(new Date(offer.startDate), 'MMM d')} — {format(new Date(offer.endDate), 'MMM d')}
                       </span>
                    </div>
                    {offer.isActive && (
                       <div className="flex items-center gap-1.5 text-emerald-500 animate-pulse">
                          <Zap size={12} fill="currentColor" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Active Node</span>
                       </div>
                    )}
                 </div>
              </div>

              {/* Decorative Glow */}
              {offer.isActive && (
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] group-hover:bg-emerald-500/10 transition-all" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
