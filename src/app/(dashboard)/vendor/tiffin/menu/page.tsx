import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TiffinMenuPage() {
  // In a real app, we'd handle date state here
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Daily Menu Planner</h2>
          <p className="text-sm text-muted-foreground">Schedule what your subscribers will eat.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center px-4 py-2 border rounded-md bg-background min-w-[200px] justify-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lunch Menu */}
        <Card className="border-2 border-primary/10 shadow-md">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-primary" />
                <CardTitle>Lunch Menu</CardTitle>
              </div>
              <Badge variant="outline" className="bg-background">Scheduled</Badge>
            </div>
            <CardDescription>{dateStr}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Main Dish</Label>
              <Input placeholder="e.g. Paneer Butter Masala" defaultValue="Paneer Tikka Masala" />
            </div>
            <div className="space-y-2">
              <Label>Dal / Curry</Label>
              <Input placeholder="e.g. Dal Tadka" defaultValue="Dal Makhani" />
            </div>
            <div className="space-y-2">
              <Label>Breads / Rice</Label>
              <Input placeholder="e.g. Butter Roti & Jeera Rice" defaultValue="4 Roti, Jeera Rice" />
            </div>
            <div className="space-y-2">
              <Label>Side Dish / Salad</Label>
              <Input placeholder="e.g. Mix Veg, Cucumber Salad" defaultValue="Aloo Gobhi, Salad, Pickle" />
            </div>
            <div className="pt-4 border-t">
              <Button className="w-full">Save Lunch Menu</Button>
            </div>
          </CardContent>
        </Card>

        {/* Dinner Menu */}
        <Card className="shadow-md">
          <CardHeader className="bg-secondary/20 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-secondary-foreground" />
                <CardTitle>Dinner Menu</CardTitle>
              </div>
              <Badge variant="outline" className="bg-background text-muted-foreground">Not Set</Badge>
            </div>
            <CardDescription>{dateStr}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Main Dish</Label>
              <Input placeholder="e.g. Bhindi Masala" />
            </div>
            <div className="space-y-2">
              <Label>Dal / Curry</Label>
              <Input placeholder="e.g. Yellow Dal" />
            </div>
            <div className="space-y-2">
              <Label>Breads / Rice</Label>
              <Input placeholder="e.g. Chapati" />
            </div>
            <div className="space-y-2">
              <Label>Side Dish / Salad</Label>
              <Input placeholder="e.g. Raita" />
            </div>
            <div className="pt-4 border-t">
              <Button variant="secondary" className="w-full">Save Dinner Menu</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl bg-muted/50 p-6 border border-dashed text-center">
        <p className="text-sm text-muted-foreground italic">
          Tip: You can pre-schedule menus for the entire week to save time!
        </p>
      </div>
    </div>
  );
}
