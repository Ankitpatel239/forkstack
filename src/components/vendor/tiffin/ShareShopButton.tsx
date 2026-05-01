'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface ShareShopButtonProps {
  slug: string;
  businessName: string;
}

export function ShareShopButton({ slug, businessName }: ShareShopButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const shopUrl = `${window.location.origin}/${slug}`;
  const tiffinUrl = `${window.location.origin}/${slug}/tiffin`;

  const copyToClipboard = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(`${label} link copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName,
          text: `Check out our digital menu and tiffin service!`,
          url: tiffinUrl,
        });
      } catch (err) {
        // Fallback to copy
        copyToClipboard(tiffinUrl, "Tiffin Service");
      }
    } else {
      copyToClipboard(tiffinUrl, "Tiffin Service");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleShare}
        className="w-full justify-start gap-3 h-12 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 group"
      >
        <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" /> 
        Share Tiffin Service
      </Button>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard(shopUrl, "Main Shop")}
          className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 border-border/50 hover:bg-muted"
        >
          {copied ? <Check size={14} className="mr-2" /> : <LinkIcon size={14} className="mr-2" />}
          Copy Shop Link
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          asChild
          className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 border-border/50 hover:bg-muted"
        >
          <a href={tiffinUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} className="mr-2" />
            View Public Page
          </a>
        </Button>
      </div>
    </div>
  );
}
