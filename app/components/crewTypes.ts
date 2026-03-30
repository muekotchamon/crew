export type CrewWorkItem = {
  id: string;
  service: string;
  description: string;
  installQty: number;
  qty: number | null;
  installCost: number;
};

export type CrewEntry = {
  id: string;
  employeeName: string;
  serviceType: string;
  code: string;
  workItems: CrewWorkItem[];
};

export type CrewEntryPayload = Omit<CrewEntry, "code" | "workItems">;
