'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  ChevronRight, 
  Clock, 
  Info,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { placeOrder, updateTableStatus } from '@/app/actions/orders';

export function OrderClient({ vendor, table, categories }: { 
  vendor: any, 
  table: any, 
  categories: any[] 
}) {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-book table on scan
  useEffect(() => {
    const bookTable = async () => {
      if (table.status === 'AVAILABLE') {
        try {
          await updateTableStatus(table.id, 'OCCUPIED');
        } catch (e) {}
      }
    };
    bookTable();
  }, [table.id, table.status]);

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const allItems = useMemo(() => {
    return categories.flatMap(c => c.items);
  }, [categories]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = allItems.find(i => i.id === itemId);
      return total + (item?.price || 0) * qty;
    }, 0);
  }, [cart, allItems]);

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    toast.success('Added to bag', { duration: 1000 });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) newCart[itemId] -= 1;
      else delete newCart[itemId];
      return newCart;
    });
  };

  const handleCheckout = async () => {
    if (!customerPhone) return toast.error('Please enter your WhatsApp number');
    if (customerPhone.length < 10) return toast.error('Invalid phone number');

    setIsSubmitting(true);
    try {
      const items = Object.entries(cart).map(([id, qty]) => {
        const item = allItems.find(i => i.id === id);
        return { menuItemId: id, quantity: qty, unitPrice: item!.price };
      });

      await placeOrder({
        vendorId: vendor.id,
        tableId: table.id,
        customerPhone,
        customerName,
        items,
        totalAmount: cartTotal,
        paymentMethod
      });

      setStep(3);
      setCart({});
    } catch (error) {
      toast.error('Failed to place order. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] border-4 border-emerald-400">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">Order Placed!</h1>
        <p className="text-zinc-500 font-bold text-sm max-w-xs mb-8">
          Your order is being prepared for <span className="text-emerald-500">{table.tableNumber}</span>.
          We'll notify you on WhatsApp shortly.
        </p>
        <button 
          type="button"
          onClick={() => { setStep(1); setIsCheckoutOpen(false); }}
          className="h-14 w-full max-w-xs rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-black uppercase tracking-widest text-[10px] active:scale-95 touch-manipulation"
        >
          View Menu Again
        </button>
      </div>
    );
  }

  const hasItems = cartItemsCount > 0;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 border-b border-zinc-900 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
               {vendor.logoUrl ? <img src={vendor.logoUrl} className="h-full w-full object-cover rounded-2xl" alt="" /> : <ShoppingBag size={24} className="pointer-events-none" />}
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">{vendor.businessName}</h2>
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 text-[7px] font-black uppercase px-2 py-0 bg-emerald-500/5">
                    Table {table.tableNumber}
                  </Badge>
                  {hasItems && (
                    <Badge className="bg-emerald-500 text-black text-[7px] font-black px-1.5 animate-pulse">
                       {cartItemsCount} IN BAG
                    </Badge>
                  )}
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> 15-20 Mins
                  </span>
               </div>
            </div>
          </div>
          <button 
            type="button" 
            className="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl relative z-10 active:scale-95 touch-manipulation"
          >
             <Info size={20} className="pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-6 py-8">
         <div className="relative h-44 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
               <ShoppingBag size={120} />
            </div>
            <div className="relative z-10 space-y-4">
               <Badge className="bg-zinc-950/20 text-white border-white/20 font-black text-[9px] uppercase">Flash Deal</Badge>
               <h3 className="text-3xl font-black italic uppercase text-zinc-950 tracking-tighter">Get 20% Off ON<br/>First Scan</h3>
               <p className="text-[9px] font-black text-zinc-950 uppercase tracking-[0.2em] opacity-60 italic">Valid only for dine-in today</p>
            </div>
         </div>
      </div>

      {/* Category Nav */}
      <div className="sticky top-[88px] z-30 bg-black/95 px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-zinc-900/50">
         {categories.map(cat => (
           <button
             key={cat.id}
             type="button"
             onClick={() => setActiveCategory(cat.id)}
             className={`px-6 h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0 cursor-pointer touch-manipulation ${
               activeCategory === cat.id 
               ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
               : 'bg-zinc-900 text-zinc-500 active:bg-zinc-800'
             }`}
           >
             {cat.name}
           </button>
         ))}
      </div>

      {/* Menu List */}
      <div className="px-6 space-y-12 py-8">
        {categories.map(cat => (
          <div key={cat.id} id={cat.id} className="space-y-6">
            <div className="flex items-center gap-3">
               <h4 className="text-sm font-black italic uppercase tracking-widest text-zinc-500">{cat.name}</h4>
               <div className="h-px flex-1 bg-zinc-900" />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               {(cat.items || []).map((item: any) => (
                <div key={item.id} className="bg-zinc-900/30 border border-zinc-900 rounded-[2rem] p-5 flex gap-5 group relative z-10">
                    <div className="h-24 w-24 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden relative">
                       {item.imageUrl ? (
                         <img src={item.imageUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       ) : (
                         <div className="h-full w-full flex items-center justify-center text-zinc-800">
                            <ShoppingBag size={24} />
                         </div>
                       )}
                       {item.isVegetarian && (
                         <div className="absolute top-2 right-2 h-4 w-4 rounded-sm border-[1.5px] border-green-600 flex items-center justify-center bg-white/10 backdrop-blur-sm p-0.5">
                            <div className="h-full w-full rounded-full bg-green-600" />
                         </div>
                       )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                       <div className="space-y-1">
                          <h5 className="font-black italic text-base text-white truncate uppercase">{item.name}</h5>
                          <p className="text-[10px] text-zinc-600 font-bold truncate line-clamp-1">{item.description || 'Crafted with premium ingredients'}</p>
                       </div>
                       
                       <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-white italic">₹{item.price}</span>
                          {cart[item.id] ? (
                            <div className="flex items-center gap-3 bg-emerald-500 rounded-xl p-1 shadow-lg shadow-emerald-500/10 relative z-[100]">
                               <button 
                                 type="button" 
                                 onClick={() => removeFromCart(item.id)} 
                                 className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-600 text-black active:scale-90 cursor-pointer touch-manipulation"
                               >
                                  <Minus size={18} className="pointer-events-none" />
                               </button>
                               <span className="text-xs font-black text-black min-w-[2ch] text-center">{cart[item.id]}</span>
                               <button 
                                 type="button" 
                                 onClick={() => addToCart(item.id)} 
                                 className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-300 text-black active:scale-90 cursor-pointer touch-manipulation"
                               >
                                  <Plus size={18} className="pointer-events-none" />
                               </button>
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => addToCart(item.id)}
                              className="h-11 px-5 bg-zinc-950 border border-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:bg-emerald-500 active:text-black transition-all shadow-xl cursor-pointer touch-manipulation relative z-[100]"
                            >
                               <Plus size={14} className="pointer-events-none" /> Add
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Cart Bottom Bar */}
      {hasItems && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 animate-in slide-in-from-bottom duration-500">
           <div className="max-w-md mx-auto h-20 bg-emerald-500 rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-between px-8 text-black group active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 flex items-center justify-center bg-black/10 rounded-xl relative">
                    <ShoppingBag size={20} />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black">{cartItemsCount}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Checkout Total</span>
                    <span className="text-lg font-black italic -mt-1">₹{cartTotal.toFixed(2)}</span>
                 </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCheckoutOpen(true)} 
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] relative z-10 active:scale-95 touch-manipulation"
              >
                 Review Cart <ChevronRight size={18} className="pointer-events-none" />
              </button>
           </div>
        </div>
      )}

      {/* Checkout Drawer Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl p-6 transition-all animate-in fade-in duration-300 overflow-y-auto">
           <div className="max-w-md mx-auto space-y-10">
              <div className="flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => setIsCheckoutOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 active:text-white active:scale-95 touch-manipulation"
                  >
                     <ChevronRight size={16} className="rotate-180 pointer-events-none" /> Back to Menu
                  </button>
                 <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 font-black italic">Checkout Step {step}/2</Badge>
              </div>

              {step === 1 ? (
                <div className="space-y-10 animate-in slide-in-from-right duration-300">
                   <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Review Order</h2>
                      <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-1">Review your items before confirming your details.</p>
                   </div>

                   <div className="space-y-4">
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = allItems.find(i => i.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-900">
                             <div className="flex items-center gap-4">
                                <span className="h-8 w-8 flex items-center justify-center bg-emerald-500 text-black rounded-lg font-black text-xs">{qty}x</span>
                                <span className="font-black italic text-sm text-white uppercase">{item?.name}</span>
                             </div>
                             <span className="font-black italic text-zinc-400">₹{(item?.price || 0) * qty}</span>
                          </div>
                        );
                      })}
                   </div>

                   <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 space-y-4 shadow-2xl">
                      <div className="flex justify-between text-xs font-bold text-zinc-500">
                         <span>Subtotal</span>
                         <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-zinc-500">
                         <span>GST (Included)</span>
                         <span>₹0.00</span>
                      </div>
                      <div className="h-px bg-zinc-800 my-2" />
                      <div className="flex justify-between text-xl font-black italic text-white">
                         <span>Total</span>
                         <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                   </div>

                   <button 
                     type="button"
                     onClick={() => setStep(2)}
                     className="h-16 w-full rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-500/10 touch-manipulation"
                   >
                     Continue to Details <ArrowRight size={18} className="pointer-events-none" />
                   </button>
                </div>
              ) : (
                <div className="space-y-10 animate-in slide-in-from-right duration-300">
                   <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Guest Details</h2>
                      <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-1">Required to notify you about your order.</p>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">WhatsApp Number</Label>
                         <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                            <Input 
                              value={customerPhone}
                              onChange={e => setCustomerPhone(e.target.value)}
                              placeholder="98765 43210" 
                              className="bg-zinc-950 border-zinc-800 h-16 pl-16 text-lg font-black italic rounded-[1.5rem] text-white focus:border-emerald-500/50" 
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Your Name (Optional)</Label>
                         <Input 
                           value={customerName}
                           onChange={e => setCustomerName(e.target.value)}
                           placeholder="Guest Name" 
                           className="bg-zinc-950 border-zinc-800 h-16 px-8 font-black italic rounded-[1.5rem] text-white focus:border-emerald-500/50" 
                         />
                      </div>

                      <div className="space-y-4 pt-4">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 italic">Payment Choice</Label>
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                              type="button"
                              onClick={() => setPaymentMethod('COD')}
                              className={`h-16 rounded-[1.5rem] border p-4 flex items-center gap-3 transition-all active:scale-95 touch-manipulation ${
                                paymentMethod === 'COD' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-zinc-900 text-zinc-500'
                              }`}
                            >
                               <Banknote size={20} className="pointer-events-none" />
                               <span className="text-[10px] font-black uppercase tracking-widest leading-none pointer-events-none text-left">Cash on Delivery</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => setPaymentMethod('ONLINE')}
                              className={`h-16 rounded-[1.5rem] border p-4 flex items-center gap-3 transition-all active:scale-95 touch-manipulation ${
                                paymentMethod === 'ONLINE' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-zinc-900 text-zinc-500'
                              }`}
                            >
                               <CreditCard size={20} className="pointer-events-none" />
                               <span className="text-[10px] font-black uppercase tracking-widest leading-none pointer-events-none text-left">Online Payment</span>
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl p-6 flex items-start gap-4">
                      <ShieldCheck className="text-emerald-500 mt-1" size={20} />
                      <div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Encrypted Checkout</h5>
                         <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Your details are only used to track your meal at Table {table.tableNumber}.</p>
                      </div>
                   </div>

                   <button 
                     type="button"
                     disabled={isSubmitting}
                     onClick={handleCheckout}
                     className="h-20 w-full rounded-[2.5rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] shadow-emerald-500/20 disabled:opacity-50 touch-manipulation"
                   >
                     {isSubmitting ? "Placing Order..." : <>Finalize & Order <CheckCircle2 size={24} className="pointer-events-none" /></>}
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Global styles for mobile touch */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        button, 
        [role="button"], 
        .cursor-pointer,
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }
        
        button:active, 
        .cursor-pointer:active {
          transform: scale(0.98);
        }
        
        button, 
        button *,
        .cursor-pointer,
        .cursor-pointer * {
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>
    </div>
  );
}

function Label({ children, className }: { children: any, className?: string }) {
  return <p className={className}>{children}</p>
}