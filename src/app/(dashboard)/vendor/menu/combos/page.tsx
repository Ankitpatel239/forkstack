import { getCombos } from "@/app/actions/menu";
import CombosClientPage from "./CombosClientPage";

export default async function Page() {
  const combos = await getCombos();
  return <CombosClientPage initialCombos={combos} />;
}
