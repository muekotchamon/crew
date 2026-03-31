import type { CrewEntry } from "../components/crewTypes";

export type CompensationTableRow = {
  product: string;
  costPerQty: number;
  qty: number;
  installationCost: number;
};

function rowFromWorkItem(w: CrewEntry["workItems"][number]): CompensationTableRow {
  const qtyDisplay =
    w.qty != null && w.qty > 0 ? w.qty : w.installQty > 0 ? w.installQty : 1;
  const costPerQty = qtyDisplay > 0 ? w.installCost / qtyDisplay : w.installCost;
  const product = w.description?.trim() || "—";
  return {
    product,
    costPerQty,
    qty: qtyDisplay,
    installationCost: w.installCost,
  };
}

/** Table rows for one subcontractor only (their PDF agreement). */
export function buildCompensationRowsForCrew(crew: CrewEntry): CompensationTableRow[] {
  return crew.workItems.map(rowFromWorkItem);
}

export function buildCompensationRows(crews: CrewEntry[]): CompensationTableRow[] {
  return crews.flatMap((crew) => crew.workItems.map(rowFromWorkItem));
}
