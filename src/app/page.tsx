
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { 
  Smartphone, 
  MessageCircle, 
  Package, 
  Users, 
  CreditCard, 
  BarChart3,
  QrCode,
  Gift,
  Clock,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronDown,
  ChefHat
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const features = [
    {
      icon: <QrCode className="h-10 w-10 text-emerald-500" />,
      title: "QR Table Ordering",
      description: "Customers scan, order, and pay from their phones. Zero contact, faster service, and higher table turnover.",
      badge: "Contactless"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-emerald-500" />,
      title: "WhatsApp Integration",
      description: "Send automated order updates, promotions, and instant support using your own business number.",
      badge: "24/7 Support"
    },
    {
      icon: <Package className="h-10 w-10 text-emerald-500" />,
      title: "Inventory & Combos",
      description: "Track stock levels in real-time. Create complex combo deals that automatically deduct ingredients.",
      badge: "Smart Sync"
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-500" />,
      title: "Staff Management",
      description: "Manage shifts, roles, and performance. Simple attendance tracking and automated payroll reports.",
      badge: "Multi-role"
    },
    {
      icon: <CreditCard className="h-10 w-10 text-emerald-500" />,
      title: "Hybrid Payments",
      description: "Seamlessly handle cash, credit cards, and digital wallets with instant reconciliation.",
      badge: "Secure"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-emerald-500" />,
      title: "Advanced Analytics",
      description: "Deep insights into sales trends, busy hours, and customer retention metrics.",
      badge: "Growth"
    },
    {
      icon: <Gift className="h-10 w-10 text-emerald-500" />,
      title: "Loyalty & Rewards",
      description: "Launch points-based loyalty programs and targeted discount campaigns easily.",
      badge: "Retention"
    },
    {
      icon: <Globe className="h-10 w-10 text-emerald-500" />,
      title: "Branded Experience",
      description: "Custom domains and white-labeled ordering pages that keep your brand front and center.",
      badge: "Professional"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, Green Leaf Cafe",
      content: "ForkStack transformed how we handle peak hours. Our order speed increased by 40% using the QR ordering system.",
      avatar: "SC",
      stars: 5
    },
    {
      name: "Marcus Miller",
      role: "Manager, The Grill House",
      content: "The inventory management is a lifesaver. No more 'out of stock' surprises in the middle of a busy Friday night.",
      avatar: "MM",
      stars: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Owner, Sip & Savor",
      content: "Finally, a platform that understands what small restaurant owners actually need. The support is top-notch.",
      avatar: "ER",
      stars: 5
    }
  ];

  const faqs = [
    {
      question: "How long does it take to set up?",
      answer: "Most venues are up and running in less than 24 hours. You can upload your menu and print QR codes immediately after sign-up."
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes! While we provide a free subdomain (yourbrand.forkstack.com), Pro and Enterprise plans support fully custom domains."
    },
    {
      question: "Does it work with my existing hardware?",
      answer: "Absolutely. Our platform is cloud-based and works on any tablet, smartphone, or laptop. No expensive specialized hardware is required."
    },
    {
      question: "What about payment processing fees?",
      answer: "We don't take a cut of your transactions. You only pay for your monthly subscription and any fees charged by your chosen payment gateway."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Essential tools for small cafes and boutiques",
      features: ["1 location", "5 staff members", "QR Ordering", "Daily Reports", "Email Support"],
      buttonText: "Start Trial",
      popular: false
    },
    {
      name: "Growing",
      price: "$79",
      period: "/month",
      description: "Power tools for busy restaurants & bars",
      features: ["3 locations", "Unlimited staff", "WhatsApp Integration", "Inventory Control", "Loyalty Programs", "Priority Support"],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Maximum scale for enterprise chains",
      features: ["Unlimited locations", "Custom API Access", "Dedicated Manager", "White-label Branding", "SLA Guarantee", "On-site Training"],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <ChefHat className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ForkStack
            </span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Method</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}>
                <Button className="rounded-full px-6">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-sm font-medium">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-6 shadow-lg shadow-emerald-500/20">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none text-[10px] h-5">NEW</Badge>
            <span className="text-xs font-semibold text-emerald-500">Multilingual Menu Support is Here</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            The Operating System <br className="hidden md:block" />
            for Modern Venues
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            From QR ordering to deep inventory analytics. ForkStack gives you the tools to automate your operations and delight your customers, all in one elegant platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-emerald-500/20 group">
                Get Started Free 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg">
                View All Features
              </Button>
            </Link>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-2xl -z-10" />
            <div className="rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="w-full aspect-video object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border/50 bg-muted/20">
        <div className="container">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
            Trusted by Forward-Thinking Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-bold text-xl"><Globe className="h-6 w-6" /> GLOBAL EATS</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6" /> FLASH COFFEE</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Award className="h-6 w-6" /> PRIME DINER</div>
             <div className="flex items-center gap-2 font-bold text-xl"><TrendingUp className="h-6 w-6" /> GROWTH FOODS</div>
             <div className="flex items-center gap-2 font-bold text-xl"><CheckCircle2 className="h-6 w-6" /> PURE BITES</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Core Platform</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for scale, designed for speed.</h3>
            <p className="text-lg text-muted-foreground">
              We've obsessed over every detail to ensure your staff spends less time on screens and more time with customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {features.map((feature: any, index: number) => (
              <div key={index} className="group relative transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-zinc-950">
                  {feature.icon}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-xl font-bold">{feature.title}</h4>
                  <Badge variant="outline" className="text-[10px] h-5 py-0 px-2 font-medium border-emerald-500/20 text-emerald-500">{feature.badge}</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] -z-10" />
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">The Process</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Go live in hours, not weeks.</h3>
              
              <div className="space-y-8">
                {[
                  { title: "Onboard your venue", desc: "Create your profile, set your tax rates, and configure your branded subdomain in minutes." },
                  { title: "Define your menu", desc: "Our intuitive builder lets you create complex items, options, and categories with zero friction." },
                  { title: "Deploy QR codes", desc: "Generate unique trackable QR codes for every table. Print them out and you're ready to serve." }
                ].map((step: any, i: number) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-zinc-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 shadow-3xl p-6">
                <div className="aspect-[4/5] rounded-2xl bg-zinc-800 overflow-hidden flex items-center justify-center p-8 text-zinc-500">
                  <Smartphone className="h-64 w-64 opacity-20" />
                </div>
                <div className="mt-8 flex justify-between items-center px-4">
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-zinc-800 rounded" />
                    <div className="h-2 w-24 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="container text-center">
          <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Wall of Praise</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 italic font-serif">"The partner we were missing."</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item: any, i: number) => (
              <Card key={i} className="bg-card/50 hover:bg-card transition-colors border-none shadow-xl text-left p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(item.stars)].map((_: any, s: number) => (
                    <Star key={s} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">"{item.content}"</p>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600">
                    {item.avatar}
                  </div>
                  <div>
                    <h5 className="font-bold">{item.name}</h5>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Simple Plans</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-4">Scale at your own pace.</h3>
            <p className="text-muted-foreground">Every plan starts with a 14-day full unrestricted trial. No credit card required.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan: any, idx: number) => (
              <div 
                key={idx} 
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-zinc-950 text-white scale-105 shadow-2xl ring-4 ring-emerald-500/20 z-10' 
                    : 'bg-card border border-border/50 shadow-sm hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-tighter text-zinc-950">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={plan.popular ? 'text-zinc-500' : 'text-muted-foreground'}>{plan.period}</span>
                  </div>
                  <p className={`mt-4 text-sm ${plan.popular ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>
                
                <div className="flex-1 mb-8 space-y-4">
                  {plan.features.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`h-4 w-4 ${plan.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full h-12 rounded-xl font-bold transition-all ${
                    plan.popular 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                      : 'variant-outline border-emerald-500/20'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about starting with ForkStack.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq: any, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-2xl px-6 bg-card/40 overflow-hidden">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-zinc-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-500 p-1.5 rounded-lg">
                  <ChefHat className="h-5 w-5 text-zinc-950" />
                </div>
                <span className="text-2xl font-bold tracking-tighter">ForkStack</span>
              </div>
              <p className="text-zinc-400 text-lg max-w-sm mb-8 leading-relaxed">
                Building the future of hospitality. One automated workflow at a time.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'instagram', 'facebook'].map((social: any) => (
                  <div key={social} className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-emerald-500 hover:text-zinc-950 transition-all cursor-pointer">
                    <Zap className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h6 className="font-bold mb-6 text-emerald-400 uppercase tracking-widest text-[10px]">Product</h6>
              <ul className="space-y-4 text-zinc-400 font-medium">
                <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">White-label</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">API Docs</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h6 className="font-bold mb-6 text-emerald-400 uppercase tracking-widest text-[10px]">Company</h6>
              <ul className="space-y-4 text-zinc-400 font-medium">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">About</Link></li>
                <li><Link href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Manifesto</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h6 className="font-bold mb-6 text-emerald-400 uppercase tracking-widest text-[10px]">Newsletter</h6>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Grow your business with weekly insights into venue automation.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex-grow text-sm outline-none focus:border-emerald-500 transition-colors"
                />
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 h-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} ForkStack Labs Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs font-bold text-zinc-600 uppercase tracking-tighter">
              <Link href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-zinc-100 transition-colors">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
 
