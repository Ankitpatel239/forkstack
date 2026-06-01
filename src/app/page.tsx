import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma as db } from '@/lib/db';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  MessageCircle, 
  Package, 
  Users, 
  CreditCard, 
  BarChart3,
  QrCode,
  Gift,
  Globe,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  ChefHat,
  Zap,
  Shield,
  Rocket,
  Activity,
  Layers,
  Menu
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet"
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SignOutButton } from '@/components/public/SignOutButton';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const features = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Smart QR Ecosystem",
      description: "Infinite turnover with AI-optimized table mapping and instant payment settlement.",
      badge: "Automation"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp Engine",
      description: "Direct-to-customer communication channel with 98% open rates and automated marketing.",
      badge: "Growth"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Neural Inventory",
      description: "Predictive stock management that knows what you need before you run out.",
      badge: "Intelligence"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption for every transaction and sensitive customer data point.",
      badge: "Secure"
    }
  ];

  // Fetch real plans from the database
  const platformPlans = await db.platformPlan.findMany({
    where: { isActive: true, isPublic: true },
    include: {
      features: true,
      limits: {
        include: {
          limit: true
        }
      }
    },
    orderBy: { price: 'asc' }
  });

  let displayPlans = platformPlans.map(plan => ({
    id: plan.name,
    name: plan.displayName,
    price: `${plan.price}`,
    features: [
      ...plan.limits.map(l => `${l.value > 9999 ? 'Unlimited' : l.value} ${l.limit.label}`),
      ...plan.features.map(f => f.label)
    ],
    popular: plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('grow') || plan.price === 79
  }));

  // Fallback if database is empty
  if (displayPlans.length === 0) {
    displayPlans = [
      { id: "starter", name: "Starter", price: "$29", features: ["1 location", "5 staff members", "QR Ordering", "Daily Reports"], popular: false },
      { id: "growing", name: "Growing", price: "$79", features: ["3 locations", "Unlimited staff", "WhatsApp Integration", "Inventory Control", "Loyalty Programs"], popular: true },
      { id: "enterprise", name: "Enterprise", price: "$149", features: ["Unlimited locations", "Custom API Access", "Dedicated Manager", "White-label Branding"], popular: false }
    ];
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-emerald-500/30 overflow-x-hidden w-full">
      {/* Background Decorative Elements – enhanced with more animated layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-[pulse-glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full animate-[pulse-glow_4s_ease-in-out_infinite_2s]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full animate-[pulse-glow_6s_ease-in-out_infinite_1s]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* Session Command Bar */}
      {session?.user && (
        <div className={`w-full ${session.user.role === 'ADMIN' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'} py-1.5 px-4 sm:px-6 sticky top-0 z-[100] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-colors duration-500 animate-[slide-down_0.5s_ease-out]`}>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Shield className={`h-3.5 w-3.5 ${session.user.role === 'ADMIN' ? 'animate-pulse' : 'opacity-50'}`} />
              <span className="hidden sm:inline">{session.user.role === 'ADMIN' ? 'Admin Engine Active' : 'Member Session Active'}</span>
              <span className="sm:hidden">{session.user.role}</span>
            </div>
            <div className={`hidden sm:block h-3 w-px ${session.user.role === 'ADMIN' ? 'bg-zinc-950/20' : 'bg-zinc-900/10 dark:bg-white/10'}`} />
            <nav className="hidden lg:flex gap-6">
              {session.user.role === 'ADMIN' ? (
                <>
                  <Link href="/admin/dashboard" className="hover:text-zinc-600 dark:hover:text-white transition-colors">Console</Link>
                  <Link href="/admin/vendors" className="hover:text-zinc-600 dark:hover:text-white transition-colors">Vendors</Link>
                  <Link href="/admin/payments" className="hover:text-zinc-600 dark:hover:text-white transition-colors">Revenue</Link>
                  <Link href="/admin/broadcast" className="hover:text-zinc-600 dark:hover:text-white transition-colors">Broadcast</Link>
                </>
              ) : (
                <>
                  <Link href="/vendor/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link>
                  <Link href="/vendor/inventory" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inventory</Link>
                  <Link href="/vendor/orders" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Orders</Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden md:inline-block opacity-60 tabular-nums lowercase tracking-normal">{session.user.email} · {session.user.role}</span>
             <SignOutButton className={`${session.user.role === 'ADMIN' ? 'bg-zinc-950 text-emerald-50' : 'bg-emerald-500 text-zinc-950'} px-2 py-1 sm:px-3 sm:py-1 rounded-sm hover:scale-105 transition-all text-[9px] sm:text-[10px] font-black uppercase`}>
               Disconnect
             </SignOutButton>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className={`sticky ${session?.user ? 'top-[30px] sm:top-[34px]' : 'top-0'} z-50 w-full border-b border-zinc-200 dark:border-white/5 bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300`}>
        <div className="container px-4 md:px-8 flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-emerald-500 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-emerald-500/20 rotate-3 hover:rotate-0 transition-transform duration-300 group">
              <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-950 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
              ForkStack
            </span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              href="/explore" 
              className="px-4 py-2 text-sm font-black text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              Explore
            </Link>
            {['Features', 'Growth', 'Pricing', 'FAQ'].map((item) => (
              <Link 
                key={item}
                href={item === 'Features' ? '/features' : `#${item.toLowerCase()}`} 
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {session ? (
                <Link href={session?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'} className={cn(buttonVariants({ variant: "default" }), "rounded-full px-8 bg-zinc-950 dark:bg-zinc-100 hover:scale-105 transition-transform")}>
                  Enter App
                </Link>
              ) : (
                <>
                  <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "font-bold hover:scale-105 transition-transform")}>
                    Log In
                  </Link>
                  <Link href="/register" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full px-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:text-zinc-950 font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all")}>
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center">
              <Sheet>
                <SheetTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent hover:bg-muted text-sm font-medium hover:rotate-90 transition-transform">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col h-[100dvh] w-[85vw] sm:w-[400px] bg-background/95 backdrop-blur-2xl border-zinc-200 dark:border-white/10 p-0">
                  <SheetHeader className="p-5 sm:p-6 border-b border-zinc-200 dark:border-white/10 shrink-0">
                    <SheetTitle className="text-left flex items-center gap-2 pr-8">
                      <div className="bg-emerald-500 p-1.5 sm:p-2 rounded-lg shadow-md">
                        <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-950" />
                      </div>
                      <span className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 dark:text-white truncate">ForkStack</span>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Navigation menu
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    <nav className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link 
                          href="/explore" 
                          className="px-4 py-3 sm:py-4 text-base sm:text-lg font-black text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors uppercase tracking-widest"
                        >
                          Explore Directory
                        </Link>
                      </SheetClose>
                      {['Features', 'Growth', 'Pricing', 'FAQ'].map((item) => (
                        <SheetClose asChild key={item}>
                          <Link 
                            href={item === 'Features' ? '/features' : `#${item.toLowerCase()}`} 
                            className="flex items-center justify-between py-3 px-4 text-lg sm:text-xl font-black text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all group"
                          >
                            <span>{item}</span>
                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500" />
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>

                  <div className="p-5 sm:p-6 border-t border-zinc-200 dark:border-white/10 shrink-0 bg-background/50">
                    <div className="flex flex-col gap-3">
                      {session ? (
                        <SheetClose asChild>
                          <Link href={session?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-2xl h-12 sm:h-14 text-base sm:text-lg bg-zinc-950 dark:bg-zinc-100 hover:scale-[1.02] transition-transform")}>
                            Enter App
                          </Link>
                        </SheetClose>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-2xl h-12 sm:h-14 text-base sm:text-lg font-bold border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5")}>
                              Log In
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/register" className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-2xl h-12 sm:h-14 text-base sm:text-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:text-zinc-950 font-black shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all")}>
                              Get Started
                            </Link>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section – with word stagger animation */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 px-4 md:px-0">
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-md border border-emerald-500/20 mb-2 sm:mb-4 animate-[fade-in-up_0.8s_ease-out]">
                <Badge className="bg-emerald-500 border-none text-[8px] sm:text-[10px] h-4 sm:h-5 animate-pulse">V2.0</Badge>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">Next-Gen POS Engine is Live</span>
              </div>
              
              {/* Staggered heading words */}
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight text-zinc-900 dark:text-white leading-[0.95] sm:leading-[0.9] text-balance">
                <span className="inline-block animate-[fade-in-up_0.6s_ease-out_0.1s_both]">Scale</span>{' '}
                <span className="inline-block animate-[fade-in-up_0.6s_ease-out_0.2s_both]">Your</span>{' '}
                <br className="hidden sm:block"/>
                <span className="inline-block text-emerald-500 animate-[fade-in-up_0.6s_ease-out_0.3s_both]">Venue</span>{' '}
                <span className="inline-block animate-[fade-in-up_0.6s_ease-out_0.4s_both]">Without</span>{' '}
                <br className="hidden sm:block" />
                <span className="inline-block animate-[fade-in-up_0.6s_ease-out_0.5s_both]">The</span>{' '}
                <span className="inline-block animate-[fade-in-up_0.6s_ease-out_0.6s_both]">Stress.</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed sm:leading-relaxed text-balance px-2 animate-[fade-in-up_0.8s_ease-out_0.7s_both]">
                The high-performance operating system designed for modern hospitality. Automate ordering, sync inventory, and grow your revenue by 35% in 30 days.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-4 animate-[fade-in-up_0.8s_ease-out_0.9s_both]">
                <Link href="/register" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-full text-lg sm:text-xl font-black bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:text-zinc-950 shadow-2xl shadow-emerald-500/30 group hover:shadow-emerald-500/50 transition-all")}>
                  Deploy ForkStack
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-full text-lg sm:text-xl font-bold bg-white/50 dark:bg-transparent border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 backdrop-blur-md transition-all")}>
                  Live Demo
                </Link>
              </div>

              {/* Terminal Section with rotating gradient border */}
              <div className="relative mt-12 md:mt-20 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl sm:rounded-[2.5rem] blur-xl sm:blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-[rotate-gradient_8s_linear_infinite]" />
                <div className="relative bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl animate-float-slow group-hover:scale-[1.01] transition-transform duration-700">
                  {/* Mock Window Bar */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/5">
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 animate-pulse" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="text-[8px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">
                      ForkStack-Engine-Main
                    </div>
                    <div className="w-8 sm:w-10" />
                  </div>
                  <img 
                    src="/dashboard/ForkStack-Engine-Main-Dashboard.png" 
                    alt="Dashboard Interface" 
                    className="w-full aspect-[16/9] object-cover opacity-90 dark:opacity-80 transition-opacity duration-500"
                  />
                  {/* Floating Action Cards – with additional elements */}
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl hidden sm:block animate-[float-up_4s_ease-in-out_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">Real-time Traffic</div>
                        <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">+142% today</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 sm:top-8 right-4 sm:right-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl hidden sm:block animate-[float-up_4s_ease-in-out_infinite_0.5s]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase">Orders/min</div>
                        <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">24</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker Section – different speeds for each row */}
        <section className="py-6 sm:py-10 border-y border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="flex gap-8 sm:gap-16 animate-slide-infinite whitespace-nowrap items-center w-[200%] mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-8 sm:gap-16 items-center">
                 {['GLOBAL EATS', 'FLASH COFFEE', 'PRIME DINER', 'GROWTH FOODS', 'PURE BITES', 'STELIO', 'MODERN KITCHEN', 'THE GRID'].map((brand) => (
                   <span key={brand} className="text-xl sm:text-3xl font-black text-zinc-300 dark:text-white/20 hover:text-emerald-500 transition-colors cursor-default tracking-tighter">
                     {brand}
                   </span>
                 ))}
              </div>
            ))}
          </div>
          <div className="flex gap-8 sm:gap-16 animate-slide-infinite-reverse whitespace-nowrap items-center w-[200%]">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-8 sm:gap-16 items-center">
                 {['THE GRID', 'MODERN KITCHEN', 'STELIO', 'PURE BITES', 'GROWTH FOODS', 'PRIME DINER', 'FLASH COFFEE', 'GLOBAL EATS'].map((brand) => (
                   <span key={brand} className="text-xl sm:text-3xl font-black text-zinc-300 dark:text-white/20 hover:text-emerald-500 transition-colors cursor-default tracking-tighter">
                     {brand}
                   </span>
                 ))}
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid – with 3D hover effect */}
        <section id="features" className="py-16 md:py-32 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative">
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-10 mb-12 md:mb-24">
              <div className="max-w-2xl">
                <h2 className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase mb-4 md:mb-6 flex items-center gap-2 text-xs sm:text-sm md:text-base">
                   <div className="w-6 sm:w-8 h-px bg-emerald-600 dark:bg-emerald-400" /> Technology Stack
                </h2>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white text-balance">
                  High-frequency infrastructure for hospitality teams.
                </h3>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg md:text-xl max-w-sm lg:pb-2 text-balance">
                We've built a multi-tenant engine that scales with your ambition, not your headcount.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group p-6 md:p-8 rounded-[2rem] border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 transition-all duration-500 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-white/[0.02] shadow-sm hover:shadow-xl dark:shadow-none hover:scale-[1.03] hover:-translate-y-1 perspective-800">
                  <div className="mb-6 md:mb-10 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div className="block" />
                  <Badge variant="outline" className="mb-3 md:mb-4 bg-zinc-100 dark:bg-white/5 border-none text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-xs group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">{feature.badge}</Badge>
                  <h4 className="text-xl md:text-2xl font-black mb-2 md:mb-4 text-zinc-900 dark:text-white">{feature.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base lg:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Section – with animated chart and floating elements */}
        <section id="growth" className="py-16 md:py-32 relative overflow-hidden bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-8 md:space-y-12">
                <div>
                  <h2 className="text-emerald-600 dark:text-emerald-500 font-black tracking-widest uppercase mb-3 md:mb-4 text-xs sm:text-sm animate-[fade-in-left_0.8s_ease-out]">The Result</h2>
                  <h3 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] sm:leading-[0.85] mb-6 md:mb-8 text-zinc-900 dark:text-white text-balance animate-[fade-in-left_0.8s_ease-out_0.2s_both]">
                    We will grow <br className="hidden sm:block" /> your business <br className="hidden sm:block" /> like this.
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground text-balance animate-[fade-in-left_0.8s_ease-out_0.4s_both]">
                    Implementing ForkStack isn't just about changing your software; it's about upgrading your business physics.
                  </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {[
                    { title: "Velocity Injection", desc: "40% faster ordering cycles from scan to kitchen.", icon: <Rocket className="h-5 w-5 sm:h-6 sm:w-6" /> },
                    { title: "Revenue Optimization", desc: "AI-driven upselling increases average order value by 22%.", icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" /> },
                    { title: "Operational Zero", desc: "Reduce administrative overhead to near-zero with automated sync.", icon: <Layers className="h-5 w-5 sm:h-6 sm:w-6" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-6 items-start group animate-[fade-in-left_0.8s_ease-out_calc(0.6s+0.2s*var(--i))_both]" style={{'--i': i} as React.CSSProperties}>
                      <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-xl bg-zinc-100 dark:bg-muted border border-zinc-200 dark:border-border flex items-center justify-center text-zinc-500 dark:text-muted-foreground group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-black mb-1 text-zinc-900 dark:text-white">{item.title}</h4>
                        <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-8 md:mt-0 animate-[fade-in-right_0.8s_ease-out_0.3s_both]">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
                <div className="relative bg-white/50 dark:bg-white/5 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-zinc-200 dark:border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                  {/* Growth Chart Visualization */}
                  <div className="aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-inner">
                    <div className="flex justify-between items-center z-10">
                      <div>
                        <div className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Efficiency Multiplier</div>
                        <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">12.4x</div>
                      </div>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-emerald-500 rounded-lg flex items-center justify-center animate-bounce">
                        <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-zinc-950" />
                      </div>
                    </div>
                    {/* SVG Graph Animation */}
                    <div className="absolute top-16 sm:top-24 left-0 right-0 h-32 sm:h-48 opacity-60">
                       <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                         <defs>
                           <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                             <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                           </linearGradient>
                           <filter id="glow">
                             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                             <feMerge>
                               <feMergeNode in="coloredBlur"/>
                               <feMergeNode in="SourceGraphic"/>
                             </feMerge>
                           </filter>
                         </defs>
                         <path 
                           d="M0,200 Q100,180 200,120 T400,20" 
                           fill="none" 
                           stroke="url(#line-gradient)" 
                           strokeWidth="8" 
                           strokeLinecap="round"
                           filter="url(#glow)"
                           className="[stroke-dasharray:1000] [stroke-dashoffset:1000] animate-[dash_4s_ease-in-out_infinite]" 
                         />
                       </svg>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 z-10">
                      {[40, 65, 85, 100].map((h, i) => (
                        <div key={i} className="h-20 sm:h-32 bg-zinc-200/50 dark:bg-white/5 rounded-lg sm:rounded-xl border border-zinc-200 dark:border-white/5 flex items-end p-1 sm:p-2 group/bar transition-all hover:bg-zinc-200 dark:hover:bg-white/10">
                           <div 
                             className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-500 rounded-md sm:rounded-lg transition-all duration-1000 origin-bottom animate-[grow-up_1s_ease-out_forwards]" 
                             style={{ height: `${h}%` }} 
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating Notification – enhanced animation */}
                  <div className="absolute top-[45%] sm:top-1/2 -right-2 sm:-right-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-white/10 max-w-[180px] sm:max-w-[220px] animate-[float-up_4s_ease-in-out_infinite] z-20">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 animate-ping" />
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-widest mb-0.5 sm:mb-1">New Order</div>
                        <div className="text-[10px] sm:text-xs font-bold text-zinc-900 dark:text-white leading-tight">Table 04 <br/><span className="text-zinc-500 font-medium">$142.00</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section – with 3D tilt effect on cards */}
        <section id="pricing" className="py-16 md:py-32 bg-zinc-50 dark:bg-zinc-950">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24">
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4 md:mb-8 text-balance animate-[fade-in-up_0.8s_ease-out]">Simple Deployment.</h3>
              <p className="text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 text-balance px-4 animate-[fade-in-up_0.8s_ease-out_0.2s_both]">Zero hidden fees. Zero transaction cuts. Just pure performance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-sm md:max-w-none mx-auto">
              {displayPlans.map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] transition-all duration-500 group perspective-800 hover:rotate-y-2 hover:rotate-x-1 ${
                    plan.popular 
                      ? 'bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-950 md:scale-105 shadow-2xl dark:shadow-[0_0_80px_rgba(16,185,129,0.2)] z-10 border border-zinc-200 dark:border-transparent' 
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 text-zinc-900 dark:text-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-emerald-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-950 animate-bounce shadow-lg shadow-emerald-500/30">
                      Engine Choice
                    </div>
                  )}
                  
                  <div className="mb-8 sm:mb-10">
                    <h4 className="text-xl sm:text-2xl font-black mb-2 sm:mb-4 tracking-tighter uppercase">{plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-6xl font-black tracking-tighter">{plan.price}</span>
                      <span className="text-sm sm:text-base text-zinc-500 font-bold">/m</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 mb-8 sm:mb-10 space-y-4 sm:space-y-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold">
                        <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${plan.popular ? 'text-emerald-600' : 'text-emerald-500 dark:text-emerald-400'}`} />
                        <span className={plan.popular ? 'text-zinc-800' : 'text-zinc-600 dark:text-zinc-400'}>{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/register?plan=${plan.id}`}
                    className={cn(buttonVariants({ variant: plan.popular ? 'default' : 'secondary' }), `flex items-center justify-center w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black transition-all mt-auto hover:scale-105 ${
                      plan.popular 
                        ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xl' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    }`)}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section – with animated background on open */}
        <section id="faq" className="py-16 md:py-32 bg-background">
          <div className="container max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/3">
                <h2 className="text-emerald-600 dark:text-emerald-500 font-black tracking-widest uppercase mb-4 md:mb-6 text-xs sm:text-sm">Support</h2>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none mb-4 md:mb-8 text-zinc-900 dark:text-white text-balance">Common Questions.</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-balance">Everything you need to know about the ForkStack engine.</p>
              </div>
              <div className="md:w-2/3">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    { q: "How fast is deployment?", a: "VENUES CAN GO LIVE IN LESS THAN 24 HOURS. OUR AUTOMATED ONBOARDING SUITE HANDLES THE HEAVY LIFTING." },
                    { q: "Custom branding support?", a: "YES. PRO AND ENTERPRISE PLANS SUPPORT FULL WHITE-LABELING AND CUSTOM DOMAIN MAPPING." },
                    { q: "Hardware requirements?", a: "FORKSTACK IS 100% CLOUD-BASED. ANY WEB-ENABLED DEVICE CAN RUN THE FULL SUITE." }
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl sm:rounded-3xl px-4 sm:px-8 bg-zinc-50 dark:bg-muted/30 border-zinc-200 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-emerald-500/50 group">
                      <AccordionTrigger className="text-left font-black text-lg sm:text-xl hover:no-underline py-4 sm:py-8 text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-500 dark:text-muted-foreground text-sm sm:text-lg pb-4 sm:pb-8 leading-relaxed font-bold">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section – with pulsating background and floating shapes */}
        <section className="py-16 md:py-32 bg-emerald-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay rotate-12 scale-150 animate-[spin_30s_linear_infinite]" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-float-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="container text-center relative z-10 px-4">
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-zinc-950 tracking-tighter mb-8 md:mb-12 text-balance leading-tight animate-[fade-in-up_0.8s_ease-out]">
              Ready To Upgrade <br className="hidden sm:block" /> Your Business?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-[fade-in-up_0.8s_ease-out_0.2s_both]">
              <Link href="/register" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto h-16 sm:h-20 px-8 sm:px-12 rounded-full text-xl sm:text-2xl font-black bg-zinc-950 text-white hover:bg-zinc-800 shadow-3xl hover:scale-105 transition-all")}>
                Get Started Free
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 sm:h-20 px-8 sm:px-12 rounded-full text-xl sm:text-2xl font-black border-zinc-950/20 bg-white/10 hover:bg-white/20 text-zinc-900 border-2 hover:scale-105 transition-all">
                Talk To Sales
              </Button>
            </div>
          </div>
        </section>

      </main>


      {/* Footer – with social icon bounce */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pt-16 md:pt-32 pb-8 md:pb-12 border-t border-zinc-200 dark:border-white/5">
        <div className="container px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24">
            <div className="md:col-span-6 space-y-6 md:space-y-10">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-1.5 md:p-2 rounded-xl group">
                  <ChefHat className="h-5 w-5 md:h-6 md:w-6 text-zinc-950 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-2xl md:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">ForkStack</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-500 text-lg md:text-2xl max-w-md font-bold leading-snug md:leading-tight">
                Engineering the next decade of hospitality infrastructure.
              </p>
              <div className="flex gap-3 md:gap-4">
                {['twitter', 'github', 'linkedin', 'instagram'].map((social) => (
                  <div key={social} className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-zinc-950 transition-all cursor-pointer group text-zinc-600 dark:text-white hover:scale-110">
                    <Zap className="h-4 w-4 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              <h6 className="font-black mb-6 md:mb-10 text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] text-[10px] md:text-xs">Engine</h6>
              <ul className="space-y-4 md:space-y-6 text-zinc-600 dark:text-zinc-400 font-bold text-sm md:text-lg">
                <li><Link href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Pricing</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">API System</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">White-label</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h6 className="font-black mb-6 md:mb-10 text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] text-[10px] md:text-xs">Mission</h6>
              <ul className="space-y-4 md:space-y-6 text-zinc-600 dark:text-zinc-400 font-bold text-sm md:text-lg">
                <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Documentation</Link></li>
                <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Security</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">Terms and Conditions</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 md:pt-12 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-center md:text-left">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">
              &copy; {new Date().getFullYear()} FORKSTACK LABS INC. OPERATING SYSTEM FOR HOSPITALITY.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-10 text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Terms and Conditions</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">System Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}