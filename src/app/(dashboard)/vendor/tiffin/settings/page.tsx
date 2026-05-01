import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getVendorByUserId, getVendorTiffinSettings } from '@/app/actions/tiffin';
import SettingsClient from './SettingsClient';

export default async function TiffinSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getVendorByUserId(user.id);
  if (!vendor) return <div className="p-10 text-center font-bold">Vendor profile not found.</div>;

  const settings = await getVendorTiffinSettings(vendor.id);

  return (
    <SettingsClient 
      initialSettings={settings} 
      vendorId={vendor.id} 
    />
  );
}
