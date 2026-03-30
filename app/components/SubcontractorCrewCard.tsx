"use client";

import type { CrewEntry, CrewWorkItem } from "./crewTypes";

type Props = {
  crew: CrewEntry;
  layout?: "d1" | "d2" | "d3";
  onAddWork: (crewId: string) => void;
  onEditWork: (crewId: string, item: CrewWorkItem) => void;
  onDeleteWork: (crewId: string, workId: string) => void;
  /** Opens the same Subcontractor Compensation Agreement preview as Documents */
  onOpenCompensationPreview?: () => void;
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
}: Props) {
  const displayName = crew.employeeName || "Unnamed subcontractor";
  const showCompensationPdfIcon = layout === "d2" && crewHasAgreementLines(crew);

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
          {showCompensationPdfIcon && onOpenCompensationPreview ? (
            <button
              type="button"
              className="scr-d2-crew-pdf-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-2 border"
              title="Preview Subcontractor Compensation Agreement (same as Documents)"
              aria-label="Preview Subcontractor Compensation Agreement PDF"
              onClick={() => onOpenCompensationPreview()}
            >
              <i className="bi bi-file-earmark-pdf" aria-hidden />
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

      <div className="table-responsive rounded-3 border">
        <table className="table table-hover align-middle mb-0 scr-work-table">
          <thead>
            <tr>
              <th scope="col" className="ps-3">
                Service
              </th>
              <th scope="col">Description</th>
              <th scope="col" className="text-center">
                Install/QTY
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
    </div>
  );
}
