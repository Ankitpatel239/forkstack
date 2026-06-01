'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, ArrowRight, User, Mail, Phone, Lock, Store, Briefcase, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'VENDOR_OWNER',
    businessName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      ...form,
      isRegister: 'true',
      redirect: false,
    });
    if (result?.error) {
      toast.error('Registration failed', { description: result.error });
    } else {
      toast.success('Success!', { description: 'Account created. Please login.' });
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex relative overflow-hidden font-sans text-zinc-900 dark:text-white transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-full -z-10 opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Left Panel: Hero/Marketing */}
      <div className="hidden lg:flex flex-col relative w-0 flex-1 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-50 dark:opacity-30 grayscale mix-blend-multiply dark:mix-blend-overlay"
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2070"
          alt="Modern restaurant kitchen"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/90 via-zinc-100/60 to-zinc-100/10 dark:from-zinc-950 dark:via-zinc-950/40 dark:to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-20 z-10">
           <Badge className="w-fit bg-emerald-500 text-zinc-950 mb-8 font-black uppercase italic animate-pulse">Platform Launch</Badge>
           <h3 className="text-6xl font-black text-zinc-900 dark:text-white leading-[1.1] mb-8">
             Everything you need <br />
             to run your <span className="text-emerald-500">empire.</span>
           </h3>
           <div className="space-y-6">
              {[
                { icon: <Store className="h-5 w-5 text-emerald-500" />, text: "QR Ordering & Table Management" },
                { icon: <Zap className="h-5 w-5 text-emerald-500" />, text: "WhatsApp Integration & Alerts" },
                { icon: <Lock className="h-5 w-5 text-emerald-500" />, text: "Secure Multi-Role Access Control" }
              ].map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300 font-bold tracking-tight">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 overflow-y-auto custom-scrollbar">
        <div className="mx-auto w-full max-w-sm lg:w-[400px] animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="mb-8 font-sans">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <ChefHat className="h-6 w-6 text-zinc-950" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">ForkStack</span>
            </Link>
            <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Start your 14-day <br />
              free trial
            </h2>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
                    placeholder="john@cafe.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
                  <input
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
                    placeholder="+1 (555) 123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Professional Role</label>
              <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-11 text-zinc-900 dark:text-zinc-100 shadow-sm">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <SelectItem value="VENDOR_OWNER">Store / Business Owner</SelectItem>
                  <SelectItem value="TEAM">Operations / Staff Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.role === 'VENDOR_OWNER' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Business Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" size={16} />
                  <input
                    name="businessName"
                    required
                    value={form.businessName}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-10 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-sm"
                    placeholder="e.g. The Morning Brew"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 group mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin text-zinc-950" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-zinc-500 text-center font-medium px-4 mt-6 leading-relaxed uppercase tracking-tighter">
              By joining, you agree to ForkStack's <Link href="/terms-and-conditions" className="underline hover:text-emerald-500 transition-colors">Terms and Conditions</Link> and <Link href="/privacy-policy" className="underline hover:text-emerald-500 transition-colors">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}