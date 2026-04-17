
import { prisma } from '@/lib/db';
import { ChefHat, ShoppingBag, Clock, Star, MapPin, Search, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockOverlay } from '@/components/public/LockOverlay';

export default async function VendorPublicMenu({ params }: { params: { vendorSlug: string } }) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: params.vendorSlug },
    include: { 
      menuItems: {
        where: { isAvailable: true },
        include: { category: true }
      }
    }
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
         <h1 className="text-zinc-700 font-black uppercase tracking-[0.5em]">Node Not Found</h1>
      </div>
    );
  }

  // Pre-calculate categories based on real menu items
  const categories = Array.from(new Set(vendor.menuItems.map((item: any) => item.category?.name || 'Uncategorized')));
  const rating = 4.9; // Mock rating for now as it's not in schema

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 relative selection:bg-emerald-500/30">
      {vendor.isLocked && (
        <LockOverlay 
          vendorName={vendor.businessName} 
          correctPassword={vendor.lockPassword || undefined} 
        />
      )}

      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header / Hero */}
      <header className="relative h-64 md:h-80 overflow-hidden">
        {vendor.logoUrl ? (
          <img 
            src={vendor.logoUrl} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
            alt="Banner Placeholder" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-10 max-w-5xl mx-auto flex items-end justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2">
               <Badge className="bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-[10px]">Open Now</Badge>
               <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                 <Star size={14} fill="currentColor" /> {rating} (New Node)
               </span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">{vendor.businessName}</h1>
             <p className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
               <MapPin size={14} className="text-emerald-500" /> {vendor.address}
             </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2 text-right">
             <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-xl">
               <ChefHat size={24} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Chef Selection</span>
          </div>
        </div>
      </header>

      {/* Interaction Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
           {/* Category Scroller */}
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 flex-1 outline-none">
              {categories.map((cat: any, i: number) => (
                <button 
                  key={i} 
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${i === 0 ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
           <button className="h-10 w-10 shrink-0 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
             <Search size={20} />
           </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Popular Items Row (Mock for now but using real items) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Popular Today</h2>
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                Scroll <ChevronRight size={14} />
              </div>
           </div>
           <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1">
              {vendor.menuItems.slice(0, 3).map((item: any, i: number) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[340px] group cursor-pointer">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 ring-1 ring-zinc-800 group-hover:ring-emerald-500/50 transition-all duration-500">
                    <img 
                      src={item.imageUrl || `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={item.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    <div className="absolute top-4 right-4">
                       <Badge className="bg-zinc-950/60 backdrop-blur-md border-white/10 text-white font-bold tracking-tight">₹{item.price.toLocaleString()}</Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors italic uppercase">{item.name}</h3>
                  <p className="text-zinc-500 text-xs font-medium line-clamp-2 mt-1">{item.description}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Regular Menu Grid */}
        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Full Menu</h2>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">{vendor.menuItems.length} Handpicked Creations</span>
           </div>

           <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              {vendor.menuItems.map((item: any) => (
                <div key={item.id} className="flex gap-4 group cursor-pointer">
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                         <h4 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{item.name}</h4>
                         <Badge variant="outline" className="text-[9px] h-4 border-zinc-800 text-zinc-500 font-black uppercase tracking-tighter px-1">{item?.categoryId}</Badge>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium leading-relaxed italic line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-2">
                         <span className="text-base font-black text-emerald-500 italic">₹{item.price.toLocaleString()}</span>
                         <button className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-500 transition-all shadow-lg scale-90 group-hover:scale-100">
                            <Plus size={16} />
                         </button>
                      </div>
                   </div>
                   {item.imageUrl && (
                     <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 border border-zinc-900">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Floating Action / Cart */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
         <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center justify-between px-6 transition-all active:scale-95 group">
            <div className="flex items-center gap-4">
               <div className="bg-zinc-950/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingBag size={20} />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950/60 leading-none mb-1">Your Basket</p>
                  <p className="text-sm font-black italic tracking-tight">Ordering Node Active</p>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-lg font-black tracking-tight leading-none italic">View Order</span>
               <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-950/60">Secure Checkout</span>
            </div>
         </Button>
      </footer>

      {/* Footer Info */}
      <div className="mt-20 py-12 border-t border-zinc-900 bg-zinc-950/50">
         <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-6">
            <div className="h-12 w-12 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
               <ChefHat size={24} />
            </div>
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
               Infrastructure by <span className="text-emerald-500/50 pointer-events-none">ForkStack Core</span>
            </p>
         </div>
      </div>
    </div>
  );
}
