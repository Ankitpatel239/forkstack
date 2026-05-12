'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportLedgerButtonProps {
  payments: any[];
  payouts: any[];
  subscriptionPayments: any[];
}

export function ExportLedgerButton({ payments, payouts, subscriptionPayments }: ExportLedgerButtonProps) {
  const handleExport = () => {
    const csvRows = [];
    
    // Header
    csvRows.push(['Type', 'Category', 'Date', 'Amount (INR)', 'Status', 'Reference / ID', 'Details / Period']);
    
    // Add Payments (Revenue)
    payments.forEach(p => {
      csvRows.push([
        'INCOME',
        'CUSTOMER_PAYMENT',
        new Date(p.createdAt).toLocaleDateString(),
        p.amount,
        p.status,
        p.id,
        p.method || 'DIRECT'
      ]);
    });
    
    // Add Payouts (Withdrawals)
    payouts.forEach(p => {
      csvRows.push([
        'EXPENSE',
        'VENDOR_PAYOUT',
        new Date(p.requestedAt).toLocaleDateString(),
        p.amount,
        p.status,
        p.id,
        p.bankDetails ? 'BANK_TRANSFER' : 'SETTLEMENT'
      ]);
    });
    
    // Add Subscriptions (Costs)
    subscriptionPayments.forEach(p => {
      const period = p.startDate && p.endDate 
        ? `${new Date(p.startDate).toLocaleDateString()} to ${new Date(p.endDate).toLocaleDateString()}`
        : 'N/A';
        
      csvRows.push([
        'EXPENSE',
        'PLATFORM_SUBSCRIPTION',
        new Date(p.createdAt).toLocaleDateString(),
        p.amount,
        'SUCCESS',
        p.id,
        `${p.plan} (${period})`
      ]);
    });
    
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={handleExport}
      variant="outline" 
      className="rounded-xl border-zinc-800 bg-zinc-900 h-12 px-6 text-zinc-400 font-black uppercase tracking-widest text-[10px]"
    >
      <Download className="w-4 h-4 mr-2" /> Export Ledger
    </Button>
  );
}
