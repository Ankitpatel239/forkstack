
'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  Phone, 
  CreditCard, 
  Navigation,
  Search,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { placeOrder, addOrderItems } from '@/app/actions/orders';
import { getMenuItems } from '@/app/actions/menu';
import { getAvailableTables } from '@/app/actions/reservations';
import { toast } from 'sonner';

export function ManualOrderDialog({ 
  vendorId, 
  reservation, 
  onSuccess,
  trigger
}: { 
  vendorId: string, 
  reservation?: any, 
  onSuccess?: (order: any) => void,
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: reservation?.customerName || '',
    customerPhone: reservation?.customerPhone || '',
    tableId: reservation?.tableId || 'none',
    paymentMethod: 'CASH'
  });

  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const [orderMode, setOrderMode] = useState<'NEW' | 'APPEND'>(reservation?.order ? 'APPEND' : 'NEW');

  const existingOrder = reservation?.order;

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  async function fetchInitialData() {
    const [items, tableList] = await Promise.all([
      getMenuItems(),
      getAvailableTables(vendorId, new Date())
    ]);
    setMenuItems(items);
    setTables(tableList);
  }

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const totalAmount = cart.reduce((acc, i) => acc + (i.item.price * i.quantity), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    if (orderMode === 'NEW' && !formData.customerPhone) {
      toast.error('Customer phone is required');
      return;
    }

    setLoading(true);
    try {
      if (orderMode === 'APPEND' && existingOrder) {
        const order = await addOrderItems(existingOrder.id, cart.map(i => ({
          menuItemId: i.item.id,
          quantity: i.quantity,
          unitPrice: i.item.price
        })));
        toast.success('Items added to existing order');
        if (onSuccess) onSuccess(order);
      } else {
        const order = await placeOrder({
          vendorId,
          tableId: formData.tableId === 'none' ? undefined : formData.tableId,
          reservationId: reservation?.id,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          items: cart.map(i => ({
            menuItemId: i.item.id,
            quantity: i.quantity,
            unitPrice: i.item.price
          })),
          totalAmount,
          paymentMethod: formData.paymentMethod
        });
        toast.success('New manual order created');
        if (onSuccess) onSuccess(order);
      }

      setOpen(false);
      setCart([]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = menuItems.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest gap-1 shadow-xl shadow-emerald-500/10">
            <Plus size={20} /> Create Manual Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border-zinc-900 text-white p-0 overflow-hidden rounded-[3rem] sm:max-w-[1000px] shadow-2xl h-[90vh] flex flex-col">
        <DialogHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between bg-gradient-to-r from-zinc-900/50 to-transparent space-y-0">
          <div className="text-left">
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-emerald-500">Manual Entry</DialogTitle>
            <DialogDescription className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              {reservation ? `Linked to Reservation #${reservation.id.slice(-6)}` : 'Create a direct walk-in or phone order'}
            </DialogDescription>
          </div>
          {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full hover:bg-white/5">
            <X size={20} />
          </Button> */}
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Menu Selection */}
          <div className="flex-1 p-8 overflow-y-auto border-r border-white/5 custom-scrollbar">
            <div className="relative mb-8 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search dishes, drinks, appetizers..."
                className="bg-zinc-900/50 border-zinc-800 h-16 pl-16 rounded-2xl font-bold italic text-white placeholder:text-zinc-700 focus:border-emerald-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredMenu.map(item => (
                <div 
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="group bg-zinc-900/30 border border-zinc-800 p-4 rounded-[1.5rem] cursor-pointer hover:border-emerald-500/30 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                      {item.imageUrl && <img src={item.imageUrl} className="h-full w-full object-cover opacity-80" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black italic uppercase text-zinc-100 truncate">{item.name}</h4>
                      <p className="text-[10px] font-bold text-emerald-500 mt-1">₹{item.price}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Plus size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cart & Details */}
          <div className="w-full lg:w-[400px] bg-zinc-900/20 p-8 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="space-y-8 flex-1">
              {existingOrder && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Order Context</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-zinc-800">
                    <button 
                      onClick={() => setOrderMode('APPEND')}
                      className={`h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${orderMode === 'APPEND' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Add to #{existingOrder.orderNumber.slice(-4)}
                    </button>
                    <button 
                      onClick={() => setOrderMode('NEW')}
                      className={`h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${orderMode === 'NEW' ? 'bg-zinc-800 text-zinc-100 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      New Order
                    </button>
                  </div>
                  {orderMode === 'APPEND' && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase italic text-emerald-500">
                        <span>Current Bill</span>
                        <span>₹{existingOrder.totalAmount}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {orderMode === 'NEW' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Guest Details</h3>
                  </div>
                  <div className="grid gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                      <Input 
                        placeholder="Guest Name"
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                        className="bg-black/40 border-zinc-800 h-12 pl-12 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                      <Input 
                        placeholder="Phone Number *"
                        value={formData.customerPhone}
                        onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                        className="bg-black/40 border-zinc-800 h-12 pl-12 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Seating</h3>
                </div>
                <Select value={formData.tableId} onValueChange={v => setFormData({...formData, tableId: v})}>
                  <SelectTrigger className="bg-black/40 border-zinc-800 h-12 rounded-xl text-xs font-bold italic">
                    <SelectValue placeholder="Select Table" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold italic">
                    <SelectItem value="none">Walk-in (No Table)</SelectItem>
                    {tables.map(t => (
                      <SelectItem key={t.id} value={t.id}>Table {t.tableNumber} ({t.capacity}p)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Order Items ({cart.length})</h3>
                </div>
                <div className="space-y-3">
                  {cart.map(i => (
                    <div key={i.item.id} className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black uppercase italic text-zinc-200 truncate">{i.item.name}</p>
                        <p className="text-[10px] font-bold text-zinc-600">₹{i.item.price * i.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(i.item.id, -1)} className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700"><Minus size={12} /></button>
                        <span className="text-xs font-black italic">{i.quantity}</span>
                        <button onClick={() => updateQuantity(i.item.id, 1)} className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700"><Plus size={12} /></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                      <ShoppingBag className="mx-auto mb-2 text-zinc-800" size={24} />
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Empty Cart</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-6 mt-auto">
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Total Payable</span>
                <span className="text-2xl font-black italic text-emerald-500 tracking-tighter">₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setFormData({...formData, paymentMethod: 'CASH'})}
                  className={`h-12 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all ${formData.paymentMethod === 'CASH' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-black/20 border-zinc-800 text-zinc-600'}`}
                >
                  Cash
                </button>
                <button 
                  onClick={() => setFormData({...formData, paymentMethod: 'ONLINE'})}
                  className={`h-12 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all ${formData.paymentMethod === 'ONLINE' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : 'bg-black/20 border-zinc-800 text-zinc-600'}`}
                >
                  Online
                </button>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading || cart.length === 0}
                className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <CheckCircle2 size={18} /> Complete Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
