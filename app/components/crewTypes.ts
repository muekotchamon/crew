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

/** Independent checkboxes on each crew card (both may be checked) */
export type CrewPaymentFlags = {
  submit: boolean;
  paid: boolean;
};

/** Per-crew stored signature images (data URLs) after Sign online on each PDF */
export type CrewPdfSignatures = Record<
  string,
  {
    compensationDataUrl?: string;
    waiverDataUrl?: string;
  }
>;
