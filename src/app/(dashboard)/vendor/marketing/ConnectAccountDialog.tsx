'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Share2 } from 'lucide-react';

export function ConnectAccountDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {

  const handleConnect = () => {
    // Redirect to our Next.js API route that handles Facebook OAuth
    window.location.href = '/api/marketing/facebook';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] sm:max-w-[450px] rounded-3xl p-6 sm:p-8">
        <DialogHeader className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-4">
             <LinkIcon size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Connect Meta Accounts</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium font-sans mt-2">
            Securely link your Facebook Pages and Instagram Business accounts in one click. We will automatically fetch all pages you grant access to.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4 flex flex-col items-center">
           <Button 
             onClick={handleConnect}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[12px] h-14 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
           >
             <Share2 size={18} />
             Connect with Facebook
           </Button>
           <p className="text-[10px] text-zinc-400 font-medium mt-4 text-center">
             By connecting, you allow ForkStack to publish posts on your behalf. You can disconnect at any time.
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
