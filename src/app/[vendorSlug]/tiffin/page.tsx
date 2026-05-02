import React from "react";
import { getTiffinPlansBySlug } from "@/app/actions/tiffin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Info, ArrowRight, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { TiffinPlan } from "@/types/tiffin";

export default async function TiffinCustomerPage({
  params,
}: {
  params: Promise<{ vendorSlug: string }>;
}) {
  const { vendorSlug } = await params;
  const plans = await getTiffinPlansBySlug(vendorSlug);

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5">
          Tiffin Subscription
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Hassle-free meals, <span className="text-primary">delivered.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your lifestyle. Fresh, homemade-style meals 
          delivered right to your doorstep, every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-20 border-2 border-dashed rounded-3xl">
            <UtensilsCrossed className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-bold">No Plans Available</h3>
            <p className="text-muted-foreground mt-2">Check back later for exciting subscription options!</p>
          </div>
        ) : (
          plans.map((plan: TiffinPlan) => (
            <Card key={plan.id} className="relative flex flex-col rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-2xl">
              {plan.price > 5000 && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Best Value
                  </div>
                </div>
              )}
              <CardHeader className="pt-8 px-8">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="rounded-full">
                    {plan.mealTypes.join(" + ")}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base mt-2 min-h-[48px]">
                  {plan.description || "Enjoy delicious home-style meals with our premium tiffin service."}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 flex-1">
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black">₹{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.validityDays} days</span>
                  </div>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-center font-medium">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
                      <Check className="h-3 w-3" />
                    </div>
                    {plan.mealCount} Total Meals
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-3 text-secondary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                    Daily doorstep delivery
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-3 text-secondary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                    Easy pause/resume
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-3 text-secondary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                    Weekly changing menu
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button asChild className="w-full rounded-2xl h-12 text-base font-bold shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform">
                  <Link href={`/${vendorSlug}/tiffin/subscribe/${plan.id}`}>
                    Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-secondary/50 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold">Have questions?</h4>
            <p className="text-muted-foreground">Learn more about our delivery zones, menu patterns, and hygiene standards.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl px-8">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
