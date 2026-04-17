import { getOffers } from "@/app/actions/menu";
import OffersClientPage from "./OffersClientPage";

export default async function Page() {
  const offers = await getOffers();
  return <OffersClientPage initialOffers={offers} />;
}
