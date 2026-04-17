import { prisma } from '@/lib/db';
import { 
  Store, 
  User, 
  Mail, 
  MapPin, 
  BadgeCheck, 
  ShieldAlert, 
  MoreVertical, 
  Search, 
  ArrowUpRight,
  Filter,
  Plus
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

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendorProfile.findMany({
    include: {
      owner: true,
      _count: {
        select: { menuItems: true, orders: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Partner Ecosystem</h1>
          <p className="text-zinc-500 font-medium font-sans">Strategic oversight of all active business accounts on the ForkStack platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20">
             <Plus className="w-5 h-5 mr-1" /> Provision New Account
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 w-full md:w-96 text-zinc-500 focus-within:border-emerald-500/50 transition-colors">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by Brand, Owner or Slug..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-white" 
          />
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 font-bold h-12">
             <Filter className="w-4 h-4 mr-2" /> Tier Filter
           </Button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950/50 text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 border-b border-zinc-900">
            <tr>
              <th className="px-6 py-6">Vendor Presence</th>
              <th className="px-6 py-6">Subscription</th>
              <th className="px-6 py-6">Vitality</th>
              <th className="px-6 py-6">Lifecycle</th>
              <th className="px-6 py-6 text-right font-sans lowercase italic">Admin control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {vendors.length === 0 ? (
               <tr>
                 <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-700">
                       <Store size={48} className="opacity-10" />
                       <p className="font-black uppercase tracking-widest text-xs">Platform is fresh • No vendors yet</p>
                    </div>
                 </td>
               </tr>
            ) : (
                vendors.map((vendor: any) => (
                    <tr key={vendor.id} className="hover:bg-zinc-800/10 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-zinc-700 transition-colors overflow-hidden">
                             {vendor.logoUrl ? (
                               <img src={vendor.logoUrl} className="w-full h-full object-cover" />
                             ) : (
                               <Store size={24} className="text-zinc-500" />
                             )}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                               <p className="text-base font-black text-white tracking-tight">{vendor.businessName}</p>
                               <ArrowUpRight size={14} className="text-emerald-500/40" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                <User size={10} /> {vendor.owner?.name || 'Unassigned'} • /{vendor.tenantSlug}
                             </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="space-y-1.5">
                            <Badge className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] border-none italic ${
                                vendor.subscriptionPlan === 'ENTERPRISE' ? 'bg-purple-500/10 text-purple-500' :
                                vendor.subscriptionPlan === 'PRO' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {vendor.subscriptionPlan} Tier
                            </Badge>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Renews: {new Date(vendor.subscriptionEnd).toLocaleDateString()}</p>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-6">
                            <div className="text-center">
                               <p className="text-base font-black text-zinc-300 leading-none">{vendor._count.menuItems}</p>
                               <p className="text-[8px] font-black uppercase tracking-tighter text-zinc-600 mt-1">Items</p>
                            </div>
                            <div className="h-6 w-[1px] bg-zinc-800" />
                            <div className="text-center">
                               <p className="text-base font-black text-zinc-300 leading-none">{vendor._count.orders}</p>
                               <p className="text-[8px] font-black uppercase tracking-tighter text-zinc-600 mt-1">Orders</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-2">
                            <div className={`h-2 h-2 rounded-full ${vendor.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[11px] font-black uppercase tracking-tighter ${vendor.subscriptionStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                               {vendor.subscriptionStatus}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-800 rounded-xl text-zinc-500 transition-all opacity-0 group-hover:opacity-100">
                                  <MoreVertical size={18} />
                               </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-56 p-2">
                               <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-600 px-2 py-1.5 leading-none">Management Flow</DropdownMenuLabel>
                               <DropdownMenuSeparator className="bg-zinc-800" />
                               <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                                  <BadgeCheck className="w-4 h-4 mr-2 text-emerald-500" /> Impersonate Vendor
                                </DropdownMenuItem>
                               <DropdownMenuItem className="focus:bg-zinc-800 px-2 py-2 rounded-lg cursor-pointer text-xs font-bold">
                                  <Mail className="w-4 h-4 mr-2" /> Signal Owner
                                </DropdownMenuItem>
                               <DropdownMenuSeparator className="bg-zinc-800" />
                               <DropdownMenuItem className="focus:bg-red-500/10 px-2 py-2 rounded-lg cursor-pointer text-red-500 text-xs font-bold font-sans">
                                  <ShieldAlert className="w-4 h-4 mr-2" /> Revoke All Access
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
