'use client';

import { 
  Plus, 
  Search, 
  Tag, 
  Calendar as CalendarIcon, 
  Clock, 
  Percent, 
  Trash2, 
  MoreVertical,
  Edit,
  CheckCircle2,
  XCircle,
  Zap,
  Gift,
  Check,
  ChevronRight,
  Loader2,
  DollarSign
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { deleteOffer, updateOffer, createOffer } from '@/app/actions/menu';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function OffersClientPage({ initialOffers, menuItems }: { initialOffers: any[], menuItems: any[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [search, setSearch] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    type: 'PERCENTAGE',
    value: 0,
    minOrderValue: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    validDays: [] as number[],
    menuItemIds: [] as string[]
  });

  const filteredOffers = offers.filter((o: any) => 
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDayToggle = (idx: number) => {
    setNewOffer(prev => ({
      ...prev,
      validDays: prev.validDays.includes(idx) 
        ? prev.validDays.filter(d => d !== idx) 
        : [...prev.validDays, idx]
    }));
  };

  const handleItemToggle = (id: string) => {
    setNewOffer(prev => ({
      ...prev,
      menuItemIds: prev.menuItemIds.includes(id) 
        ? prev.menuItemIds.filter(mid => mid !== id) 
        : [...prev.menuItemIds, id]
    }));
  };

  const handleLaunch = async () => {
    if (!newOffer.title || (!newOffer.value && newOffer.type !== 'BOGO')) {
      toast.error('Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      const result = await createOffer(newOffer);
      setOffers([result, ...offers]);
      setIsLaunching(false);
      setNewOffer({
        title: '',
        description: '',
        type: 'PERCENTAGE',
        value: 0,
        minOrderValue: 0,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        validDays: [],
        menuItemIds: []
      });
      toast.success('Promotion launched successfully!');
    } catch (e) {
      toast.error('Failed to launch promotion.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(id);
      setOffers(offers.filter((o: any) => o.id !== id));
      toast.success('Offer deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (offer: any) => {
    try {
      await updateOffer(offer.id, { isActive: !offer.isActive });
      setOffers(offers.map((o: any) => o.id === offer.id ? { ...o, isActive: !o.isActive } : o));
      toast.success(`Offer ${!offer.isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error('Sync failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter text-emerald-500">Promotions Hub</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Manage discounts and seasonal offers.</p>
        </div>
        
        <Dialog open={isLaunching} onOpenChange={setIsLaunching}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all w-full md:w-auto">
              <Plus size={16} className="mr-2" /> New Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] max-w-5xl sm:max-w-5xl shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
             <DialogHeader className="p-6 md:p-8 border-b border-zinc-900 bg-zinc-900/30 shrink-0">
                <DialogTitle className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-emerald-500 flex items-center gap-2">
                   <Zap size={24} fill="currentColor" /> Create Promotion
                </DialogTitle>
             </DialogHeader>

             <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Promotion Name</label>
                         <Input 
                           value={newOffer.title}
                           onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                           placeholder="e.g. Weekend Flash Sale" 
                           className="bg-zinc-900 border-zinc-800 rounded-xl font-bold"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Offer Type</label>
                           <Select value={newOffer.type} onValueChange={val => setNewOffer({...newOffer, type: val})}>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 rounded-xl font-bold">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold">
                                 <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                 <SelectItem value="FIXED_AMOUNT">Flat Discount (₹)</SelectItem>
                                 <SelectItem value="BOGO">BOGO (1+1 Free)</SelectItem>
                              </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Amount</label>
                           <Input 
                             type="number"
                             disabled={newOffer.type === 'BOGO'}
                             value={newOffer.value}
                             onChange={e => setNewOffer({...newOffer, value: Number(e.target.value)})}
                             placeholder={newOffer.type === 'PERCENTAGE' ? '20' : '50'} 
                             className="bg-zinc-900 border-zinc-800 rounded-xl font-bold text-emerald-500"
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Active Days</label>
                         <div className="flex gap-1 justify-between">
                            {DAYS.map((day, idx) => (
                               <button 
                                 key={day}
                                 onClick={() => handleDayToggle(idx)}
                                 className={`h-9 w-9 rounded-lg text-[9px] font-black uppercase transition-all ${newOffer.validDays.includes(idx) || newOffer.validDays.length === 0 ? 'bg-emerald-500 text-black shadow-lg' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}
                               >
                                  {day[0]}
                               </button>
                            ))}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Starts On</label>
                           <Input 
                             type="date"
                             value={newOffer.startDate}
                             onChange={e => setNewOffer({...newOffer, startDate: e.target.value})}
                             className="bg-zinc-900 border-zinc-800 rounded-xl font-bold"
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Ends On</label>
                           <Input 
                             type="date"
                             value={newOffer.endDate}
                             onChange={e => setNewOffer({...newOffer, endDate: e.target.value})}
                             className="bg-zinc-900 border-zinc-800 rounded-xl font-bold"
                           />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Choose Participating Items</label>
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 h-[350px] overflow-y-auto custom-scrollbar space-y-2">
                         {menuItems.map(item => (
                            <div 
                              key={item.id} 
                              onClick={() => handleItemToggle(item.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${newOffer.menuItemIds.includes(item.id) ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'}`}
                            >
                               <div className="min-w-0">
                                  <p className={`text-[10px] font-black uppercase italic truncate ${newOffer.menuItemIds.includes(item.id) ? 'text-emerald-500' : 'text-zinc-300'}`}>{item.name}</p>
                                  <p className="text-[8px] font-bold text-zinc-600">₹{item.price}</p>
                               </div>
                               {newOffer.menuItemIds.includes(item.id) && <CheckCircle2 size={14} className="text-emerald-500" />}
                            </div>
                         ))}
                      </div>
                      <p className="text-[8px] font-bold text-zinc-700 italic text-center">Selected {newOffer.menuItemIds.length} items</p>
                   </div>
                </div>
             </div>

             <DialogFooter className="p-6 md:p-8 bg-zinc-900/30 border-t border-zinc-900 gap-4 shrink-0">
                <Button variant="ghost" onClick={() => setIsLaunching(false)} className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button 
                  onClick={handleLaunch} 
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl shadow-xl shadow-emerald-500/10"
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Live Promotion"}
                </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 h-12 w-full md:w-[400px] rounded-2xl focus-within:border-emerald-500/30 transition-all group">
        <Search size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campaigns..." 
          className="bg-transparent border-none focus:ring-0 text-xs font-bold flex-1 outline-none text-white tracking-tight" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffers.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] opacity-30">
            <Gift size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No active offers found.</p>
          </div>
        ) : (
          filteredOffers.map((offer: any) => (
            <div key={offer.id} className={`bg-zinc-950 border ${offer.isActive ? 'border-zinc-800 hover:border-emerald-500/30' : 'border-zinc-900 opacity-60'} p-6 rounded-[2rem] transition-all relative overflow-hidden group shadow-2xl hover:scale-[1.02]`}>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${offer.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                         {offer.type === 'PERCENTAGE' ? <Percent size={14} /> : offer.type === 'BOGO' ? <Gift size={14} /> : <DollarSign size={14} />}
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
                      {offer.isActive ? 'Stop Offer' : 'Start Offer'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-zinc-900 text-zinc-400">
                      <Edit size={14} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="cursor-pointer text-red-500 text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-red-500/10">
                      <Trash2 size={14} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-6 space-y-4 relative z-10">
                 <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Discount</p>
                       <p className="text-lg font-black italic text-emerald-400">
                          {offer.type === 'PERCENTAGE' ? `${offer.value}%` : offer.type === 'BOGO' ? '1+1 FREE' : `₹${offer.value}`}
                       </p>
                    </div>
                    {offer.minOrderValue > 0 && (
                      <div className="text-right space-y-0.5">
                         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Min. Order</p>
                         <p className="text-xs font-bold text-zinc-300">₹{offer.minOrderValue}+</p>
                      </div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 px-1">Valid On</p>
                    <div className="flex gap-1">
                       {DAYS.map((day: string, idx: number) => {
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
                       <CalendarIcon size={12} />
                       <span className="text-[9px] font-black uppercase tracking-tight">
                         {format(new Date(offer.startDate), 'MMM d')} — {format(new Date(offer.endDate), 'MMM d')}
                       </span>
                    </div>
                    {offer.isActive && (
                       <div className="flex items-center gap-1.5 text-emerald-500 animate-pulse">
                          <Zap size={12} fill="currentColor" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
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
