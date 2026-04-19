'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChefHat, 
  LayoutDashboard, 
  Settings, 
  Store, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  BarChart3,
  ShieldCheck,
  Activity,
  Zap,
  CreditCard,
  Wallet,
  Send,
  LifeBuoy,
  MessageSquare,
  Brain,
  Handshake,
  Timer,
  Banknote,
  Palette,
  QrCode
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeaderSecurityToggle } from '@/components/dashboard/HeaderSecurityToggle';
import { DashboardLockScreen } from '@/components/dashboard/DashboardLockScreen';
import { useEffect } from 'react';
import { Lock as LockIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWorkstationLocked, setIsWorkstationLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState<string | null>(null);

  // Sync workstation lock with session storage
  useEffect(() => {
    const isLocked = localStorage.getItem('workstation_locked') === 'true';
    if (isLocked) setIsWorkstationLocked(true);

    async function fetchLockData() {
      if (session?.user?.role === 'VENDOR_OWNER') {
        try {
          const res = await fetch('/api/vendor/lock-config');
          const data = await res.json();
          setLockPassword(data.lockPassword);
        } catch (e) {
          console.error('Failed to sync security node');
        }
      }
    }
    fetchLockData();
  }, [session]);

  const handleLock = () => {
    localStorage.setItem('workstation_locked', 'true');
    setIsWorkstationLocked(true);
  };

  const handleUnlock = () => {
    localStorage.removeItem('workstation_locked');
    setIsWorkstationLocked(false);
  };

  const vendorNavItems = [
    { name: 'Overview', href: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/vendor/orders', icon: ShoppingBag },
    { name: 'Menu Items', href: '/vendor/menu/items', icon: ChefHat },
    { name: 'Dining Tables', href: '/vendor/tables', icon: LayoutDashboard },
    { name: 'Inventory', href: '/vendor/inventory', icon: Store },
    { name: 'Staff', href: '/vendor/staff', icon: Users },
    { name: 'Payments & Fiscal', href: '/vendor/payments', icon: Wallet },
    { name: 'Settings', href: '/vendor/settings', icon: Settings },
    { name: 'Vector Studio', href: '/vendor/qr-designer', icon: Palette },
    { name: 'Feature Requests', href: '/vendor/requests', icon: MessageSquare },
  ];

  const adminNavItems = [
    { name: 'Platform Command', href: '/admin/dashboard', icon: Zap },
    { name: 'Automation Core', href: '/admin/automation', icon: Brain },
    { name: 'Platform Cron Jobs', href: '/admin/jobs', icon: Timer },
    { name: 'Partner Vendors', href: '/admin/vendors', icon: Store },
    { name: 'Referral Network', href: '/admin/affiliates', icon: Handshake },
    { name: 'Subscription Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Global Broadcast', href: '/admin/broadcast', icon: Send },
    { name: 'Marketing Registry', href: '/admin/marketing', icon: MessageSquare },
    { name: 'Billing & Ledger', href: '/admin/billing', icon: Wallet },
    { name: 'Payout Settlements', href: '/admin/payments', icon: Banknote },
    { name: 'Resolution Command', href: '/admin/support', icon: LifeBuoy },
    { name: 'Network Health', href: '/admin/health', icon: Activity },
    { name: 'Revenue Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Access Control', href: '/admin/team', icon: ShieldCheck },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
    { name: 'Feature Inbox', href: '/admin/requests', icon: MessageSquare },
  ];

  const navItems = session?.user?.role === 'ADMIN' ? adminNavItems : vendorNavItems;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card backdrop-blur-2xl border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-8 justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <ChefHat className="text-zinc-950" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tighter text-foreground">ForkStack</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 px-4">
            Management
          </div>
          {navItems.map((item: any) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-500 shadow-sm ring-1 ring-emerald-500/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-6">
          <div className="rounded-2xl bg-muted/30 border border-border p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform">
              <User size={64} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                 <span className="font-bold text-zinc-900 text-sm">{(session?.user?.name || session?.user?.email || 'U').charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-none mb-1">{session?.user?.name || 'Owner'}</p>
                <p className="text-[10px] text-zinc-500 truncate font-medium uppercase tracking-wider">{session?.user?.role || 'VENDOR'}</p>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-background">
        <header className="h-24 min-h-[96px] flex items-center justify-between px-6 md:px-12 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm transition-colors">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden"
             >
               <Menu size={24} />
             </button>
             <h2 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
               {navItems.find(i => pathname?.startsWith(i.href))?.name || 'Dashboard'}
             </h2>
           </div>

           <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden lg:flex items-center bg-muted border border-border rounded-full px-4 h-10 w-64 text-muted-foreground focus-within:border-emerald-500/50 transition-colors">
                <Search size={16} />
                <input type="text" placeholder="Search data..." className="bg-transparent border-none focus:ring-0 text-xs flex-1 ml-2 outline-none" />
              </div>

              <ThemeToggle />

                {session?.user?.role === 'VENDOR_OWNER' && (
                  <button 
                    onClick={handleLock}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-zinc-950 transition-all group shadow-lg shadow-orange-500/5 active:scale-95"
                    title="Engage Workstation Lock"
                  >
                    <LockIcon size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">Secure</span>
                  </button>
                )}

                <div className="h-10 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
                
                {session?.user?.role === 'VENDOR_OWNER' && (
                  <HeaderSecurityToggle />
                )}

                <Badge variant="outline" className="hidden md:flex border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  Live System
                </Badge>
            </div>
        </header>

        <div className="p-6 md:p-10 container relative max-w-full">
          {/* Subtle Page background Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] -z-10" />
          
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </main>

      {isWorkstationLocked && (
        <DashboardLockScreen 
          onUnlock={handleUnlock} 
          correctPassword={lockPassword || undefined} 
        />
      )}
    </div>
  );
}