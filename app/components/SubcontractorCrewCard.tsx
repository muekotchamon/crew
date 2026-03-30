"use client";

import type { CrewEntry, CrewPaymentFlags, CrewWorkItem } from "./crewTypes";

type Props = {
  crew: CrewEntry;
  layout?: "d1" | "d2" | "d3";
  onAddWork: (crewId: string) => void;
  onEditWork: (crewId: string, item: CrewWorkItem) => void;
  onDeleteWork: (crewId: string, workId: string) => void;
  /** Opens this crew’s Subcontractor Compensation Agreement PDF preview */
  onOpenCompensationPreview?: (crewId: string) => void;
  /** Opens this crew’s Waiver and Release of Lien PDF preview */
  onOpenWaiverPreview?: (crewId: string) => void;
  /** Which PDFs already have Sign online applied (persists on the card) */
  pdfSigned?: { compensation: boolean; waiver: boolean };
  paymentFlags: CrewPaymentFlags;
  onPaymentFlagChange: (key: keyof CrewPaymentFlags, checked: boolean) => void;
};

/** Work lines that would appear in the compensation agreement PDF */
function crewHasAgreementLines(crew: CrewEntry): boolean {
  return crew.workItems.some((w) => {
    const hasService = Boolean(w.service?.trim());
    const hasNumbers =
      w.installCost > 0 || w.installQty > 0 || (w.qty != null && w.qty > 0);
    return hasService && hasNumbers;
  });
}

function formatMoney(n: number) {
  if (n === 0 || Number.isNaN(n)) return "—";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SubcontractorCrewCard({
  crew,
  layout = "d1",
  onAddWork,
  onEditWork,
  onDeleteWork,
  onOpenCompensationPreview,
  onOpenWaiverPreview,
  pdfSigned,
  paymentFlags,
  onPaymentFlagChange,
}: Props) {
  const displayName = crew.employeeName || "Unnamed subcontractor";
  const showCrewPdfIcons = layout === "d2" && crewHasAgreementLines(crew);
  const showSignedRow = Boolean(pdfSigned?.compensation || pdfSigned?.waiver);
  const crewTotalCost = crew.workItems.reduce((s, w) => s + (Number(w.installCost) || 0), 0);
  const paidId = `scr-${crew.id}-paid`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const submitId = `scr-${crew.id}-submit`.replace(/[^a-zA-Z0-9_-]/g, "-");

  return (
    <div className="scr-work-crew-card scr-card p-4 mb-3">
      <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-sm-between gap-3 mb-3">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <h3 className="h6 fw-bold mb-0" style={{ color: "var(--scr-slate-900)" }}>
            {displayName}
          </h3>
          <span className="badge rounded-pill text-bg-primary fw-semibold px-2 py-1" style={{ fontSize: "0.75rem" }}>
            {crew.serviceType}
          </span>
          <span className="small fw-medium" style={{ color: "var(--scr-slate-500)" }}>
            {crew.code}
          </span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0 align-self-start">
          {showCrewPdfIcons && onOpenCompensationPreview ? (
            <button
              type="button"
              className={`scr-d2-crew-pdf-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-2 border ${pdfSigned?.compensation ? "scr-pdf-icon--signed" : ""}`}
              title={
                pdfSigned?.compensation
                  ? "Compensation PDF — signed (open to preview or re-sign)"
                  : "Preview this subcontractor’s Compensation Agreement PDF"
              }
              aria-label="Preview Subcontractor Compensation Agreement PDF for this crew"
              onClick={() => onOpenCompensationPreview(crew.id)}
            >
              <i className="bi bi-file-earmark-pdf" aria-hidden />
            </button>
          ) : null}
          {showCrewPdfIcons && onOpenWaiverPreview ? (
            <button
              type="button"
              className={`scr-d2-crew-waiver-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-2 border ${pdfSigned?.waiver ? "scr-pdf-icon--signed-waiver" : ""}`}
              title={
                pdfSigned?.waiver
                  ? "Waiver PDF — signed (open to preview or re-sign)"
                  : "Preview this subcontractor’s Waiver and Release of Lien PDF"
              }
              aria-label="Preview Waiver and Release of Lien PDF for this crew"
              onClick={() => onOpenWaiverPreview(crew.id)}
            >
              <i className="bi bi-file-earmark-text" aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-3 fw-semibold"
            onClick={() => onAddWork(crew.id)}
          >
            <i className="bi bi-plus-lg me-1" aria-hidden />
            Add Work
          </button>
        </div>
      </div>

      {showSignedRow ? (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3 pb-2 scr-crew-pdf-signed-row">
          <span
            className="small fw-bold text-uppercase flex-shrink-0"
            style={{ color: "var(--scr-slate-500)", fontSize: "0.65rem", letterSpacing: "0.06em" }}
          >
            PDF signed
          </span>
          {pdfSigned?.compensation ? (
            <span className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-1 border scr-crew-signed-badge scr-crew-signed-badge--comp">
              <i className="bi bi-check2-circle" aria-hidden />
              Compensation
            </span>
          ) : null}
          {pdfSigned?.waiver ? (
            <span className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-1 border scr-crew-signed-badge scr-crew-signed-badge--waiver">
              <i className="bi bi-check2-circle" aria-hidden />
              Waiver
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="table-responsive rounded-3 border">
        <table className="table table-hover align-middle mb-0 scr-work-table">
          <thead>
            <tr>
              <th scope="col" className="ps-3">
                Service
              </th>
              <th scope="col">Description</th>
              <th scope="col" className="text-center">
                Cost
              </th>
              <th scope="col" className="text-center">
                QTY
              </th>
              <th scope="col">Install Cost</th>
              <th scope="col" className="text-end pe-3" style={{ width: 88 }}>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {crew.workItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-secondary small py-4">
                  No work items yet. Use &quot;Add Work&quot; to add a line.
                </td>
              </tr>
            ) : (
              crew.workItems.map((w) => (
                <tr key={w.id}>
                  <td className="ps-3 fw-medium" style={{ color: "var(--scr-slate-900)" }}>
                    {w.service}
                  </td>
                  <td className="text-secondary">{w.description || "—"}</td>
                  <td className="text-center">{w.installQty}</td>
                  <td className="text-center">{w.qty ?? ""}</td>
                  <td className="fw-medium">{formatMoney(w.installCost)}</td>
                  <td className="text-end pe-2">
                    <div className="d-inline-flex align-items-center gap-0">
                      <button
                        type="button"
                        className="btn btn-link text-primary p-1 border-0"
                        title="Edit work item"
                        aria-label={`Edit ${w.service}`}
                        onClick={() => onEditWork(crew.id, w)}
                      >
                        <i className="bi bi-pencil-square" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-1 border-0"
                        title="Remove work item"
                        aria-label={`Remove ${w.service}`}
                        onClick={() => onDeleteWork(crew.id, w.id)}
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="scr-crew-card-cost-foot d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-sm-between gap-3 pt-3 mt-3 border-top border-light">
        <div className="d-flex align-items-baseline justify-content-between gap-3 min-w-0">
          <span
            className="small fw-semibold text-uppercase flex-shrink-0"
            style={{ color: "var(--scr-slate-500)", letterSpacing: "0.04em" }}
          >
            Total Cost
          </span>
          <span className="fw-bold fs-5 mb-0 text-end" style={{ color: "var(--scr-slate-900)" }}>
            $
            {crewTotalCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <fieldset className="border-0 p-0 m-0 flex-shrink-0">
          <legend className="visually-hidden">Submit and Paid flags for this crew</legend>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id={submitId}
                checked={paymentFlags.submit}
                onChange={(e) => onPaymentFlagChange("submit", e.target.checked)}
              />
              <label className="form-check-label fw-medium" htmlFor={submitId} style={{ color: "var(--scr-slate-800)" }}>
                Submit
              </label>
            </div>
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id={paidId}
                checked={paymentFlags.paid}
                onChange={(e) => onPaymentFlagChange("paid", e.target.checked)}
              />
              <label className="form-check-label fw-medium" htmlFor={paidId} style={{ color: "var(--scr-slate-800)" }}>
                Paid
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
