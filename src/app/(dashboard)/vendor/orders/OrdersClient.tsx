
'use client';

import { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  User, 
  CheckCircle2, 
  Clock3, 
  MoveRight,
  Filter,
  Search,
  MoreVertical,
  X,
  Navigation,
  Hash,
  ArrowUpRight,
  ChefHat,
  PackageCheck,
  Zap,
  Phone,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { updateOrderStatus } from '@/app/actions/orders';
import { toast } from 'sonner';
import { ManualOrderDialog } from './ManualOrderDialog';
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';

export function OrdersClient({ 
  initialOrders,
  vendorId 
}: { 
  initialOrders: any[],
  vendorId: string 
}) {
  const socket = useSocket(vendorId);

  const [filter, setFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('Today');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-order', (newOrder: any) => {
      let isUpdate = false;
      setOrders(prev => {
        const exists = prev.some(o => o.id === newOrder.id);
        if (exists) {
          isUpdate = true;
          return prev.map(o => o.id === newOrder.id ? { ...newOrder, _justUpdated: true } : o);
        }
        return [newOrder, ...prev];
      });

      if (isUpdate) {
        toast.success(`Bill Updated #${newOrder.orderNumber.slice(-6)}`, {
          description: `${newOrder.customerName || 'Guest'} added new items to their bill.`,
          className: "bg-blue-600 text-white border-none"
        });
      } else {
        toast.info(`New Order #${newOrder.orderNumber.slice(-6)} received!`, {
          description: `${newOrder.customerName || 'Guest'} just placed an order.`,
          className: "bg-emerald-600 text-white border-none"
        });
      }
    });

    return () => {
      socket.off('new-order');
    };
  }, [socket]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch = 
        (order.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.customerPhone || '').toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filter === 'ALL' || order.status === filter;
      
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      
      let matchesTime = true;
      if (timeFilter === 'Today') {
        matchesTime = orderDate >= today;
      } else if (timeFilter === 'Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        matchesTime = orderDate >= yesterday && orderDate < today;
      } else if (timeFilter === 'Last 7 Days') {
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        matchesTime = orderDate >= last7;
      } else if (timeFilter === 'All Time') {
        matchesTime = true;
      }
      
      return matchesSearch && matchesStatus && matchesTime;
    }).sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, search, filter, timeFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      toast.success(`Order ${newStatus.toLowerCase()} updated`);
      // Update local state for instant feedback
      setOrders(prev => prev.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]';
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20_rgba(239,68,68,0.05)]';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const activeCount = orders.filter((o: any) => o.status === 'PENDING').length;
  const cookingCount = orders.filter((o: any) => o.status === 'PROCESSING').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                <Zap size={20} />
             </div>
             <h1 className="text-4xl font-black italic tracking-tighter uppercase text-foreground">Live Stream</h1>
          </div>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Real-time management of active dining and deliveries.</p>
        </div>

        <div className="flex items-center gap-4 bg-muted/50 border border-border p-2 rounded-[2rem] backdrop-blur-xl">
           {[
             { id: 'ALL', label: 'All Feeds', icon: Filter },
             { id: 'PENDING', label: 'Incoming', icon: ShoppingBag, count: activeCount },
             { id: 'PROCESSING', label: 'Kitchen', icon: ChefHat, count: cookingCount },
             { id: 'DELIVERED', label: 'Completed', icon: PackageCheck }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setFilter(tab.id)}
               className={`h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative ${
                 filter === tab.id ? 'bg-emerald-500 text-foreground shadow-xl shadow-emerald-500/10' : 'text-muted-foreground hover:text-foreground'
               }`}
             >
                <tab.icon size={14} /> {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`h-4 min-w-[1rem] flex items-center justify-center rounded-full text-[8px] px-1 ${filter === tab.id ? 'bg-background text-foreground' : 'bg-emerald-500 text-foreground'}`}>
                    {tab.count}
                  </span>
                )}
             </button>
           ))}
        </div>
      </div>

      {/* Global Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="relative group w-full md:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name or Phone..." 
              className="w-full h-10 bg-muted border border-border rounded-[1.5rem] pl-16 pr-8 text-sm font-black italic text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500/50 outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {['Today', 'Yesterday', 'Last 7 Days', 'All Time'].map((t: string) => (
              <Button 
                key={t} 
                onClick={() => setTimeFilter(t)}
                variant="outline" 
                className={`rounded-2xl h-8 px-4 border-border transition-all text-[10px] uppercase font-black tracking-widest ${
                  timeFilter === t 
                  ? 'bg-emerald-500 text-foreground border-emerald-500 shadow-lg shadow-emerald-500/10' 
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:border-emerald-500/20'
                }`}
              >
                {t}
              </Button>
            ))}
            <ManualOrderDialog 
              vendorId={vendorId} 
              onSuccess={(updatedOrder) => {
                if (updatedOrder) {
                  setOrders(prev => {
                    const exists = prev.some(o => o.id === updatedOrder.id);
                    if (exists) {
                      return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
                    }
                    return [updatedOrder, ...prev];
                  });
                }
              }}
            />
         </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className="py-24 text-center space-y-6">
             <div className="h-24 w-24 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto text-muted-foreground border-2 border-dashed border-border/50">
                <ShoppingBag size={48} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">No matches found in this stream</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="group relative bg-card border border-border rounded-[2.5rem] p-6 lg:p-8 transition-all hover:border-emerald-500/20 shadow-lg overflow-hidden">
               {/* Background Hint */}
               <div className="absolute top-0 right-0 p-8 text-foreground opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
                  <Hash size={200} />
               </div>

               <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                  {/* Left: General Info */}
                  <div className="flex items-start gap-6">
                     <div className={`h-24 w-24 rounded-[2rem] border-2 flex flex-col items-center justify-center shrink-0 transition-transform duration-500 ${getStatusStyle(order.status)}`}>
                        <Clock size={24} />
                        <span className="text-[10px] font-black italic uppercase mt-2">{formatTimeAgo(order.orderDate)}</span>
                     </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">#{order.orderNumber}</h3>
                           <Badge className={`rounded-lg uppercase font-black text-[8px] tracking-widest border-none px-2 h-6 ${getStatusStyle(order.status)}`}>
                              {order.status}
                           </Badge>
                           {order._justUpdated && (
                             <Badge className="bg-blue-600 text-white rounded-lg uppercase font-black text-[8px] tracking-widest border-none px-2 h-6 animate-pulse">
                               Bill Updated
                             </Badge>
                           )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                              <User size={14} className="text-emerald-500" /> {order.customerName || 'Anonymous Guest'}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                              <Phone size={14} className="text-emerald-500" /> {order.customerPhone}
                           </div>
                           {order.table && (
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                                <Navigation size={14} className="text-emerald-500" /> Dining Area — T {order.table.tableNumber}
                             </div>
                           )}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                           {order.items.slice(0, 4).map((item: any, i: number) => (
                             <Badge key={i} variant="outline" className="bg-muted border-border text-muted-foreground text-[9px] font-bold py-1 px-3 rounded-full">
                                {item.quantity}x {item.menuItem?.name || 'Item'}
                             </Badge>
                           ))}
                           {order.items.length > 4 && (
                             <span className="text-[9px] font-black text-muted-foreground/60 ml-2">+{order.items.length - 4} More</span>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Right: Actions & Total */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 xl:gap-12">
                     <div className="text-center sm:text-right">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic block mb-1">Settlement</span>
                        <h4 className="text-3xl font-black italic text-foreground tracking-tighter leading-none">₹{order.finalAmount.toFixed(2)}</h4>
                        {order.payment && (
                          <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
                             <CreditCard size={12} className={order.payment.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'} />
                             <span className={`text-[9px] font-black uppercase tracking-widest ${order.payment.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {order.payment.method} • {order.payment.status}
                             </span>
                          </div>
                        )}
                     </div>

                     <div className="flex items-center gap-3">
                        {order.status === 'PENDING' && (
                          <Button 
                            onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                            className="h-16 w-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-foreground shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                            title="Accept Order"
                          >
                             <CheckCircle2 size={24} />
                          </Button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <Button 
                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                            className="h-16 w-16 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
                            title="Mark as Ready"
                          >
                             <PackageCheck size={24} />
                          </Button>
                        )}
                        <Link href={`/vendor/orders/${order.id}`}>
                           <Button variant="outline" className="h-16 w-16 rounded-2xl border-border bg-card text-foreground hover:bg-muted active:scale-95 transition-all shadow-xl">
                              <ArrowUpRight size={24} />
                           </Button>
                        </Link>
                        
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-16 w-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                 <MoreVertical size={20} />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="bg-card border-border text-foreground w-64 p-3 rounded-[1.5rem] shadow-2xl backdrop-blur-3xl">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground/60 italic px-3 py-2">Quick Commands</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                                className="rounded-xl font-black italic uppercase text-[10px] tracking-widest py-3 focus:bg-emerald-500 focus:text-foreground cursor-pointer"
                              >
                                 <ChefHat className="mr-3 h-4 w-4" /> Move to Kitchen
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                className="rounded-xl font-black italic uppercase text-[10px] tracking-widest py-3 focus:bg-blue-500 cursor-pointer"
                              >
                                 <MoveRight className="mr-3 h-4 w-4" /> Ship / Deliver Order
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border my-1" />
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                className="rounded-xl font-black italic uppercase text-[10px] tracking-widest py-3 focus:bg-red-500 focus:text-white text-red-500 cursor-pointer"
                              >
                                 <X className="mr-3 h-4 w-4" /> Terminate Order
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
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

function formatTimeAgo(date: Date) {
  const diff = new Date().getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}
