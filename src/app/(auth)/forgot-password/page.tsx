'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
        <div className="absolute top-40 left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <ChefHat className="h-6 w-6 text-zinc-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">ForkStack</span>
          </Link>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-8 md:p-10 shadow-2xl">
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-white mb-2">Password Recovery</h2>
                <p className="text-zinc-500 text-sm font-medium">
                  Enter your email and we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-10 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Check your inbox</h2>
              <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
                If an account exists for <span className="text-white font-bold">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-10 px-6 text-[10px] font-black uppercase tracking-widest"
              >
                Resend Email
              </Button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <Link href="/login" className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">
              <ArrowLeft size={14} className="mr-2" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
