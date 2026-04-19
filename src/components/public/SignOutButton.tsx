
'use client';

import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';

export function SignOutButton({ className, children }: { className?: string, children: ReactNode }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
