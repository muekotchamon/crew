import type { CrewEntry } from "../components/crewTypes";

export type CompensationTableRow = {
  product: string;
  costPerQty: number;
  qty: number;
  installationCost: number;
};

export function buildCompensationRows(crews: CrewEntry[]): CompensationTableRow[] {
  return crews.flatMap((crew) =>
    crew.workItems.map((w) => {
      const qtyDisplay =
        w.qty != null && w.qty > 0 ? w.qty : w.installQty > 0 ? w.installQty : 1;
      const costPerQty = qtyDisplay > 0 ? w.installCost / qtyDisplay : w.installCost;
      const product = [w.service, w.description].filter(Boolean).join(" — ") || "—";
      return {
        product,
        costPerQty,
        qty: qtyDisplay,
        installationCost: w.installCost,
      };
    })
  );
}
