'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When pathname or searchParams change, we start the loading animation
    // Since we don't have access to transition start events, we simulate a fast progress bar
    setLoading(true);
    setProgress(30);

    const timer = setTimeout(() => {
      setProgress(100);
      const finishTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(finishTimer);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
      <Progress 
        value={progress} 
        className="h-[3px] rounded-none bg-transparent" 
      />
      {/* Subtle Glow */}
      <div 
        className="absolute top-0 h-[3px] bg-emerald-500 shadow-[0_0_10px_#10b981,0_0_5px_#10b981] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
