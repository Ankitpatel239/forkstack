'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bike, 
  Loader2, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone,
  User,
  ArrowRight,
  Navigation,
  ShieldCheck,
  TrendingUp,
  PackageCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getVendorByUserId } from "@/app/actions/tiffin";
import { 
  getRiders, 
  createRider, 
  updateRiderStatus, 
  assignRiderToDelivery, 
  completeDelivery,
  getUnassignedDeliveries 
} from "@/app/actions/riders";
import { RiderStatus } from "@prisma/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RidersPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [riders, setRiders] = useState<any[]>([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!vendorId) return;
    setIsLoading(true);
    try {
      const [r, d] = await Promise.all([
        getRiders(vendorId),
        getUnassignedDeliveries(vendorId, new Date())
      ]);
      setRiders(r);
      setUnassignedDeliveries(d);
    } catch (error) {
      toast.error("Failed to load delivery data");
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    async function fetchVendor() {
      if (session?.user?.id) {
        const vendor = await getVendorByUserId(session.user.id);
        if (vendor) setVendorId(vendor.id);
      }
    }
    fetchVendor();
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (riderId: string, deliveryId: string) => {
    try {
      await assignRiderToDelivery(riderId, deliveryId);
      toast.success("Rider assigned!");
      fetchData();
    } catch (error) {
      toast.error("Assignment failed");
    }
  };

  const handleComplete = async (assignmentId: string) => {
    try {
      await completeDelivery(assignmentId);
      toast.success("Delivery completed!");
      fetchData();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleStatusChange = async (riderId: string, status: RiderStatus) => {
    try {
      await updateRiderStatus(riderId, status);
      toast.success(`Rider is now ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update rider status");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-2xl shadow-blue-500/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Bike className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Delivery Fleet</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Logistics & Rider Management</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
              <Plus className="mr-2" size={20} /> Add Rider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[2.5rem] bg-background/95 backdrop-blur-3xl border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic">Onboard New Rider</DialogTitle>
            </DialogHeader>
            <RiderForm vendorId={vendorId!} onSuccess={() => { setIsDialogOpen(false); fetchData(); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Riders List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riders.map((rider) => (
              <RiderCard 
                key={rider.id} 
                rider={rider} 
                onStatusChange={(status) => handleStatusChange(rider.id, status)}
                onCompleteDelivery={handleComplete}
              />
            ))}
            {riders.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                <p className="text-muted-foreground font-black uppercase tracking-widest">No riders onboarded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Unassigned Deliveries */}
        <div className="space-y-6">
          <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-full sticky top-8">
            <CardHeader className="p-8 pb-4 border-b border-border/50 bg-blue-500/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-black uppercase italic">Dispatch Queue</CardTitle>
                <Badge className="bg-blue-500/10 text-blue-500 border-none font-black px-3 rounded-full">
                  {unassignedDeliveries.length} Pending
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Today's Unassigned Deliveries</p>
            </CardHeader>
            <CardContent className="p-6 flex-grow overflow-y-auto max-h-[700px] space-y-4">
              {unassignedDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-5 rounded-3xl bg-background/50 border border-border/50 hover:border-blue-500/30 transition-all space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-sm uppercase">{delivery.subscription.customer.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <MapPin size={10} /> {delivery.subscription.area || "City Center"}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase">
                      {delivery.mealType}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Assign to Rider</p>
                     <Select onValueChange={(val) => handleAssign(val, delivery.id)}>
                        <SelectTrigger className="h-10 rounded-xl bg-background border-border text-xs font-bold">
                          <SelectValue placeholder="Select Available Rider" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {riders.filter(r => r.status === 'AVAILABLE' || r.status === 'ASSIGNED').map(r => (
                            <SelectItem key={r.id} value={r.id} className="text-xs font-bold">
                              {r.name} ({r.assignments.length} Active)
                            </SelectItem>
                          ))}
                        </SelectContent>
                     </Select>
                  </div>
                </div>
              ))}
              {unassignedDeliveries.length === 0 && (
                <div className="py-20 text-center opacity-50 flex flex-col items-center">
                  <PackageCheck className="mb-4 text-blue-500" size={48} />
                  <p className="text-xs font-black uppercase tracking-widest">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RiderCard({ rider, onStatusChange, onCompleteDelivery }: { rider: any, onStatusChange: (s: RiderStatus) => void, onCompleteDelivery: (id: string) => void }) {
  const activeAssignments = rider.assignments.filter((a: any) => a.status !== 'DELIVERED');

  return (
    <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 border-b border-border/50 bg-background/20">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              rider.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              rider.status === 'DELIVERING' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
              'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
            }`}>
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic">{rider.name}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Phone size={10} /> {rider.phone}
              </p>
            </div>
          </div>
          <Select value={rider.status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-fit h-8 text-[9px] font-black uppercase border-none bg-background/50 rounded-lg focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
              <SelectItem value="OFFLINE">OFFLINE</SelectItem>
              <SelectItem value="DELIVERING">DELIVERING</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-background/30 border border-border/50">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Active Jobs</p>
            <p className="text-xl font-black">{activeAssignments.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-background/30 border border-border/50">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Vehicle</p>
            <p className="text-xs font-black uppercase">{rider.vehicleType || "BIKE"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Deliveries</p>
          {activeAssignments.map((a: any) => (
            <div key={a.id} className="p-4 rounded-2xl bg-background/50 border border-border/50 flex justify-between items-center">
              <div>
                <p className="font-bold text-xs uppercase">{a.delivery.subscription.customer.name}</p>
                <p className="text-[9px] text-muted-foreground font-medium">{a.delivery.subscription.area}</p>
              </div>
              <Button size="sm" className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest px-3" onClick={() => onCompleteDelivery(a.id)}>
                <ShieldCheck className="mr-1" size={12} /> Complete
              </Button>
            </div>
          ))}
          {activeAssignments.length === 0 && (
            <p className="text-[10px] font-bold text-muted-foreground italic text-center py-2">No active assignments</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RiderForm({ vendorId, onSuccess }: { vendorId: string, onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("BIKE");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone) {
      toast.error("Name and phone are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await createRider(vendorId, { name, phone, vehicleType, vehicleNumber, status: 'AVAILABLE' });
      toast.success("Rider added successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add rider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} className="rounded-2xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
        <Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-2xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Type</Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="rounded-2xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="BIKE">BIKE</SelectItem>
              <SelectItem value="SCOOTER">SCOOTER</SelectItem>
              <SelectItem value="CYCLE">CYCLE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Reg #</Label>
          <Input value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} className="rounded-2xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" />
        </div>
      </div>
      <Button 
        className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 mt-4"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Onboarding"}
      </Button>
    </div>
  );
}
