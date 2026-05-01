'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pause, 
  Play, 
  MoreVertical,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toggleSubscriptionStatus } from '@/app/actions/tiffin';
import { TiffinSubscriptionStatus } from '@prisma/client';
import { toast } from 'sonner';

interface SubscriptionActionsProps {
  subscriptionId: string;
  currentStatus: TiffinSubscriptionStatus;
}

export function SubscriptionActions({ subscriptionId, currentStatus }: SubscriptionActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleSubscriptionStatus(subscriptionId, currentStatus);
      toast.success(`Subscription ${currentStatus === 'ACTIVE' ? 'paused' : 'resumed'} successfully`);
    } catch (error) {
      toast.error('Failed to update subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical size={18} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-border/50 backdrop-blur-xl bg-background/80">
        <DropdownMenuItem onClick={handleToggle} className="font-bold cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-500">
          {currentStatus === 'ACTIVE' ? (
            <>
              <Pause className="mr-2 h-4 w-4 text-amber-500" /> Pause Subscription
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4 text-emerald-500" /> Resume Subscription
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="font-bold cursor-pointer">
          <Edit2 className="mr-2 h-4 w-4" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem className="font-bold cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10">
          <Trash2 className="mr-2 h-4 w-4" /> Cancel Subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
