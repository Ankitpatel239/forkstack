import React from "react";
import Link from "next/link";

export default function TiffinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full space-y-8 p-1 sm:p-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-gradient-emerald">Tiffin Console</h1>
          <p className="text-muted-foreground font-medium">
            Next-gen meal subscription management engine.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 animate-pulse">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          System Operational
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 border-b border-border/40">
        {[
          { name: 'Overview', href: '/vendor/tiffin' },
          { name: 'Plans', href: '/vendor/tiffin/plans' },
          { name: 'Daily Menu', href: '/vendor/tiffin/menu' },
          { name: 'Subscribers', href: '/vendor/tiffin/subscriptions' },
          { name: 'Deliveries', href: '/vendor/tiffin/deliveries' },
          { name: 'Settings', href: '/vendor/tiffin/settings' },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all whitespace-nowrap"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex-1">{children}</div>
    </div>
  );
}
