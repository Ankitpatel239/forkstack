
'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowRight, Loader2, ChefHat, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DashboardLockScreen({ onUnlock, correctPassword }: { onUnlock: () => void, correctPassword?: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate decryption
    setTimeout(() => {
      if (password === correctPassword || !correctPassword) {
         onUnlock();
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden h-screen w-screen">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      
      <div className="max-w-[400px] w-full space-y-10 animate-in fade-in zoom-in-95 duration-700">
         <div className="flex flex-col items-center gap-6">
            <div className="h-24 w-24 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl relative group-hover:scale-105 transition-transform">
               <Lock size={40} strokeWidth={1.5} />
               <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center border-4 border-zinc-950">
                  <ChefHat size={16} />
               </div>
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Node Restricted</h1>
               <div className="flex items-center justify-center gap-2 text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                  <ShieldCheck size={12} className="text-emerald-500" /> Authorized Operator Access Only
               </div>
            </div>
         </div>

         <form onSubmit={handleUnlock} className="space-y-6">
            <div className="relative group">
               <Input 
                 type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 placeholder="Enter access node key..." 
                 className={`bg-zinc-900 border-zinc-800 h-16 px-6 text-center text-xl font-black italic tracking-[0.4em] rounded-[1.5rem] focus:border-emerald-500/50 transition-all ${error ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                 required 
                 autoFocus
               />
               {loading && (
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Loader2 size={20} className="animate-spin" />
                 </div>
               )}
            </div>
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[11px] rounded-[1.25rem] shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 group"
            >
               Authorize Session <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
         </form>

         <div className="pt-12 opacity-50">
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
               Workforce Infrastructure <span className="text-emerald-500">v2.1</span>
            </p>
         </div>
      </div>
    </div>
  );
}
