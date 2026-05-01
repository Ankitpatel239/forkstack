
'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Calendar,
  Zap,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { placeOrder, getExistingPendingOrder, addOrderItems } from '@/app/actions/orders';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import Link from 'next/link';

export function MenuClient({ vendor, tableId }: { vendor: any, tableId?: string }) {
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [clientToken, setClientToken] = useState<string>('');

  useEffect(() => {
    let token = localStorage.getItem('orderClientToken');
    if (!token) {
      token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('orderClientToken', token);
    }
    setClientToken(token);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(vendor.menuItems.map((item: any) => item.category?.name || 'Uncategorized')));
    const base = [];
    if (vendor.offers?.length > 0) base.push('Flash Promos');
    if (vendor.combos?.length > 0) base.push('Combo Deals');
    return [...base, 'All', ...cats];
  }, [vendor]);

  const [activeCategory, setActiveCategory] = useState(
    vendor.offers?.length > 0 ? 'Flash Promos' : (vendor.combos?.length > 0 ? 'Combo Deals' : 'All')
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Flash Promos') return vendor.offers || [];
    if (activeCategory === 'Combo Deals') return vendor.combos || [];
    if (activeCategory === 'All') return vendor.menuItems;
    return vendor.menuItems.filter((item: any) => (item.category?.name || 'Uncategorized') === activeCategory);
  }, [vendor, activeCategory]);

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

  const cartTotal = cart.reduce((acc, curr) => acc + ((curr.item.totalPrice || curr.item.price || 0) * curr.quantity), 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!customerInfo.phone) {
      toast.error('Please provide a phone number for the order');
      return;
    }

    if (cart.length === 0) return;

    setIsOrdering(true);
    try {
      const existing = await getExistingPendingOrder(vendor.id, customerInfo.phone, tableId);
      if (existing) {
        setExistingOrder(existing);
        setIsConfirmOpen(true);
        setIsOrdering(false);
        return;
      }
      
      await executeOrder(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to check existing orders');
      setIsOrdering(false);
    }
  };

  const executeOrder = async (isNew: boolean) => {
    setIsOrdering(true);
    try {
      const orderItems = cart.map(i => {
        const isCombo = !!i.item.totalPrice && !!i.item.items;
        return {
          menuItemId: isCombo ? undefined : i.item.id,
          comboId: isCombo ? i.item.id : undefined,
          quantity: i.quantity,
          unitPrice: isCombo ? i.item.totalPrice : i.item.price
        };
      });

      if (!isNew && existingOrder) {
        await addOrderItems(existingOrder.id, orderItems);
        toast.success('Items added to your existing order!');
      } else {
        await placeOrder({
          vendorId: vendor.id,
          tableId: tableId,
          customerPhone: customerInfo.phone,
          customerName: customerInfo.name,
          items: orderItems,
          totalAmount: cartTotal,
          paymentMethod: 'COD',
          clientToken: clientToken
        });
        toast.success('Order placed successfully!');
      }

      setCart([]);
      setIsCartOpen(false);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process order. Please try again.');
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
             <Link href={`/${vendor.tenantSlug}/tiffin`}>
               <Button className="h-14 px-8 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 flex items-center gap-2 group">
                 <ChefHat size={18} className="group-hover:scale-110 transition-transform" />
                 Monthly Tiffin
               </Button>
             </Link>
             <Link href={`/${vendor.tenantSlug}/reserve`}>
               <Button className="h-14 px-8 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 flex items-center gap-2 group">
                 <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                 Reserve Table
               </Button>
             </Link>
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
                const isPromo = activeCategory === 'Flash Promos';
                const isCombo = activeCategory === 'Combo Deals';
                const cartItem = cart.find(i => i.item.id === item.id);
                const price = isCombo ? item.totalPrice : (item.price || 0);

                if (isPromo) {
                   return (
                      <div key={item.id} className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6 flex gap-6 relative overflow-hidden group">
                         <div className="absolute -top-6 -right-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                            <Gift size={120} />
                         </div>
                         <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <Gift size={32} />
                         </div>
                         <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-black italic text-white uppercase tracking-tighter">{item.title}</h4>
                            <p className="text-xs text-zinc-500 font-bold leading-relaxed line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 pt-1">
                               <Badge className="bg-amber-500 text-black text-[9px] font-black uppercase">
                                  {item.type === 'BOGO' ? 'Buy 1 Get 1' : (item.type === 'PERCENTAGE' ? `${item.value}% OFF` : `₹${item.value} OFF`)}
                               </Badge>
                               <span className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest italic">Applied at Checkout</span>
                            </div>
                         </div>
                      </div>
                   );
                }

                return (
                  <div key={item.id} className={`flex gap-4 group p-4 rounded-[2rem] transition-all ${isCombo ? 'bg-emerald-500/5 border border-emerald-500/10' : ''}`}>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                           <h4 className={`text-lg font-bold uppercase italic tracking-tight ${isCombo ? 'text-emerald-500' : 'text-zinc-100'}`}>{item.name}</h4>
                           {isCombo && <Zap size={14} className="text-emerald-500 animate-pulse" />}
                        </div>
                        <p className="text-zinc-500 text-xs font-medium leading-relaxed italic line-clamp-2">
                           {isCombo 
                             ? item.items?.map((it: any) => `${it.quantity}x ${it.menuItem?.name}`).join(' + ')
                             : item.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                           <div className="flex flex-col">
                              <span className={`text-base font-black italic ${isCombo ? 'text-emerald-500' : 'text-emerald-500'}`}>₹{price.toLocaleString()}</span>
                              {isCombo && <span className="text-[10px] text-zinc-600 line-through font-bold">₹{(item.totalPrice + (item.discount || 0)).toLocaleString()}</span>}
                           </div>
                           
                           {cartItem ? (
                             <div className={`flex items-center gap-3 border rounded-xl px-2 h-9 ${isCombo ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-zinc-900 border-zinc-800'}`}>
                               <button onClick={() => removeFromCart(item.id)} className={`${isCombo ? 'text-emerald-900' : 'text-zinc-400 hover:text-emerald-500'} transition-colors`}>
                                 <Minus size={14} />
                               </button>
                               <span className="text-xs font-black w-4 text-center">{cartItem.quantity}</span>
                               <button onClick={() => addToCart(item)} className={`${isCombo ? 'text-emerald-900' : 'text-zinc-400 hover:text-emerald-500'} transition-colors`}>
                                 <Plus size={14} />
                               </button>
                             </div>
                           ) : (
                             <button 
                               onClick={() => addToCart(item)}
                               className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all shadow-lg ${
                                 isCombo 
                                 ? 'bg-emerald-500 border-emerald-400 text-zinc-950 hover:bg-emerald-400' 
                                 : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-500'
                               }`}
                             >
                                <Plus size={16} />
                             </button>
                           )}
                        </div>
                    </div>
                    {(item.imageUrl || isCombo) && (
                      <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 border ${isCombo ? 'border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-500' : 'border-zinc-900'}`}>
                         {item.imageUrl ? (
                           <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                         ) : (
                           isCombo ? <Zap size={40} /> : null
                         )}
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
                               <p className="text-emerald-500 text-xs font-black">₹{(i.item.totalPrice || i.item.price || 0).toLocaleString()} × {i.quantity}</p>
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

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Existing Order Found</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 font-medium">
              You already have a pending order (<span className="text-emerald-500 font-bold">{existingOrder?.orderNumber}</span>) at this table. 
              Would you like to add these items to your current order or start a completely new one?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => executeOrder(false)}
              className="rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold px-8"
            >
              Add to Bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
