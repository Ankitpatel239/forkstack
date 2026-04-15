
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote,
  ChevronLeft,
  Package,
  Barcode,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { checkoutItems } from '@/app/actions/inventory';
import { toast } from 'sonner';
import Link from 'next/link';

interface Batch {
  id: string;
  quantity: number;
  costPrice: number;
}

interface Item {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  quantity: number;
  unit: string;
  price: number;
  costPrice: number | null;
  batches: Batch[];
}

interface CartItem extends Item {
  cartQuantity: number;
}

export default function SellClientPage({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyTime.current > 100) barcodeBuffer.current = '';
      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length > 2) {
          handleBarcodeScanned(barcodeBuffer.current);
          barcodeBuffer.current = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
      }
      lastKeyTime.current = now;
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, cart]);

  const handleBarcodeScanned = (code: string) => {
    const item = items.find(i => i.barcode === code || i.sku === code);
    if (item) {
      addToCart(item);
      toast.success(`Scan: ${item.name}`);
    }
  };

  const addToCart = (item: Item) => {
    if (item.quantity <= 0) {
      toast.error("Out of stock!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.cartQuantity >= item.quantity) return prev;
        return prev.map(i => i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i);
      }
      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.cartQuantity + delta);
        if (newQty > i.quantity) return i;
        return { ...i, cartQuantity: newQty };
      }
      return i;
    }).filter(i => i.cartQuantity > 0));
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.cartQuantity), 0);
  const totalItems = cart.reduce((acc, i) => acc + i.cartQuantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      await checkoutItems(cart.map(i => ({ id: i.id, quantity: i.cartQuantity })));
      toast.success("Checkout success");
      window.location.reload(); 
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.barcode?.includes(search) || 
    i.sku?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 16);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 animate-in fade-in duration-500 max-w-[1700px] mx-auto pb-4">
      {/* Selection Column */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <Link href="/vendor/inventory" className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.2em]">
              <ChevronLeft size={14} /> Back to Catalog
           </Link>
           <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
              <Scan size={12} /> Scanner Active
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search catalog or scan barcode..."
            className="w-full bg-zinc-950/50 border border-zinc-900 h-12 pl-12 pr-4 rounded-xl text-xs font-bold text-white focus:border-emerald-500/30 outline-none transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-2xl text-left hover:border-emerald-500/30 hover:bg-zinc-900 transition-all group active:scale-[0.97]"
                >
                   <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-zinc-700 tracking-tighter">Lot: {item.sku}</span>
                        <span className={`text-[8px] font-black ${item.quantity <= 5 ? 'text-red-500' : 'text-zinc-600'}`}>{item.quantity} In</span>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-300 truncate tracking-tight">{item.name}</h3>
                      <div className="flex items-baseline justify-between">
                         <p className="text-sm font-black text-emerald-500 tracking-tighter">₹{item.price}</p>
                         <div className="h-5 w-5 rounded-md bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={12} className="text-emerald-500" />
                         </div>
                      </div>
                   </div>
                </button>
              ))}
           </div>
           {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20 gap-3">
                 <Barcode size={40} className="text-zinc-800" />
                 <p className="text-[10px] uppercase font-black tracking-widest text-zinc-800">No Item Found</p>
              </div>
           )}
        </div>
      </div>

      {/* Basket Column */}
      <div className="w-[380px] bg-black border border-zinc-900 rounded-[1.5rem] flex flex-col overflow-hidden shadow-2xl">
         <div className="p-5 border-b border-zinc-900 bg-zinc-950/50">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-black italic tracking-tighter flex items-center gap-2">
                  <ShoppingCart size={16} className="text-emerald-500" /> POS Basket
               </h2>
               <Badge className="bg-emerald-500 text-zinc-950 font-black px-2 py-0.5 rounded text-[10px]">
                  {totalItems}
               </Badge>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-zinc-950/20">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center gap-2 opacity-10">
                  <Package size={32} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Basket Empty</p>
               </div>
            ) : (
               cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900/50 group animate-in slide-in-from-right-2 duration-300">
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-[11px] text-zinc-200 truncate tracking-tight">{item.name}</p>
                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">₹{item.price}/{item.unit}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="w-6 h-6 rounded-md border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-all"><Minus size={10} /></button>
                        <span className="w-4 text-center text-[11px] font-black italic">{item.cartQuantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-md border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-all"><Plus size={10} /></button>
                     </div>
                     <div className="text-right min-w-[50px]">
                        <p className="font-black text-[11px] text-zinc-100 italic">₹{item.price * item.cartQuantity}</p>
                     </div>
                  </div>
               ))
            )}
         </div>

         <div className="p-6 bg-black border-t border-zinc-900 space-y-4 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
            <div className="space-y-2 px-1">
               <div className="flex items-center justify-between text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                  <span>Net Total</span>
                  <span>₹{total}</span>
               </div>
               <div className="pt-2 border-t border-zinc-900 border-dashed flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Grand Total</span>
                  <span className="text-2xl font-black italic text-emerald-500 tracking-tighter">₹{total}</span>
               </div>
            </div>

            <div className="space-y-2">
               <Button 
                 onClick={handleCheckout}
                 disabled={isProcessing || cart.length === 0}
                 className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/10 active:scale-[0.98] transition-all"
               >
                  {isProcessing ? "..." : "Confirm Checkout"}
               </Button>
               <div className="grid grid-cols-2 gap-2">
                  <Button variant="ghost" onClick={() => setCart([])} className="h-9 text-zinc-600 hover:text-red-500 text-[8px] font-black uppercase tracking-widest"><Trash2 className="mr-2 w-3 h-3" /> Reset Basket</Button>
                  <Button variant="ghost" className="h-9 text-zinc-700 text-[8px] font-black uppercase tracking-widest"><Banknote className="mr-2 w-3 h-3" /> Cash</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
