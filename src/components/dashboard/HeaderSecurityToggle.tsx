
'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { updateVendorSettings } from '@/app/actions/settings';
import { toast } from 'sonner';

export function HeaderSecurityToggle({ initialLocked }: { initialLocked?: boolean }) {
  const [isLocked, setIsLocked] = useState(initialLocked ?? false);
  const [loading, setLoading] = useState(initialLocked === undefined);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/vendor/status');
        const data = await response.json();
        setIsLocked(data.isLocked);
      } catch (e) {
        console.error('Failed to sync security node');
      } finally {
        setLoading(false);
      }
    }
    if (initialLocked === undefined) fetchStatus();
  }, [initialLocked]);

  const toggleLock = async () => {
    setLoading(true);
    try {
      const newStatus = !isLocked;
      await updateVendorSettings({ isLocked: newStatus });
      setIsLocked(newStatus);
      toast.success(newStatus ? 'Web Presence Locked' : 'Web Presence Public');
    } catch (e) {
      toast.error('Failed to patch security node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleLock}
      disabled={loading}
      className={`relative p-2.5 rounded-full border transition-all group flex items-center gap-2 ${
        isLocked 
        ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/10' 
        : 'bg-muted border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30'
      }`}
      title={isLocked ? 'Unlock Website' : 'Lock Website'}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : (isLocked ? <Lock size={18} /> : <Unlock size={18} />)}
      <span className="hidden md:block text-[10px] font-black uppercase tracking-widest px-1">
        {isLocked ? 'Node Locked' : 'Public'}
      </span>
    </button>
  );
}
