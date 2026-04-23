import React from "react";
import { getTiffinSubscriptions } from "@/app/actions/tiffin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserCheck, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubscriptionWithDetails } from "@/types/tiffin";

const MOCK_VENDOR_ID = "cm9f...vendor_id";

export default async function TiffinSubscriptionsPage() {
  const subscriptions = await getTiffinSubscriptions(MOCK_VENDOR_ID);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Subscribers</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search subscribers..."
            className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Meals Left</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No active subscriptions found.</p>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub: SubscriptionWithDetails) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{sub.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{sub.customer.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" /> {sub.customer.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{sub.plan.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.plan.mealType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{sub.remainingMeals}</span>
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${(sub.remainingMeals / sub.plan.mealCount) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Tomorrow</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {sub.address?.substring(0, 20)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-sm font-medium text-primary hover:underline">
                      Manage
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
