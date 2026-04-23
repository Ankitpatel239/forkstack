import React from "react";
import { getTiffinPlans } from "@/app/actions/tiffin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Calendar, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TiffinPlan } from "@/types/tiffin";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// This would ideally be fetched from the session in a real app
const MOCK_VENDOR_ID = "cm9f...vendor_id"; 

export default async function TiffinPlansPage() {
  const plans = await getTiffinPlans(MOCK_VENDOR_ID);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Plans</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Tiffin Plan</DialogTitle>
              <DialogDescription>
                Define a new subscription package for your customers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input id="name" placeholder="Monthly Veg Lunch" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" placeholder="2500" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meals">Total Meals</Label>
                  <Input id="meals" type="number" placeholder="20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Meal Type</Label>
                  <Select defaultValue="LUNCH">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LUNCH">Lunch Only</SelectItem>
                      <SelectItem value="DINNER">Dinner Only</SelectItem>
                      <SelectItem value="BOTH">Both (Lunch & Dinner)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validity">Validity (Days)</Label>
                  <Input id="validity" type="number" placeholder="30" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Include details about the menu..." />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            <Plus className="h-12 w-12 mb-4 opacity-20" />
            <p>No tiffin plans created yet.</p>
            <p className="text-sm">Create your first plan to start accepting subscriptions.</p>
          </div>
        ) : (
          plans.map((plan: TiffinPlan) => (
            <Card key={plan.id} className="relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <Badge variant="secondary">
                    {plan.mealType}
                  </Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-lg">₹{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">per cycle</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{plan.mealCount} Meals</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{plan.validityDays} Days</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
