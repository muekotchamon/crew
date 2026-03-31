import type { CrewEntry, CrewPaymentFlags, CrewPdfSignatures } from "../components/crewTypes";

export type PaymentTimelineEventKind = "sign-comp" | "sign-waiver" | "submit" | "paid";

export type PaymentTimelineEvent = {
  id: string;
  kind: PaymentTimelineEventKind;
  at: string;
  crewLabel: string;
  title: string;
};

const KIND_TITLE: Record<PaymentTimelineEventKind, string> = {
  "sign-comp": "Sign — Compensation",
  "sign-waiver": "Sign — Waiver",
  submit: "Submit",
  paid: "Paid",
};

/** Newest first */
export function buildPaymentTimeline(
  crews: CrewEntry[],
  crewPaymentFlags: Record<string, CrewPaymentFlags>,
  crewPdfSignatures: CrewPdfSignatures
): PaymentTimelineEvent[] {
  const events: PaymentTimelineEvent[] = [];

  for (const crew of crews) {
    const crewLabel = crew.employeeName?.trim() || crew.code || "Crew";
    const flags = crewPaymentFlags[crew.id];
    if (flags?.submit && flags.submitAt) {
      events.push({
        id: `submit-${crew.id}-${flags.submitAt}`,
        kind: "submit",
        at: flags.submitAt,
        crewLabel,
        title: KIND_TITLE.submit,
      });
    }
    if (flags?.paid && flags.paidAt) {
      events.push({
        id: `paid-${crew.id}-${flags.paidAt}`,
        kind: "paid",
        at: flags.paidAt,
        crewLabel,
        title: KIND_TITLE.paid,
      });
    }
    const sig = crewPdfSignatures[crew.id];
    if (sig?.compensationDataUrl && sig.compensationSignedAt) {
      events.push({
        id: `sign-comp-${crew.id}-${sig.compensationSignedAt}`,
        kind: "sign-comp",
        at: sig.compensationSignedAt,
        crewLabel,
        title: KIND_TITLE["sign-comp"],
      });
    }
    if (sig?.waiverDataUrl && sig.waiverSignedAt) {
      events.push({
        id: `sign-waiver-${crew.id}-${sig.waiverSignedAt}`,
        kind: "sign-waiver",
        at: sig.waiverSignedAt,
        crewLabel,
        title: KIND_TITLE["sign-waiver"],
      });
    }
  }

  events.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return events;
}

/** US Eastern (handles EST/EDT). Change if you need another US zone (e.g. America/Los_Angeles). */
export const TIMELINE_US_TIMEZONE = "America/New_York" as const;

/** Format stored ISO instant for display in US English + US Eastern time. */
export function formatTimelineDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    timeZone: TIMELINE_US_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
