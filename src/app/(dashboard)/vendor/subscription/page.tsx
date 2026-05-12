
import { getVendorSubscription, getAvailablePlans } from '@/app/actions/vendor-subscription';
import { SubscriptionClient } from './SubscriptionClient';
import { redirect } from 'next/navigation';

export default async function VendorSubscriptionPage() {
  const [vendorRes, plansRes] = await Promise.all([
    getVendorSubscription(),
    getAvailablePlans()
  ]);

  if (!vendorRes.success || !vendorRes.data) {
    redirect('/login');
  }

  return (
    <SubscriptionClient 
      currentVendor={vendorRes.data} 
      availablePlans={plansRes.data?.plans || []}
      allFeatures={plansRes.data?.features || []}
      allLimits={plansRes.data?.limits || []}
    />
  );
}
