'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function UnauthorizedActions() {
  return (
    <Button 
      variant="ghost" 
      onClick={() => window.history.back()}
      className="transition-all hover:bg-muted/50"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  );
}
