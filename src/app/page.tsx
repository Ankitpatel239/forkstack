
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
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
  Layers
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-emerald-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* Session Command Bar */}
      {session?.user && (
        <div className={`w-full ${session.user.role === 'ADMIN' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-100'} py-1.5 px-6 sticky top-0 z-[100] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-colors duration-500`}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className={`h-3.5 w-3.5 ${session.user.role === 'ADMIN' ? 'animate-pulse' : 'opacity-50'}`} />
              <span>{session.user.role === 'ADMIN' ? 'Admin Engine Active' : 'Member Session Active'}</span>
            </div>
            <div className={`h-3 w-px ${session.user.role === 'ADMIN' ? 'bg-zinc-950/20' : 'bg-white/10'}`} />
            <nav className="hidden lg:flex gap-6">
              {session.user.role === 'ADMIN' ? (
                <>
                  <Link href="/admin/dashboard" className="hover:text-white transition-colors">Console</Link>
                  <Link href="/admin/vendors" className="hover:text-white transition-colors">Vendors</Link>
                  <Link href="/admin/payments" className="hover:text-white transition-colors">Revenue</Link>
                  <Link href="/admin/broadcast" className="hover:text-white transition-colors">Broadcast</Link>
                </>
              ) : (
                <>
                  <Link href="/vendor/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
                  <Link href="/vendor/inventory" className="hover:text-emerald-400 transition-colors">Inventory</Link>
                  <Link href="/vendor/orders" className="hover:text-emerald-400 transition-colors">Orders</Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden md:inline-block opacity-60 tabular-nums lowercase tracking-normal">{session.user.email} · {session.user.role}</span>
             <SignOutButton className={`${session.user.role === 'ADMIN' ? 'bg-zinc-950 text-emerald-50' : 'bg-emerald-500 text-zinc-950'} px-3 py-1 rounded-sm hover:scale-105 transition-all text-[10px] font-black uppercase`}>
               Disconnect
             </SignOutButton>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className={`sticky ${session?.user ? 'top-[34px]' : 'top-0'} z-50 w-full border-b border-white/5 glass shadow-sm transition-all duration-300`}>
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
              <ChefHat className="h-6 w-6 text-zinc-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gradient">
              ForkStack
            </span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1">
            {['Features', 'Growth', 'Pricing', 'FAQ'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}>
                <Button className="rounded-full px-8 bg-zinc-950 dark:bg-zinc-100 hover:scale-105 transition-transform">
                  Enter App
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-bold">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32">
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark border-emerald-500/20 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <Badge className="bg-emerald-500 border-none text-[10px] h-5">V2.0</Badge>
                <span className="text-xs font-bold text-emerald-400">Next-Gen POS Engine is Live</span>
              </div>
              
              <h1 className="text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl text-gradient leading-[0.9] text-balance">
                Scale Your <br /> 
                <span className="text-gradient-emerald">Venue</span> Without <br />
                The Stress.
              </h1>
              
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed text-balance">
                The high-performance operating system designed for modern hospitality. Automate ordering, sync inventory, and grow your revenue by 35% in 30 days.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-16 px-10 rounded-full text-xl font-black bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-2xl shadow-emerald-500/30 group">
                    Deploy ForkStack
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-xl font-bold glass">
                    Live Demo
                  </Button>
                </Link>
              </div>

              {/* Terminal Section / Tech Preview */}
              <div className="relative mt-20 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden shadow-3xl animate-float-slow">
                  {/* Mock Window Bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      ForkStack-Engine-Main-Dashboard
                    </div>
                    <div className="w-10" />
                  </div>
                  <img 
                    src="/dashboard/ForkStack-Engine-Main-Dashboard.png" 
                    alt="Dashboard Interface" 
                    className="w-full aspect-[16/9] object-cover opacity-80"
                  />
                  {/* Floating Action Cards */}
                  <div className="absolute bottom-8 left-8 glass p-4 rounded-2xl border-white/10 shadow-2xl hidden md:block">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Activity className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Real-time Traffic</div>
                        <div className="text-lg font-black">+142% today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker Section */}
        <section className="py-10 border-y border-white/5 bg-zinc-950 overflow-hidden">
          <div className="flex gap-16 animate-slide-infinite whitespace-nowrap items-center w-[200%]">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-16 items-center">
                 {['GLOBAL EATS', 'FLASH COFFEE', 'PRIME DINER', 'GROWTH FOODS', 'PURE BITES', 'STELIO', 'MODERN KITCHEN', 'THE GRID'].map((brand) => (
                   <span key={brand} className="text-3xl font-black text-white/20 hover:text-emerald-500 transition-colors cursor-default tracking-tighter">
                     {brand}
                   </span>
                 ))}
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 bg-zinc-950 text-zinc-100 relative">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
              <div className="max-w-2xl">
                <h2 className="text-emerald-400 font-black tracking-widest uppercase mb-6 flex items-center gap-2">
                   <div className="w-8 h-px bg-emerald-400" /> Technology Stack
                </h2>
                <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                  High-frequency <br /> infrastructure for <br /> hospitality teams.
                </h3>
              </div>
              <p className="text-zinc-400 text-xl max-w-sm pb-2">
                We've built a multi-tenant engine that scales with your ambition, not your headcount.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="group p-8 rounded-3xl border border-white/5 glass-dark transition-all hover:border-emerald-500/50 hover:bg-white/[0.02]">
                  <div className="mb-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="mb-4 bg-white/5 border-none text-zinc-400">{feature.badge}</Badge>
                  <h4 className="text-2xl font-black mb-4">{feature.title}</h4>
                  <p className="text-zinc-500 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Visual Section - NEW */}
        <section id="growth" className="py-32 relative overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div>
                  <h2 className="text-emerald-500 font-black tracking-widest uppercase mb-4">The Result</h2>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8">
                    We will grow <br /> your business <br /> like this.
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    Implementing ForkStack isn't just about changing your software; it's about upgrading your business physics.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { title: "Velocity Injection", desc: "40% faster ordering cycles from scan to kitchen.", icon: <Rocket /> },
                    { title: "Revenue Optimization", desc: "AI-driven upselling increases average order value by 22%.", icon: <TrendingUp /> },
                    { title: "Operational Zero", desc: "Reduce administrative overhead to near-zero with automated sync.", icon: <Layers /> }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-black mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="relative glass p-8 rounded-[3rem] border-white/10 shadow-3xl">
                  {/* Growth Chart Visualization */}
                  <div className="aspect-square bg-zinc-950 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-center z-10">
                      <div>
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Efficiency Multiplier</div>
                        <div className="text-4xl font-black text-white">12.4x</div>
                      </div>
                      <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center animate-bounce">
                        <TrendingUp className="h-6 w-6 text-zinc-950" />
                      </div>
                    </div>
                    {/* SVG Graph Animation */}
                    <div className="absolute top-24 left-0 right-0 h-48 opacity-60">
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
                         <style>{`
                           @keyframes dash {
                             to { stroke-dashoffset: 0; }
                           }
                         `}</style>
                       </svg>
                    </div>
                    <div className="grid grid-cols-4 gap-4 z-10">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5 flex items-end p-2 group/bar transition-all hover:bg-white/10">
                           <div 
                             className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-500 rounded-lg transition-all duration-1000" 
                             style={{ height: `${20 * i}%` }} 
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating Notification */}
                  <div className="absolute top-1/2 -right-16 glass shadow-2xl p-5 rounded-3xl border-white/10 max-w-[220px] animate-float z-20">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">New Order</div>
                        <div className="text-xs font-bold text-white leading-tight">Table 04 <br/><span className="text-zinc-500 font-medium">$142.00</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-zinc-950">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">Simple Deployment.</h3>
              <p className="text-xl text-zinc-400">Zero hidden fees. Zero transaction cuts. Just pure performance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Starter", price: "$29", features: ["1 location", "5 staff members", "QR Ordering", "Daily Reports"], popular: false },
                { name: "Growing", price: "$79", features: ["3 locations", "Unlimited staff", "WhatsApp Integration", "Inventory Control", "Loyalty Programs"], popular: true },
                { name: "Enterprise", price: "$149", features: ["Unlimited locations", "Custom API Access", "Dedicated Manager", "White-label Branding"], popular: false }
              ].map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col p-10 rounded-[3rem] transition-all duration-500 group ${
                    plan.popular 
                      ? 'bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 scale-105 shadow-[0_0_80px_rgba(16,185,129,0.2)] z-10' 
                      : 'bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-zinc-950 animate-bounce">
                      Engine Choice
                    </div>
                  )}
                  
                  <div className="mb-10">
                    <h4 className="text-2xl font-black mb-4 tracking-tighter uppercase">{plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                      <span className="text-zinc-500 font-bold">/m</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 mb-10 space-y-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm font-bold">
                        <CheckCircle2 className={`h-5 w-5 ${plan.popular ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        <span className={plan.popular ? 'text-zinc-800' : 'text-zinc-400'}>{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full h-16 rounded-2xl text-lg font-black transition-all ${
                      plan.popular 
                        ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xl' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    }`}
                  >
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32">
          <div className="container max-w-4xl">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3">
                <h2 className="text-emerald-500 font-black tracking-widest uppercase mb-6">Support</h2>
                <h3 className="text-4xl font-black tracking-tighter leading-none mb-8">Common Questions.</h3>
                <p className="text-muted-foreground">Everything you need to know about the ForkStack engine.</p>
              </div>
              <div className="md:w-2/3">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    { q: "How fast is deployment?", a: "VENUES CAN GO LIVE IN LESS THAN 24 HOURS. OUR AUTOMATED ONBOARDING SUITE HANDLES THE HEAVY LIFTING." },
                    { q: "Custom branding support?", a: "YES. PRO AND ENTERPRISE PLANS SUPPORT FULL WHITE-LABELING AND CUSTOM DOMAIN MAPPING." },
                    { q: "Hardware requirements?", a: "FORKSTACK IS 100% CLOUD-BASED. ANY WEB-ENABLED DEVICE CAN RUN THE FULL SUITE." }
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border rounded-3xl px-8 bg-muted/30 border-white/5 overflow-hidden">
                      <AccordionTrigger className="text-left font-black text-xl hover:no-underline py-8">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-lg pb-8 leading-relaxed font-bold">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-emerald-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay rotate-12 scale-150" />
          <div className="container text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-zinc-950 tracking-tighter mb-12">
              Ready To Upgrade <br /> Your Business?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button size="lg" className="h-20 px-12 rounded-full text-2xl font-black bg-zinc-950 text-white hover:bg-zinc-800 shadow-3xl">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-20 px-12 rounded-full text-2xl font-black border-zinc-950/20 bg-white/10 hover:bg-white/20 text-zinc-900 border-2">
                Talk To Sales
              </Button>
            </div>
          </div>
        </section>

      </main>


      {/* Footer */}
      <footer className="bg-zinc-950 text-white pt-32 pb-12 border-t border-white/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-6 space-y-10">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <ChefHat className="h-6 w-6 text-zinc-950" />
                </div>
                <span className="text-4xl font-black tracking-tighter">ForkStack</span>
              </div>
              <p className="text-zinc-500 text-2xl max-w-md font-bold leading-tight">
                Engineering the next decade of hospitality infrastructure.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'linkedin', 'instagram'].map((social) => (
                  <div key={social} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-zinc-950 transition-all cursor-pointer group">
                    <Zap className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h6 className="font-black mb-10 text-emerald-500 uppercase tracking-[0.2em] text-xs">Engine</h6>
              <ul className="space-y-6 text-zinc-400 font-bold text-lg">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API System</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">White-label</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h6 className="font-black mb-10 text-emerald-500 uppercase tracking-[0.2em] text-xs">Mission</h6>
              <ul className="space-y-6 text-zinc-400 font-bold text-lg">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
              &copy; {new Date().getFullYear()} FORKSTACK LABS INC. OPERATING SYSTEM FOR HOSPITALITY.
            </p>
            <div className="flex gap-10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Stack</Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Ops</Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">System Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
