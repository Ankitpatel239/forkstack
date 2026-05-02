import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { 
  getVendorByUserId, 
  getTiffinItems, 
  getTiffinSessions, 
  getTiffinInclusions, 
  getTiffinAreas,
  getTiffinDietTypes,
  getTiffinSpiceLevels
} from '@/app/actions/tiffin';
import MastersClient from './MastersClient';

export default async function TiffinSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const vendor = await getVendorByUserId(user.id);
  if (!vendor) return <div className="p-10 text-center font-bold">Vendor profile not found.</div>;

  const [items, sessions, inclusions, areas, dietTypes, spiceLevels] = await Promise.all([
    getTiffinItems(vendor.id),
    getTiffinSessions(vendor.id),
    getTiffinInclusions(vendor.id),
    getTiffinAreas(vendor.id),
    getTiffinDietTypes(vendor.id),
    getTiffinSpiceLevels(vendor.id),
  ]);

  return (
    <MastersClient 
      vendorId={vendor.id} 
      initialItems={items}
      initialSessions={sessions}
      initialInclusions={inclusions}
      initialAreas={areas}
      initialDietTypes={dietTypes}
      initialSpiceLevels={spiceLevels}
    />
  );
}
