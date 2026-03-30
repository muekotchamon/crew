"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { scrDesignClass, useDesignVariant } from "./DesignThemeContext";
import type { CrewWorkItem } from "./crewTypes";

const WORK_SERVICES = [
  "Cleaning",
  "Electrical",
  "HVAC",
  "Plumbing",
  "Roofing",
  "General labor",
  "Inspection",
];

type Props = {
  show: boolean;
  onClose: () => void;
  subcontractorName: string;
  tradeBadge: string;
  initialItem: CrewWorkItem | null;
  onSubmit: (item: CrewWorkItem) => void;
};

export default function AddWorkModal({
  show,
  onClose,
  subcontractorName,
  tradeBadge,
  initialItem,
  onSubmit,
}: Props) {
  const design = useDesignVariant();
  const dClass = scrDesignClass(design);
  const titleId = useId();
  const [service, setService] = useState(() => initialItem?.service ?? "");
  const [description, setDescription] = useState(() => initialItem?.description ?? "");
  const [installQty, setInstallQty] = useState(() => initialItem?.installQty ?? 0);
  const [qty, setQty] = useState(() => (initialItem?.qty != null ? initialItem.qty : 0));

  const installCost = installQty * qty;

  const selectServices = useMemo(() => {
    if (service && !WORK_SERVICES.includes(service)) {
      return [service, ...WORK_SERVICES];
    }
    return WORK_SERVICES;
  }, [service]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [show, onClose]);

  const canSubmit = service.length > 0;
  const isEdit = initialItem != null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      id: initialItem?.id ?? `work-${Date.now()}`,
      service,
      description: description.trim(),
      installQty,
      qty: qty > 0 ? qty : null,
      installCost,
    });
    onClose();
  }

  if (!show) return null;

  const headerTitle = `${isEdit ? "Edit" : "Add"} Work — ${subcontractorName}[${tradeBadge}]`;

  return (
    <>
      <div className={`modal-backdrop fade show scr-modal-backdrop ${dClass}`} aria-hidden onClick={onClose} />
      <div
        className={`modal fade show d-block scr-modal-root ${dClass}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg px-2">
          <div className="modal-content scr-modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-4 px-4">
              <h2 className="modal-title h5 fw-semibold mb-0" id={titleId} style={{ color: "var(--scr-slate-800)" }}>
                {headerTitle}
              </h2>
              <button type="button" className="btn-close scr-modal-close" aria-label="Close" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 pt-3 pb-2">
                <div className="mb-4">
                  <label className="form-label small fw-semibold mb-2" htmlFor="add-work-service" style={{ color: "var(--scr-slate-800)" }}>
                    Service
                    <span className="text-danger ms-1" aria-hidden>
                      *
                    </span>
                  </label>
                  <select
                    id="add-work-service"
                    className="form-select scr-service-select"
                    value={service}
                    onChange={(ev) => setService(ev.target.value)}
                    aria-required="true"
                  >
                    <option value="">Select service...</option>
                    {selectServices.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold mb-2" htmlFor="add-work-desc" style={{ color: "var(--scr-slate-800)" }}>
                    Description
                  </label>
                  <input
                    id="add-work-desc"
                    type="text"
                    className="form-control scr-work-input"
                    placeholder="Enter description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold mb-2" htmlFor="add-work-install-qty" style={{ color: "var(--scr-slate-800)" }}>
                      Cost
                    </label>
                    <input
                      id="add-work-install-qty"
                      type="number"
                      min={0}
                      step={1}
                      className="form-control scr-work-input"
                      value={installQty}
                      onChange={(e) => setInstallQty(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold mb-2" htmlFor="add-work-qty" style={{ color: "var(--scr-slate-800)" }}>
                      QTY
                    </label>
                    <input
                      id="add-work-qty"
                      type="number"
                      min={0}
                      step={1}
                      className="form-control scr-work-input"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold mb-2" htmlFor="add-work-cost" style={{ color: "var(--scr-slate-800)" }}>
                      Install Cost
                    </label>
                    <div className="input-group scr-work-input-group">
                      <span className="input-group-text border-end-0 bg-light text-secondary">$</span>
                      <input
                        id="add-work-cost"
                        type="text"
                        readOnly
                        tabIndex={-1}
                        className="form-control border-start-0 scr-work-input bg-light"
                        value={installQty > 0 && qty > 0 ? installCost.toLocaleString() : ""}
                        placeholder={installQty > 0 && qty > 0 ? undefined : "—"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-2 pb-4 px-4 gap-2">
                <button type="button" className="btn scr-modal-btn-cancel rounded-3 px-4" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn scr-modal-btn-add rounded-3 px-4 fw-semibold" disabled={!canSubmit}>
                  {isEdit ? "Save" : "Add Work"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
