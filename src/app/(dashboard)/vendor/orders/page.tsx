import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  ShoppingBag, 
  Clock, 
  User, 
  ArrowRight, 
  MoreVertical, 
  CheckCircle2, 
  Clock3, 
  MoveRight,
  Filter,
  Search,
  ExternalLink,
  Table as TableIcon,
  X
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

export default async function OrdersPage() {
  const vendor = await requireVendor();
  
  const orders = await prisma.order.findMany({
    where: { vendorId: vendor.id },
    include: {
      items: { include: { menuItem: true } },
      table: true,
      payment: true
    },
    orderBy: { orderDate: 'desc' },
    take: 50
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'PROCESSING': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-display">Order Operations</h1>
          <p className="text-zinc-500 font-medium">Real-time status of your active sessions and parcel deliveries.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl">
           <Button variant="ghost" className="rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-800 text-white px-6">Live Feed</Button>
           <Button variant="ghost" className="rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 px-6">History</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 font-bold h-12">
             <Filter className="w-4 h-4 mr-2" /> All Channels
           </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-20 text-center shadow-2xl">
             <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-700">
                  <ShoppingBag size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-300 tracking-tight">No Active Orders</h3>
                  <p className="text-zinc-500 text-sm max-w-[300px] mx-auto">Orders from your QR Tables and WhatsApp will appear here automatically.</p>
                </div>
                <Button className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 text-xs font-black uppercase tracking-widest px-8">Refresh Feed</Button>
             </div>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-all shadow-xl overflow-hidden group">
               <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                     <div className="flex items-start gap-5">
                        <div className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center border ${getStatusColor(order.status)} shrink-0`}>
                           <span className="text-[10px] font-black leading-none mb-1">{(new Date().getTime() - new Date(order.orderDate).getTime()) > 3600000 ? 'PAST' : 'NEW'}</span>
                           <ShoppingBag size={20} />
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <h4 className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors uppercase">
                                #{order.orderNumber}
                              </h4>
                              <Badge className={`text-[10px] font-black uppercase tracking-widest border-none px-2.5 h-6 ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                           </div>
                           <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                              <span className="flex items-center gap-1.5 uppercase font-bold tracking-tighter"><Clock size={12} className="text-emerald-500" /> {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {order.payment && (
                                  <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0 border-none ${order.payment.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-500/5' : 'text-orange-500 bg-orange-500/5'}`}>
                                    {order.payment.method} • {order.payment.status}
                                  </Badge>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
 
                    <div className="flex items-center gap-12 overflow-x-auto no-scrollbar py-1">
                       <div className="flex -space-x-3 shrink-0">
                          {order.items.slice(0, 3).map((oi, idx) => (
                             <div key={idx} className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center overflow-hidden shadow-lg" title={oi.menuItem?.name}>
                                {oi.menuItem?.imageUrl ? (
                                  <img src={oi.menuItem.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-bold text-zinc-500">{(oi.menuItem?.name || 'I').charAt(0)}</span>
                                )}
                             </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400 shadow-xl">+ {order.items.length - 3}</div>
                          )}
                       </div>
 
                       <div className="text-right shrink-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Grand Total</p>
                          <p className="text-xl font-black text-white leading-none">₹{order.finalAmount.toFixed(2)}</p>
                       </div>

                        <div className="flex items-center gap-2 shrink-0">
                           <Link href={`/vendor/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="rounded-xl border-zinc-800 h-10 px-4 text-xs font-bold bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400">
                                Details
                              </Button>
                           </Link>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-zinc-800 transition-all text-zinc-500">
                                    <MoreVertical size={18} />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-52 p-2">
                                 <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5">Actionable</DropdownMenuLabel>
                                 <DropdownMenuItem className="focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Preparing
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                    <MoveRight className="w-4 h-4 mr-2" /> Dispatch Parcel
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                                 <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-xs font-bold py-2 px-2 rounded-lg">
                                    <X className="w-4 h-4 mr-2" /> Cancel Order
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </div>
                  </div>
            
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Minimal Card shim since ui/card might not be fully transparent here
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`}>
      {children}
    </div>
  );
}
