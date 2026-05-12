
import { getAllInventoryItems } from '@/app/actions/admin-inventory';
import { InventoryAdminClient } from './InventoryAdminClient';

export default async function AdminInventoryPage() {
  const items = await getAllInventoryItems();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic uppercase">Master Product Catalog</h1>
          <p className="text-zinc-500 font-medium font-sans uppercase text-[10px] tracking-[0.3em]">Global oversight and control of all inventory assets across the ForkStack network.</p>
        </div>
      </div>

      <InventoryAdminClient initialItems={items} />
    </div>
  );
}
