
import { Loader2, Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* Animated Loader Container */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          {/* Rotating Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" style={{ animationDuration: '0.6s' }} />
          
          {/* Inner Pulsing Ring */}
          <div className="absolute inset-3 rounded-2xl border border-emerald-500/10 animate-pulse" />
          
          {/* Central Logo/Icon */}
          <Zap className="h-8 w-8 text-emerald-500 animate-float shadow-2xl shadow-emerald-500/50" />
        </div>

        {/* Textual Feedback */}
        <div className="mt-10 space-y-2 text-center">
          <h2 className="text-xl font-black text-white uppercase italic tracking-[0.3em] ml-[0.3em] animate-pulse">
            ForkStack
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-zinc-800" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-[0.5em]">
              Initializing System
            </p>
            <div className="h-[1px] w-8 bg-zinc-800" />
          </div>
        </div>

        {/* Progress Dots */}
        <div className="mt-8 flex gap-1.5">
          <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce" />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
           Quantum Distribution Layer v2.0.4
         </span>
      </div>
    </div>
  );
}
