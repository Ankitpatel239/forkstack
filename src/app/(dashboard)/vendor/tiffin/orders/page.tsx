'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  PlayCircle,
  MoreVertical,
  Search,
  Filter,
  CreditCard,
  ShoppingBag,
  Loader2,
  Calendar,
  Phone,
  MapPin
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getVendorByUserId, getTiffinSubscriptions, updateSubscriptionStatus } from "@/app/actions/tiffin";
import { TiffinSubscriptionStatus } from "@prisma/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { AddSubscriptionDialog } from "@/components/vendor/tiffin/AddSubscriptionDialog";

export default function TiffinOrdersPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const vendor = await getVendorByUserId(session.user.id);
      if (vendor) {
        setVendorId(vendor.id);
        const data = await getTiffinSubscriptions(vendor.id);
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
      toast.error("Failed to load subscription orders");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id: string, status: TiffinSubscriptionStatus) => {
    setIsActionLoading(id);
    try {
      await updateSubscriptionStatus(id, status);
      toast.success(`Subscription ${status.toLowerCase()} successfully`);
      await fetchData();
    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update status");
    } finally {
      setIsActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Pending Approval</Badge>;
      case "ACTIVE":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Active Service</Badge>;
      case "PAUSED":
        return <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Service Paused</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredSubs = subscriptions.filter(sub => 
    sub.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSubs = filteredSubs.filter(s => s.status === "PENDING");
  const activeSubs = filteredSubs.filter(s => s.status === "ACTIVE");
  const otherSubs = filteredSubs.filter(s => s.status !== "PENDING" && s.status !== "ACTIVE");

  if (isLoading && !vendorId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 -mt-20">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">Synchronizing Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <ShoppingBag className="text-amber-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Subscription Orders</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Lifecycle & Status Management</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border border-border/50 h-11 w-64 rounded-xl pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-border/50 h-11 px-4 text-muted-foreground hover:text-foreground">
             <Filter className="mr-2" size={16} /> Filter
          </Button>
          {vendorId && <AddSubscriptionDialog vendorId={vendorId} onSuccess={fetchData} />}
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-8">
        <TabsList className="bg-card/40 backdrop-blur-xl p-1 rounded-2xl border border-border h-14">
          <TabsTrigger value="pending" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 transition-all">
            New Requests
            {pendingSubs.length > 0 && <Badge className="ml-2 bg-amber-500 text-zinc-950 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">{pendingSubs.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 transition-all">
            Active Service
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-emerald-500 data-[state=active]:text-zinc-950 transition-all">
            All Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <OrderTable 
            subscriptions={pendingSubs} 
            isActionLoading={isActionLoading} 
            handleStatusUpdate={handleStatusUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <OrderTable 
            subscriptions={activeSubs} 
            isActionLoading={isActionLoading} 
            handleStatusUpdate={handleStatusUpdate} 
          />
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <OrderTable 
            subscriptions={filteredSubs} 
            isActionLoading={isActionLoading} 
            handleStatusUpdate={handleStatusUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderTable({ subscriptions, isActionLoading, handleStatusUpdate }: any) {
  if (subscriptions.length === 0) {
    return (
      <Card className="border-none bg-card/20 backdrop-blur-sm rounded-[2rem] border-dashed border-2 border-border py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6 opacity-20">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold">No Records Found</h3>
        <p className="text-sm text-muted-foreground max-w-[300px]">There are no subscriptions in this category at the moment.</p>
      </Card>
    );
  }

  return (
    <div className="bg-card/40 backdrop-blur-2xl rounded-[2rem] border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em]">Customer</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Plan Details</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Purchase Date</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Status</TableHead>
            <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-[0.2em]">Status Management</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub: any) => (
            <TableRow key={sub.id} className="hover:bg-muted/20 border-border/50 transition-colors group">
              <TableCell className="py-6 px-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-lg">
                    <AvatarFallback className="bg-amber-500 text-zinc-950 font-black text-lg">
                      {sub.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">{sub.customer.name}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Phone size={10} className="text-amber-500" /> {sub.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard size={12} className="text-amber-500" />
                    <p className="text-sm font-bold">{sub.plan.name}</p>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{sub.plan.mealType} • ₹{sub.plan.price}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-amber-500" />
                    <p className="text-sm font-bold">{format(new Date(sub.createdAt), 'dd MMM yyyy')}</p>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{format(new Date(sub.createdAt), 'hh:mm a')}</p>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(sub.status)}
              </TableCell>
              <TableCell className="text-right px-8">
                <div className="flex justify-end gap-2">
                  {sub.status === "PENDING" && (
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 h-9"
                      onClick={() => handleStatusUpdate(sub.id, "ACTIVE")}
                      disabled={isActionLoading === sub.id}
                    >
                      {isActionLoading === sub.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 className="mr-1.5" size={14} />}
                      Approve
                    </Button>
                  )}
                  
                  {sub.status === "ACTIVE" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="rounded-xl border-zinc-500/30 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-zinc-500 hover:text-white h-9"
                      onClick={() => handleStatusUpdate(sub.id, "PAUSED")}
                      disabled={isActionLoading === sub.id}
                    >
                       {isActionLoading === sub.id ? <Loader2 className="animate-spin" size={14} /> : <PauseCircle className="mr-1.5" size={14} />}
                       Pause
                    </Button>
                  )}

                  {sub.status === "PAUSED" && (
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 h-9"
                      onClick={() => handleStatusUpdate(sub.id, "ACTIVE")}
                      disabled={isActionLoading === sub.id}
                    >
                       {isActionLoading === sub.id ? <Loader2 className="animate-spin" size={14} /> : <PlayCircle className="mr-1.5" size={14} />}
                       Resume
                    </Button>
                  )}

                  {sub.status !== "CANCELLED" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-red-500/10 hover:text-red-500 h-9 w-9"
                      onClick={() => handleStatusUpdate(sub.id, "CANCELLED")}
                      disabled={isActionLoading === sub.id}
                    >
                      <XCircle size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Pending Approval</Badge>;
    case "ACTIVE":
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Active Service</Badge>;
    case "PAUSED":
      return <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Service Paused</Badge>;
    case "CANCELLED":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-1">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
