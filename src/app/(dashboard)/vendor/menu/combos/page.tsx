import { getCombos, getMenuItems } from "@/app/actions/menu";
import CombosClientPage from "./CombosClientPage";

export default async function Page() {
  const [combos, menuItems] = await Promise.all([
    getCombos(),
    getMenuItems()
  ]);
  return <CombosClientPage initialCombos={combos} menuItems={menuItems} />;
}
