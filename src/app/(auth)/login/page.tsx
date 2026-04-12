'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChefHat, ArrowRight, Mail, Lock, Loader2, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Login Failed', { description: result.error });
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      router.push('/vendor/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
        <div className="absolute top-40 left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <ChefHat className="h-6 w-6 text-zinc-950" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">ForkStack</span>
            </Link>
            <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-500 font-medium leading-relaxed">
              Don't have a vendor account yet?{' '}
              <Link href="/register" className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                Join our network
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 h-11 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <GitBranch size={16} className="mr-2" /> Github
                </Button>
                <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 h-11 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2 grayscale opacity-50" /> Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs font-black uppercase tracking-widest leading-none">
                  <span className="bg-zinc-950 px-4 text-zinc-600">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                      Password
                    </label>
                    <Link href="/forgot-password text-xs font-bold text-emerald-500/60 hover:text-emerald-500 transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/10 group mt-4 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Sign In Now
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <p className="mt-10 text-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
            Protected by reCAPTCHA & Privacy Policy
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-zinc-900 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale mix-blend-overlay"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070"
          alt="Restaurant environment"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute bottom-20 left-20 right-20">
          <Badge className="bg-emerald-500 text-zinc-950 mb-6 font-black uppercase italic animate-bounce">Live Update</Badge>
          <h3 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-2xl">
            "ForkStack is the secret ingredient to our 20% efficiency boost."
          </h3>
          <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm">
            Chef Marco Rossi, The Italian Bistro
          </p>
        </div>
      </div>
    </div>
  );
}