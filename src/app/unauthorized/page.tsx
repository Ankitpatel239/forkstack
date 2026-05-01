'use client';

import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#000',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0' }}>403</h1>
      <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Unauthorized Access</p>
      <Link href="/" style={{ 
        marginTop: '2rem', 
        padding: '1rem 2rem', 
        background: '#10b981', 
        color: '#000', 
        borderRadius: '9999px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        Return Home
      </Link>
    </div>
  );
}
