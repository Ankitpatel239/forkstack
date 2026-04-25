
'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  MessageSquare, 
  Trash2, 
  Plus, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Phone,
  User,
  Hash,
  ChevronRight,
  Loader2,
  FileDown,
  Zap,
  ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  updateOrderStatus, 
  updatePaymentStatus, 
  addOrderItems, 
  deleteOrderItem,
  deleteOrderCombo,
  updateOrderDetails 
} from '@/app/actions/orders';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Edit2 } from 'lucide-react';

export function OrderDetailClient({ order, vendor, menuItems, availableCombos, tables }: { 
  order: any, 
  vendor: any,
  menuItems: any[],
  availableCombos: any[],
  tables: any[] 
}) {
  const router = useRouter();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCombo, setIsAddingCombo] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCombo, setSelectedCombo] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [comboQuantity, setComboQuantity] = useState(1);
  
  // Edit Details State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editData, setEditData] = useState({
    customerName: order.customerName || '',
    customerPhone: order.customerPhone || '',
    tableId: order.tableId || 'NONE',
    discount: order.discount || 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleDeleteCombo = async (comboId: string) => {
    if (!confirm('Are you sure you want to remove this combo bundle?')) return;
    try {
      await deleteOrderCombo(order.id, comboId);
      toast.success('Combo bundle removed from bill');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove combo');
    }
  };

  const handleUpdateDetails = async () => {
    setIsSubmitting(true);
    try {
      await updateOrderDetails(order.id, {
        customerName: editData.customerName,
        customerPhone: editData.customerPhone,
        tableId: editData.tableId === 'NONE' ? null : editData.tableId,
        discount: Number(editData.discount)
      });
      toast.success('Order details updated');
      setIsEditingDetails(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors: any = {
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    PROCESSING: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    SHIPPED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    DELIVERED: 'bg-emerald-500 text-black border-transparent',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatus(order.id, newStatus as any);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePaymentUpdate = async (newStatus: string) => {
    try {
      await updatePaymentStatus(order.id, newStatus as any);
      toast.success(`Payment marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const handleAddItem = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      const item = menuItems.find(i => i.id === selectedItem);
      await addOrderItems(order.id, [{
        menuItemId: item.id,
        quantity,
        unitPrice: item.price
      }]);
      toast.success('Item added to order');
      setIsAddingItem(false);
      setSelectedItem('');
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCombo = async () => {
    if (!selectedCombo) return;
    setIsSubmitting(true);
    try {
      const combo = availableCombos.find(c => c.id === selectedCombo);
      await addOrderItems(order.id, [{
        comboId: combo.id,
        quantity: comboQuantity,
        unitPrice: combo.totalPrice
      }]);
      toast.success('Combo added to order');
      setIsAddingCombo(false);
      setSelectedCombo('');
      setComboQuantity(1);
    } catch (error) {
      toast.error('Failed to add combo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remove this item from order?')) {
      try {
        await deleteOrderItem(order.id, itemId);
        toast.success('Item removed');
      } catch (error) {
        toast.error('Failed to remove item');
      }
    }
  };

  const handleNotifyWhatsApp = () => {
    const text = `Hi ${order.customerName || 'Customer'},\nYour order #${order.orderNumber} is now ${order.status}. \nTotal: ₹${order.finalAmount}\n\nThank you for choosing ${vendor.businessName}!`;
    const url = `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 print:p-0 transition-all">
           {/* FULL PRINT-ONLY INVOICE (Compact Thermal Style) */}
      <div className="hidden print:block font-mono text-black bg-white p-4 mx-auto border border-zinc-200" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="text-center space-y-1 mb-4 pb-4 border-b-2 border-dashed border-black">
          {vendor.logoUrl && (
            <div className="flex justify-center mb-2">
              <img 
                src={vendor.logoUrl.startsWith('http') ? vendor.logoUrl : `${typeof window !== 'undefined' ? window.location.origin : ''}${vendor.logoUrl}`} 
                className="h-16 w-auto object-contain block visible" 
                loading="eager"
                decoding="sync"
                style={{ display: 'block', visibility: 'visible', margin: '0 auto' }}
              />
            </div>
          )}
          <h1 className="text-xl font-black uppercase tracking-tighter leading-none">{vendor.businessName}</h1>
          <p className="text-[10px] font-bold leading-tight max-w-[320px] mx-auto uppercase">
            {vendor.address}
          </p>
          <div className="flex justify-center gap-4 text-[9px] font-black italic">
             <span>PH: {vendor.businessPhone}</span>
             <span>EM: {vendor.businessEmail}</span>
          </div>
          {vendor.gstin && (
            <div className="mt-2 inline-block px-2 py-0.5 border border-black font-black text-[9px] uppercase">
               GSTIN: {vendor.gstin}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-1 mb-4 text-[9px] font-black uppercase border-b border-zinc-100 pb-4">
           <div className="space-y-0.5">
              <p>BILL NO: <span className="underline">{order.orderNumber}</span></p>
              <p>DATE: {format(new Date(order.orderDate), 'dd/MM/yyyy')} | {format(new Date(order.orderDate), 'hh:mm a')}</p>
              <p>STATUS: <span className="underline">{order.payment?.status || 'PENDING'}</span></p>
              {order.payment?.transactionId && <p>TXN: {order.payment.transactionId}</p>}
           </div>
           <div className="text-right space-y-0.5">
              <p>GUEST: {order.customerName || 'WALK-IN'}</p>
              <p>PHONE: +{order.customerPhone}</p>
              {order.table && <p>TABLE: {order.table.tableNumber} ({order.table.location || 'FLOOR'})</p>}
              <p>MODE: {order.payment?.method || 'N/A'}</p>
           </div>
        </div>

        <table className="w-full mb-4">
           <thead>
              <tr className="border-b border-black text-[9px] font-black uppercase italic">
                 <th className="py-1 text-left">ITEM</th>
                 <th className="py-1 text-center">QTY</th>
                 <th className="py-1 text-right">RATE</th>
                 <th className="py-1 text-right pr-2">TOTAL</th>
              </tr>
           </thead>
           <tbody>
               {order.items.map((item: any) => (
                 <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-2 text-[10px] font-black uppercase leading-tight max-w-[150px]">{item.menuItem?.name || 'Item'}</td>
                    <td className="py-2 text-center text-[10px] font-black">{item.quantity}</td>
                    <td className="py-2 text-right text-[10px] font-black">₹{item.unitPrice}</td>
                    <td className="py-2 text-right pr-2 text-[10px] font-black">₹{item.totalPrice}</td>
                 </tr>
               ))}
               {(order.combos || []).map((combo: any) => (
                 <tr key={combo.id} className="border-b border-zinc-100 last:border-black">
                    <td className="py-2 text-[10px] font-black uppercase leading-tight max-w-[150px] text-emerald-600 italic">
                       {combo.combo?.name || 'Combo Bundle'}
                       <div className="text-[7px] text-zinc-400 normal-case not-italic">
                          {combo.combo?.items?.map((it: any) => it.menuItem?.name).join(' + ')}
                       </div>
                    </td>
                    <td className="py-2 text-center text-[10px] font-black">{combo.quantity}</td>
                    <td className="py-2 text-right text-[10px] font-black">₹{combo.unitPrice}</td>
                    <td className="py-2 text-right pr-2 text-[10px] font-black">₹{combo.totalPrice}</td>
                 </tr>
               ))}
           </tbody>
        </table>

        <div className="flex justify-end mb-6">
           <div className="w-56 space-y-1">
              <div className="flex justify-between text-[9px] font-black">
                 <span>SUBTOTAL</span>
                 <span>₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-[9px] font-black text-zinc-600">
                 <span>TAX/DISC</span>
                 <span>₹{(order.tax || 0) - (order.discount || 0)}</span>
              </div>
              <div className="pt-2 border-t border-black flex justify-between items-center">
                 <span className="text-xs font-black italic">GRAND TOTAL</span>
                 <span className="text-2xl font-black italic tracking-tighter">₹{order.finalAmount}</span>
              </div>
           </div>
        </div>

        <div className="text-center pt-4 space-y-2 border-t-2 border-dotted border-black">
           <p className="text-[9px] font-black uppercase leading-tight italic">
             THANK YOU FOR VISITING {vendor.businessName}!<br/>
             POWERED BY FORKSTACK.IO
           </p>
        </div>

      </div>

      {/* Header Bar (Hidden on print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-foreground flex items-center gap-3">
              Order {order.orderNumber}
              <Badge className={`${statusColors[order.status]} uppercase font-black tracking-widest text-[10px] px-3 py-1`}>
                {order.status}
              </Badge>
            </h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Planted on {format(new Date(order.orderDate), 'MMM dd, yyyy • hh:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadInvoice} className="rounded-xl border-border bg-muted text-foreground font-bold uppercase tracking-widest text-[10px]">
            <Printer className="mr-2 h-4 w-4" /> Print Ticket
          </Button>
          <Button onClick={handleNotifyWhatsApp} className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20">
            <MessageSquare className="mr-2 h-4 w-4" /> Notify WhatsApp
          </Button>
        </div>
      </div>

      {/* Main Content Grid (Hidden on print) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border bg-muted/30 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black italic uppercase tracking-widest text-foreground flex items-center gap-2">
                <Hash className="h-4 w-4 text-emerald-500" /> Order Items
              </CardTitle>
              <div className="flex items-center gap-2">
                <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest text-[9px] h-8 rounded-full border border-zinc-800">
                      <Plus className="mr-1 h-3 w-3" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border text-foreground rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">Add Item to Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Item</label>
                        <Select value={selectedItem} onValueChange={setSelectedItem}>
                          <SelectTrigger className="bg-muted border-border h-14 rounded-2xl font-bold italic text-sm">
                            <SelectValue placeholder="Search menu..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            {menuItems.map((item: any) => (
                              <SelectItem key={item.id} value={item.id} className="focus:bg-emerald-500 focus:text-black">
                                {item.name} — ₹{item.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={quantity} 
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="bg-muted border-border h-14 rounded-2xl font-black italic text-lg focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        disabled={isSubmitting || !selectedItem} 
                        onClick={handleAddItem}
                        className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Add'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddingCombo} onOpenChange={setIsAddingCombo}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[9px] h-8 rounded-full">
                      <Zap className="mr-1 h-3 w-3" /> Add Combo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border text-foreground rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-emerald-500">Add Combo Deal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Combo</label>
                        <Select value={selectedCombo} onValueChange={setSelectedCombo}>
                          <SelectTrigger className="bg-muted border-border h-14 rounded-2xl font-bold italic text-sm">
                            <SelectValue placeholder="Choose a bundle..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            {availableCombos.map((combo: any) => (
                              <SelectItem key={combo.id} value={combo.id} className="focus:bg-emerald-500 focus:text-black">
                                {combo.name} — ₹{combo.totalPrice}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={comboQuantity} 
                          onChange={(e) => setComboQuantity(parseInt(e.target.value))}
                          className="bg-muted border-border h-14 rounded-2xl font-black italic text-lg focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        disabled={isSubmitting || !selectedCombo} 
                        onClick={handleAddCombo}
                        className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Bundle Add'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Item Description</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Qty</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Price</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Total</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any) => (
                    <TableRow key={item.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <ChefHat className="h-5 w-5 text-zinc-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black italic uppercase text-foreground truncate">{item.menuItem?.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.menuItem?.category?.name || 'Item'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black italic text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-right font-black text-sm text-emerald-500">₹{item.unitPrice}</TableCell>
                      <TableCell className="text-right font-black text-sm pr-6">₹{item.totalPrice}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(order.combos || []).map((combo: any) => (
                    <TableRow key={combo.id} className="border-border/50 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black italic uppercase text-emerald-500 truncate">{combo.combo?.name}</p>
                            <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">Synergized Bundle</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black italic text-sm">{combo.quantity}</TableCell>
                      <TableCell className="text-right font-black text-sm text-emerald-500">₹{combo.unitPrice}</TableCell>
                      <TableCell className="text-right font-black text-sm pr-6">₹{combo.totalPrice}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCombo(combo.id)}
                          className="h-8 w-8 text-emerald-600/60 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Summary Section */}
              <div className="p-8 space-y-3 bg-muted/20">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-amber-500 uppercase tracking-widest">
                  <span>Platform Discount</span>
                  <span>- ₹{order.discount || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Taxes (Included)</span>
                  <span>₹{order.tax || 0}</span>
                </div>
                <div className="h-px bg-border my-6" />
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">Final Amount Due</span>
                      <span className="text-3xl font-black italic text-emerald-500 tracking-tighter uppercase">₹{order.finalAmount}</span>
                   </div>
                   <div className="text-right flex flex-col items-end">
                      <Badge className={`mb-2 font-black tracking-widest text-[9px] ${order.payment?.status === 'COMPLETED' ? 'bg-emerald-500 text-foreground' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                         {order.payment?.status || 'PENDING'}
                      </Badge>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Payment via {order.payment?.method || 'N/A'}</p>
                   </div>
                </div> 
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions card */}
          {order.specialInstructions && (
            <Card className="bg-card border-border rounded-[2rem] shadow-xl">
               <CardContent className="p-6 flex items-start gap-4">
                  <AlertCircle className="text-amber-500 mt-1 shrink-0" size={20} />
                  <div>
                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">Special Instructions</h5>
                    <p className="text-muted-foreground font-bold text-sm italic">"{order.specialInstructions}"</p>
                  </div>
               </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          
               <Card className="bg-card border-border rounded-[2rem] shadow-lg overflow-hidden focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
            <CardHeader className="p-6 border-b border-border bg-muted/30">
              <CardTitle className="text-base font-black italic uppercase tracking-widest text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" /> Dispatch Center
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Current Progress</label>
                <div className="grid grid-cols-2 gap-2">
                   {['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map((s: string) => (
                    <Button 
                      key={s}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(s)}
                      className={`rounded-xl h-10 font-bold uppercase text-[9px] tracking-widest border-border transition-all ${
                        order.status === s ? 'bg-emerald-500 border-transparent text-zinc-950 shadow-lg shadow-emerald-500/10' : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {s}
                    </Button>
                   ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                  <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Payment Lifecycle</label>
                  <Button 
                    disabled={order.payment?.status === 'COMPLETED'}
                    onClick={() => handlePaymentUpdate('COMPLETED')}
                    className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-[9px] ${
                     order.payment?.status === 'COMPLETED' ? 'bg-muted text-zinc-500' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border hover:bg-emerald-500 hover:text-foreground shadow-lg shadow-emerald-500/5'
                    }`}
                  >
                    {order.payment?.status === 'COMPLETED' ? <><CheckCircle2 size={14} className="mr-2 text-emerald-500" /> Payment Received</> : 'Verify & Mark as Paid'}
                  </Button>
                  
                  {order.payment?.status === 'COMPLETED' && (
                    <Button 
                      variant="ghost"
                      onClick={() => handlePaymentUpdate('PENDING')}
                      className="w-full h-8 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Revert to Unpaid
                    </Button>
                  )}
               </div>
            </CardContent>
          </Card>

                  <Card className="bg-card border-border rounded-[2rem] shadow-lg overflow-hidden transition-all">
            <CardHeader className="p-6 border-b border-border bg-muted/30">
              <CardTitle className="text-base font-black italic uppercase tracking-widest text-foreground flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-500" /> Customer Data
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                  onClick={() => setIsEditingDetails(true)}
                >
                  <Edit2 size={14} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                    <User size={24} />
                 </div>
                 <div>
                    <h4 className="font-black italic text-foreground uppercase truncate tracking-tight">{order.customerName || 'Walk-in Customer'}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{order.orderSource} Origin</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-2xl group/item transition-all hover:bg-background">
                    <div className="flex items-center gap-3">
                       <Phone className="text-muted-foreground group-hover/item:text-emerald-500 transition-colors" size={16} />
                       <span className="font-black italic text-foreground/80">+{order.customerPhone}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 h-8 w-8" onClick={handleNotifyWhatsApp}>
                       <MessageSquare size={16} />
                    </Button>
                 </div>
                 
                 {order.table && (
                   <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-2xl group/item transition-all hover:bg-background">
                      <div className="flex items-center gap-3">
                         <Hash className="text-muted-foreground group-hover/item:text-emerald-500 transition-colors" size={16} />
                         <span className="font-black italic text-foreground/80">Dining at Table {order.table.tableNumber}</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[8px] font-black">{order.table.location || 'FLOOR'}</Badge>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>

          {/* Print Ready Hint */}
          <div className="p-8 bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 rounded-[2.5rem] text-center space-y-4 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_4px_30px_rgba(16,185,129,0.5)]" />
             <div className="h-12 w-12 bg-muted border border-border rounded-2xl flex items-center justify-center mx-auto text-emerald-500 group-hover:scale-110 transition-transform">
                <Printer size={24} />
             </div>
             <div>
                <h6 className="text-[10px] font-black italic uppercase tracking-widest text-foreground mb-1">Detailed Invoice Ready</h6>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Full cafe letterhead & GST details included in print view</p>
             </div>
          </div>

        </div>
      </div>

      {/* Styles for print */}
      <style jsx global>{`
        @media print {
          /* Force margins and size */
          @page {
            margin: 0;
            size: auto;
          }

          /* General Reset */
          body { 
            background: white !important; 
            margin: 0;
            padding: 0;
            width: 100% !important;
          }

          /* SURGICAL HIDE: Only hide things that aren't the invoice */
          /* We target common layout elements and things marked print:hidden */
          header, 
          nav, 
          aside, 
          .sidebar, 
          .navigation,
          .print\:hidden { 
            display: none !important; 
            height: 0 !important;
            overflow: hidden !important;
          }
          
          /* RESET THE INVOICE CONTAINER */
          /* We don't use position: absolute to avoid clipping on multi-page */
          .hidden.print\:block {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            background: white !important;
            color: black !important;
          }

          /* Ensure all nested elements are visible */
          .hidden.print\:block,
          .hidden.print\:block * {
            visibility: visible !important;
          }

          /* Logo forced center */
          .hidden.print\:block img {
            display: block !important;
            margin: 0 auto 10px auto !important;
            max-height: 80px !important;
            width: auto !important;
            print-color-adjust: exact !important;
          }

          /* Fix Table stretching */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          td, th {
            padding: 4px 0 !important;
            border-bottom: 1px solid #000 !important;
          }

          /* Force exact colors for thermal/laser */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: black !important;
            background: transparent !important;
          }
        }
      `}</style>
      {/* Edit Details Dialog */}
      <Dialog open={isEditingDetails} onOpenChange={setIsEditingDetails}>
        <DialogContent className="bg-card border-border rounded-[2rem] shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tight text-foreground flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-emerald-500" /> Adjust Order Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</label>
                <Input 
                  value={editData.customerName}
                  onChange={(e) => setEditData({...editData, customerName: e.target.value})}
                  placeholder="Enter guest name"
                  className="h-12 bg-muted border-border rounded-xl font-bold"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp Number</label>
                <Input 
                  value={editData.customerPhone}
                  onChange={(e) => setEditData({...editData, customerPhone: e.target.value})}
                  placeholder="7172xxxxxx"
                  className="h-12 bg-muted border-border rounded-xl font-bold"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Dining Table</label>
                <Select 
                  value={editData.tableId} 
                  onValueChange={(val) => setEditData({...editData, tableId: val})}
                >
                  <SelectTrigger className="h-12 bg-muted border-border rounded-xl font-bold">
                    <SelectValue placeholder="Select Table" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="NONE" className="font-bold">No Table (Delivery/Pickup)</SelectItem>
                    {tables.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="font-bold">
                        Table {t.tableNumber} ({t.capacity} Seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Applied Discount (₹)</label>
                <Input 
                  type="number"
                  value={editData.discount}
                  onChange={(e) => setEditData({...editData, discount: Number(e.target.value)})}
                  placeholder="0.00"
                  className="h-12 bg-muted border-border rounded-xl font-bold text-emerald-500"
                />
             </div>
          </div>
          <DialogFooter className="gap-3">
             <Button variant="outline" onClick={() => setIsEditingDetails(false)} className="rounded-xl border-zinc-800">Cancel</Button>
             <Button 
               onClick={handleUpdateDetails} 
               disabled={isSubmitting}
               className="rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-8"
             >
               {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
