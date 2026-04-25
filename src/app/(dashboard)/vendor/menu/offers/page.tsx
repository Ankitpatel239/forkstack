import { getOffers, getMenuItems } from "@/app/actions/menu";
import OffersClientPage from "./OffersClientPage";

export default async function Page() {
  const [offers, menuItems] = await Promise.all([
    getOffers(),
    getMenuItems()
  ]);
  return <OffersClientPage initialOffers={offers} menuItems={menuItems} />;
}
