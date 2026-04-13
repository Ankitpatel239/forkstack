
'use client';

import { useState } from 'react';
import { Lock, ArrowRight, Loader2, ChefHat, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LockOverlay({ vendorName, correctPassword }: { vendorName: string, correctPassword?: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Tiny delay for "authentication" feel
    setTimeout(() => {
      if (password === correctPassword || !correctPassword) {
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
      setLoading(false);
    }, 600);
  };

  if (unlocked) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      
      <div className="max-w-md w-full space-y-10 animate-in fade-in zoom-in duration-500">
         <div className="flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl relative">
               <Lock size={32} />
               <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center">
                  <ChefHat size={14} />
               </div>
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{vendorName}</h1>
               <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldAlert size={12} className="text-orange-500" /> Administrative Lock Active
               </div>
            </div>
         </div>

         <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative group">
               <Input 
                 type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 placeholder="Enter access code..." 
                 className={`bg-zinc-900/50 border-zinc-800 h-16 px-6 text-center text-xl font-black italic tracking-[0.5em] rounded-2xl focus:border-emerald-500/50 transition-all ${error ? 'border-red-500 shake animate-bounce' : ''}`}
                 required 
               />
               {loading && (
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Loader2 size={18} className="animate-spin" />
                 </div>
               )}
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Only authorized personnel may enter this node.</p>
            <Button 
              type="submit"
              className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all active:scale-95 mt-4"
            >
               Unlock Web Presence <ArrowRight size={16} className="ml-2" />
            </Button>
         </form>

         <div className="pt-10">
            <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.3em]">
               Powered by <span className="text-zinc-600">ForkStack Ops</span>
            </p>
         </div>
      </div>
    </div>
  );
}
