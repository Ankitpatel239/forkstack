import { requireVendor } from '@/lib/vendor';
import { getSocialAccounts, getMarketingPosts } from '@/app/actions/marketing';
import { MarketingClientPage } from './MarketingClientPage';

export const metadata = {
  title: 'Marketing & Social | Vendor Dashboard',
  description: 'Manage your social media marketing and posts.',
};

export default async function MarketingPage() {
  await requireVendor();
  
  const [accounts, posts] = await Promise.all([
    getSocialAccounts(),
    getMarketingPosts()
  ]);

  return (
    <MarketingClientPage 
      initialAccounts={accounts} 
      initialPosts={posts} 
    />
  );
}
