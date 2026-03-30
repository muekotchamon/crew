"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { scrDesignClass, useDesignVariant } from "./DesignThemeContext";
import type { CrewEntryPayload } from "./crewTypes";

export type { CrewEntryPayload };

type EmployeeOption = { id: string; name: string; subtitle?: string };

const DEFAULT_EMPLOYEES: EmployeeOption[] = [
  { id: "ks", name: "Kotchamon Saingpairoa", subtitle: "Roofing" },
  { id: "1", name: "David Kenyon", subtitle: "Lead electrician" },
  { id: "2", name: "Joshua Minter", subtitle: "Journeyman" },
  { id: "3", name: "Alex Chen", subtitle: "Apprentice" },
  { id: "4", name: "Taylor Brooks", subtitle: "Safety" },
];

const SERVICE_TYPES = [
  "Roofing",
  "Installation",
  "Maintenance",
  "Emergency response",
  "Inspection",
  "Demolition prep",
];

type AddCrewModalProps = {
  show: boolean;
  onClose: () => void;
  onAdd: (entry: CrewEntryPayload) => void;
  employees?: EmployeeOption[];
};

export default function AddCrewModal({
  show,
  onClose,
  onAdd,
  employees = DEFAULT_EMPLOYEES,
}: AddCrewModalProps) {
  const design = useDesignVariant();
  const dClass = scrDesignClass(design);
  const titleId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);
  const [serviceType, setServiceType] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!employeeOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setEmployeeOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [employeeOpen]);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const canSubmit = serviceType.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({
      id: `crew-${Date.now()}`,
      employeeName: selectedEmployee?.name ?? "",
      serviceType,
    });
    onClose();
  }

  if (!show) return null;

  return (
    <>
      <div
        className={`modal-backdrop fade show scr-modal-backdrop ${dClass}`}
        aria-hidden
        onClick={onClose}
      />
      <div
        className={`modal fade show d-block scr-modal-root ${dClass}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-dialog modal-dialog-centered modal-md px-2">
          <div className="modal-content scr-modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-4 px-4">
              <h2 className="modal-title h5 fw-semibold mb-0" id={titleId} style={{ color: "var(--scr-slate-800)" }}>
                Add Crew
              </h2>
              <button
                type="button"
                className="btn-close scr-modal-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 pt-3 pb-2">
                <div className="mb-4">
                  <label className="form-label small fw-medium mb-2" style={{ color: "var(--scr-slate-700)" }}>
                    Employee / Team Member
                  </label>
                  <div className="position-relative" ref={wrapRef}>
                    <div
                      className={`scr-search-select form-control d-flex align-items-stretch p-0 overflow-hidden ${employeeOpen ? "scr-search-select-open" : ""}`}
                      role="combobox"
                      aria-expanded={employeeOpen}
                      aria-controls={listboxId}
                      aria-haspopup="listbox"
                    >
                      <input
                        type="text"
                        className="form-control border-0 shadow-none scr-search-select-input"
                        placeholder="Search employee..."
                        value={employeeOpen ? query : selectedEmployee?.name ?? query}
                        onChange={(ev) => {
                          setQuery(ev.target.value);
                          setSelectedEmployee(null);
                          setEmployeeOpen(true);
                        }}
                        onFocus={() => setEmployeeOpen(true)}
                        aria-autocomplete="list"
                        autoComplete="off"
                      />
                      <div className="scr-search-select-divider" aria-hidden />
                      <button
                        type="button"
                        className="scr-search-select-chevron btn border-0 rounded-0 d-flex align-items-center justify-content-center px-3"
                        aria-label="Toggle employee list"
                        onClick={() => setEmployeeOpen((o) => !o)}
                      >
                        <i className="bi bi-chevron-down small text-secondary" />
                      </button>
                    </div>
                    {employeeOpen && (
                      <ul
                        id={listboxId}
                        className="list-unstyled scr-search-select-menu mb-0"
                        role="listbox"
                      >
                        {filtered.length === 0 ? (
                          <li className="px-3 py-2 small text-secondary">No matches</li>
                        ) : (
                          filtered.map((emp) => (
                            <li key={emp.id}>
                              <button
                                type="button"
                                className="scr-search-select-option w-100 text-start"
                                role="option"
                                aria-selected={selectedEmployee?.id === emp.id}
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  setQuery(emp.name);
                                  setEmployeeOpen(false);
                                }}
                              >
                                <span className="fw-medium d-block" style={{ color: "var(--scr-slate-900)" }}>
                                  {emp.name}
                                </span>
                                {emp.subtitle && (
                                  <span className="small text-secondary">{emp.subtitle}</span>
                                )}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <label
                    className="form-label small fw-medium mb-2"
                    htmlFor="add-crew-service-type"
                    style={{ color: "var(--scr-slate-700)" }}
                  >
                    Service Type
                    <span className="text-danger ms-1" aria-hidden>
                      *
                    </span>
                  </label>
                  <select
                    id="add-crew-service-type"
                    className="form-select scr-service-select"
                    value={serviceType}
                    onChange={(ev) => setServiceType(ev.target.value)}
                    aria-required="true"
                  >
                    <option value="">Select service type...</option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 pb-4 px-4 gap-2">
                <button
                  type="button"
                  className="btn scr-modal-btn-cancel rounded-3 px-4"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn scr-modal-btn-add rounded-3 px-4 fw-semibold"
                  disabled={!canSubmit}
                >
                  Add Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
