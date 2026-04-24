
'use client';

import { useState, useMemo } from 'react';
import { 
  ChefHat, 
  ShoppingBag, 
  Clock, 
  Star, 
  MapPin, 
  Search, 
  ChevronRight, 
  Plus, 
  Minus,
  X,
  CheckCircle2,
  Loader2,
  Trash2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { placeOrder } from '@/app/actions/orders';
import { toast } from 'sonner';
import Link from 'next/link';

export function MenuClient({ vendor, tableId }: { vendor: any, tableId?: string }) {
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(vendor.menuItems.map((item: any) => item.category?.name || 'Uncategorized')));
    return ['All', ...cats];
  }, [vendor.menuItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return vendor.menuItems;
    return vendor.menuItems.filter((item: any) => (item.category?.name || 'Uncategorized') === activeCategory);
  }, [vendor.menuItems, activeCategory]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} added to basket`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.item.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!customerInfo.phone) {
      toast.error('Please provide a phone number for the order');
      return;
    }

    if (cart.length === 0) return;

    setIsOrdering(true);
    try {
      await placeOrder({
        vendorId: vendor.id,
        tableId: tableId || null, // No fallback to invalid string
        customerPhone: customerInfo.phone,
        customerName: customerInfo.name,
        items: cart.map(i => ({
          menuItemId: i.item.id,
          quantity: i.quantity,
          unitPrice: i.item.price
        })),
        totalAmount: cartTotal,
        paymentMethod: 'COD' // Default for now
      });

      toast.success('Order placed successfully!');
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 relative selection:bg-emerald-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header / Hero */}
      <header className="relative h-64 md:h-80 overflow-hidden">
        {vendor.logoUrl ? (
          <img src={vendor.logoUrl} alt="Banner" className="w-full h-full object-cover opacity-40 scale-105" />
        ) : (
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" alt="Banner Placeholder" className="w-full h-full object-cover opacity-40 scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-10 max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <div className="flex items-center gap-2">
               <Badge className="bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-[10px]">Open Now</Badge>
               <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                 <Star size={14} fill="currentColor" /> 4.9 (New Node)
               </span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">{vendor.businessName}</h1>
             <p className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
               <MapPin size={14} className="text-emerald-500" /> {vendor.address}
             </p>
          </div>
          <div className="flex items-center gap-4">
             <Link href={`/${vendor.tenantSlug}/reserve`}>
               <Button className="h-14 px-8 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 flex items-center gap-2 group">
                 <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                 Reserve Table
               </Button>
             </Link>
          </div>
        </div>
      </header>

      {/* Interaction Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 flex-1 outline-none">
              {categories.map((cat: any) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-black tracking-tight text-white uppercase italic">{activeCategory} Menu</h2>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">{filteredItems.length} Handpicked Creations</span>
           </div>

           <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              {filteredItems.map((item: any) => {
                const cartItem = cart.find(i => i.item.id === item.id);
                return (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                           <h4 className="text-lg font-bold text-zinc-100 uppercase italic tracking-tight">{item.name}</h4>
                        </div>
                        <p className="text-zinc-500 text-xs font-medium leading-relaxed italic line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between pt-2">
                           <span className="text-base font-black text-emerald-500 italic">₹{item.price.toLocaleString()}</span>
                           
                           {cartItem ? (
                             <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-2 h-9">
                               <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-emerald-500 transition-colors">
                                 <Minus size={14} />
                               </button>
                               <span className="text-xs font-black w-4 text-center">{cartItem.quantity}</span>
                               <button onClick={() => addToCart(item)} className="text-zinc-400 hover:text-emerald-500 transition-colors">
                                 <Plus size={14} />
                               </button>
                             </div>
                           ) : (
                             <button 
                               onClick={() => addToCart(item)}
                               className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-500 transition-all shadow-lg"
                             >
                                <Plus size={16} />
                             </button>
                           )}
                        </div>
                    </div>
                    {item.imageUrl && (
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 border border-zinc-900">
                         <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      </div>
                    )}
                  </div>
                );
              })}
           </div>
        </section>
      </main>

      {/* Floating Cart Trigger */}
      {cart.length > 0 && (
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
           <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                 <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center justify-between px-6 transition-all active:scale-95 group">
                    <div className="flex items-center gap-4">
                       <div className="bg-zinc-950/20 p-2 rounded-xl group-hover:scale-110 transition-transform relative">
                          <ShoppingBag size={20} />
                          <span className="absolute -top-1 -right-1 bg-white text-zinc-950 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950/60 leading-none mb-1">Your Basket</p>
                          <p className="text-sm font-black italic tracking-tight">₹{cartTotal.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-lg font-black tracking-tight leading-none italic">View Order</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-950/60">Secure Checkout</span>
                    </div>
                 </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] bg-zinc-950 border-zinc-900 rounded-t-[3rem] p-0 text-white overflow-hidden">
                 <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-zinc-900">
                       <SheetHeader className="text-left">
                          <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">Your Order</SheetTitle>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{tableId ? `Table: ${tableId}` : 'Digital Order'}</p>
                       </SheetHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                       {cart.map((i) => (
                         <div key={i.item.id} className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                               <h4 className="font-bold text-white uppercase italic">{i.item.name}</h4>
                               <p className="text-emerald-500 text-xs font-black">₹{i.item.price.toLocaleString()} × {i.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-3 py-2">
                               <button onClick={() => removeFromCart(i.item.id)} className="text-zinc-500 hover:text-white"><Minus size={16} /></button>
                               <span className="font-black text-sm w-6 text-center">{i.quantity}</span>
                               <button onClick={() => addToCart(i.item)} className="text-zinc-500 hover:text-white"><Plus size={16} /></button>
                            </div>
                         </div>
                       ))}

                       <div className="pt-8 space-y-6 border-t border-zinc-900">
                          <div className="space-y-4">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Full Name</Label>
                                <Input 
                                  value={customerInfo.name}
                                  onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                                  placeholder="Your Name" 
                                  className="bg-zinc-900/50 border-zinc-800 h-12 rounded-xl font-bold italic" 
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Phone Number</Label>
                                <Input 
                                  required
                                  value={customerInfo.phone}
                                  onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                  placeholder="Contact Number" 
                                  className="bg-zinc-900/50 border-zinc-800 h-12 rounded-xl font-bold italic" 
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    <SheetFooter className="p-8 bg-zinc-900/50 backdrop-blur-xl border-t border-zinc-800">
                       <div className="w-full space-y-6">
                          <div className="flex items-center justify-between">
                             <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                             <span className="text-2xl font-black italic text-emerald-500">₹{cartTotal.toLocaleString()}</span>
                          </div>
                          <Button 
                            onClick={handlePlaceOrder}
                            disabled={isOrdering || !customerInfo.phone}
                            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10"
                          >
                             {isOrdering ? <Loader2 className="animate-spin" /> : (
                               <div className="flex items-center gap-2">
                                  <CheckCircle2 size={20} />
                                  Place Order
                               </div>
                             )}
                          </Button>
                       </div>
                    </SheetFooter>
                 </div>
              </SheetContent>
           </Sheet>
        </footer>
      )}
    </div>
  );
}
