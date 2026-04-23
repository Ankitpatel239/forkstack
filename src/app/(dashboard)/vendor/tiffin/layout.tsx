import React from "react";
import Link from "next/link";

export default function TiffinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Tiffin Service</h1>
        <p className="text-muted-foreground">
          Manage your subscription-based food delivery service.
        </p>
      </div>

      <nav className="flex space-x-4 border-b pb-2">
        <Link
          href="/vendor/tiffin/plans"
          className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
        >
          Plans
        </Link>
        <Link
          href="/vendor/tiffin/menu"
          className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
        >
          Daily Menu
        </Link>
        <Link
          href="/vendor/tiffin/subscriptions"
          className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
        >
          Subscribers
        </Link>
        <Link
          href="/vendor/tiffin/deliveries"
          className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
        >
          Today's Deliveries
        </Link>
      </nav>

      <div className="flex-1">{children}</div>
    </div>
  );
}
