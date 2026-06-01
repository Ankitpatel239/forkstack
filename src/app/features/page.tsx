import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, QrCode, Smartphone, Users, BarChart3, Store, ArrowRight, Zap, Shield, CheckCircle2 } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: "QR Code Ordering",
      description: "Let customers order and pay directly from their tables using their smartphones. Increase table turnover and reduce wait times.",
      icon: <QrCode className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Kitchen Display System (KDS)",
      description: "Send orders straight to the kitchen. Organize tickets, track prep times, and never lose a paper ticket again.",
      icon: <Smartphone className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Staff Management",
      description: "Create distinct roles (Admin, Manager, Staff), track shifts, and manage permissions securely across all your locations.",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Real-time Analytics",
      description: "Track sales, popular items, and staff performance in real-time. Make data-driven decisions to grow your revenue.",
      icon: <BarChart3 className="h-8 w-8 text-rose-500" />,
      color: "bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Multi-location Support",
      description: "Manage multiple branches from a single dashboard. Synchronize menus, prices, and settings instantly.",
      icon: <Store className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "WhatsApp Integration",
      description: "Automate order confirmations and delivery updates directly to your customers' WhatsApp.",
      icon: <Zap className="h-8 w-8 text-cyan-500" />,
      color: "bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-white/5 bg-background/80 backdrop-blur-xl shadow-sm z-50 sticky top-0">
        <div className="container px-4 md:px-8 flex h-20 items-center justify-between mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <ChefHat className="h-6 w-6 text-zinc-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              ForkStack
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-bold hover:text-emerald-500 transition-colors">
              Log In
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-xl shadow-emerald-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors mb-8 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
            Everything You Need
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Powerful features to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">run your empire.</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ForkStack replaces your messy stack of disconnected apps with a single, lightning-fast platform designed exclusively for modern restaurants.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-extrabold mb-4">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-32 max-w-5xl mx-auto bg-zinc-950 dark:bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-50" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to upgrade your restaurant?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join hundreds of restaurants already using ForkStack to save time, increase revenue, and delight customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-lg font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                  Start Your Free Trial <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="h-14 px-8 rounded-full bg-transparent border-zinc-700 text-white hover:text-white hover:bg-zinc-800 text-lg font-bold">
                  Explore Directory
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-sm font-bold text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> No Credit Card</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 14-Day Trial</span>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-8 text-center text-zinc-500 font-medium text-sm mt-20 border-t border-zinc-200 dark:border-zinc-900">
        <p>© {new Date().getFullYear()} ForkStack. All rights reserved.</p>
      </footer>
    </div>
  );
}
