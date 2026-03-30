"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import AddCrewModal from "./AddCrewModal";
import AddWorkModal from "./AddWorkModal";
import {
  DesignThemeProvider,
  type DesignVariant,
  scrDesignClass,
} from "./DesignThemeContext";
import DocumentsPanel from "./DocumentsPanel";
import SubcontractorCrewCard from "./SubcontractorCrewCard";
import type {
  CrewEntry,
  CrewEntryPayload,
  CrewPaymentFlags,
  CrewPdfSignatures,
  CrewWorkItem,
} from "./crewTypes";

function CrewPlaceholderIllustration() {
  return (
    <svg
      className="scr-illustration w-100"
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="crew-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="crew-ground" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" rx="16" fill="url(#crew-sky)" />
      <rect x="24" y="148" width="272" height="36" rx="8" fill="url(#crew-ground)" opacity="0.9" />
      <g opacity="0.9">
        <rect x="200" y="56" width="8" height="92" fill="#94a3b8" rx="2" />
        <rect x="168" y="72" width="72" height="6" fill="#64748b" rx="2" />
        <rect x="176" y="48" width="56" height="28" fill="#059669" opacity="0.25" rx="4" />
      </g>
      <g transform="translate(52, 88)">
        <circle cx="24" cy="20" r="14" fill="#cbd5e1" />
        <path d="M8 52 L40 52 L36 72 L12 72 Z" fill="#475569" />
        <rect x="14" y="32" width="20" height="22" rx="4" fill="#f97316" opacity="0.85" />
        <ellipse cx="24" cy="12" rx="16" ry="10" fill="#fbbf24" />
      </g>
      <g transform="translate(124, 92)">
        <circle cx="22" cy="18" r="13" fill="#cbd5e1" />
        <path d="M6 48 L38 48 L34 68 L10 68 Z" fill="#334155" />
        <rect x="12" y="30" width="20" height="20" rx="4" fill="#059669" opacity="0.9" />
        <ellipse cx="22" cy="10" rx="15" ry="9" fill="#fbbf24" />
      </g>
      <g transform="translate(196, 96)">
        <circle cx="20" cy="16" r="12" fill="#cbd5e1" />
        <path d="M6 44 L34 44 L31 62 L9 62 Z" fill="#475569" />
        <rect x="10" y="28" width="20" height="18" rx="4" fill="#64748b" />
        <ellipse cx="20" cy="8" rx="14" ry="8" fill="#fbbf24" />
      </g>
      <rect x="88" y="132" width="144" height="4" rx="2" fill="#cbd5e1" opacity="0.8" />
    </svg>
  );
}

function PersonnelAvatarMock({ variant }: { variant: 1 | 2 }) {
  if (variant === 1) {
    return (
      <svg width={44} height={44} viewBox="0 0 44 44" className="flex-shrink-0 rounded-circle" aria-hidden>
        <defs>
          <linearGradient id="pa1-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd9bd" />
            <stop offset="100%" stopColor="#e8b89a" />
          </linearGradient>
          <linearGradient id="pa1-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <circle cx={22} cy={22} r={22} fill="#f1f5f9" />
        <ellipse cx={22} cy={26} rx={14} ry={16} fill="url(#pa1-skin)" />
        <path
          d="M8 20 C8 8 36 8 36 20 L36 22 C32 14 12 14 8 22 Z"
          fill="url(#pa1-hair)"
        />
        <ellipse cx={16} cy={24} rx={2} ry={2.5} fill="#1e293b" />
        <ellipse cx={28} cy={24} rx={2} ry={2.5} fill="#1e293b" />
        <path d="M18 30 Q22 33 26 30" stroke="#c2410c" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" className="flex-shrink-0 rounded-circle" aria-hidden>
      <defs>
        <linearGradient id="pa2-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde4d0" />
          <stop offset="100%" stopColor="#e5c4a8" />
        </linearGradient>
        <linearGradient id="pa2-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <circle cx={22} cy={22} r={22} fill="#f1f5f9" />
      <ellipse cx={22} cy={26} rx={14} ry={16} fill="url(#pa2-skin)" />
      <path d="M10 18 C10 6 34 6 34 18 L34 24 C30 16 14 16 10 24 Z" fill="url(#pa2-hair)" />
      <ellipse cx={16} cy={24} rx={2} ry={2.5} fill="#422006" />
      <ellipse cx={28} cy={24} rx={2} ry={2.5} fill="#422006" />
      <path d="M17 31 Q22 34 27 31" stroke="#9a3412" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </svg>
  );
}

const PERSONNEL = [
  {
    id: "1",
    name: "David Kenyon",
    detail: "Lead electrician · on-site",
    avatarVariant: 1 as const,
  },
  {
    id: "2",
    name: "Joshua Minter",
    detail: "Journeyman · on-site",
    avatarVariant: 2 as const,
  },
];

function personnelList() {
  return PERSONNEL.map((p) => (
    <div
      key={p.id}
      className="d-flex align-items-center gap-3 flex-grow-1 flex-md-grow-0"
      style={{ minWidth: "min(100%, 260px)" }}
    >
      <div
        className="flex-shrink-0 rounded-circle overflow-hidden border border-light shadow-sm"
        style={{ width: 44, height: 44 }}
        aria-hidden
      >
        <PersonnelAvatarMock variant={p.avatarVariant} />
      </div>
      <div className="min-w-0">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-truncate" style={{ color: "var(--scr-slate-900)" }}>
            {p.name}
          </span>
          <i
            className="bi bi-check-circle-fill flex-shrink-0"
            style={{ color: "var(--scr-emerald)", fontSize: "1rem" }}
            aria-label="Assigned"
          />
        </div>
        <div className="small text-truncate" style={{ color: "var(--scr-slate-600)" }}>
          {p.detail}
        </div>
      </div>
    </div>
  ));
}

function AssignPersonnelSection({ layout }: { layout: "d1" | "d3" }) {
  if (layout === "d3") {
    return (
      <section className="scr-card scr-d3-personnel-rail p-3 p-lg-4 mb-4" aria-labelledby="scr-personnel-d3">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3">
          <div>
            <h2 className="h6 fw-bold mb-1" id="scr-personnel-d3" style={{ color: "var(--scr-slate-900)" }}>
              Assigned team
            </h2>
            <p className="small mb-0" style={{ color: "var(--scr-slate-500)" }}>
              On-site for this compensation package.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row flex-wrap gap-3 align-items-stretch">
            {personnelList()}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scr-card p-4 p-lg-4 position-relative">
      <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-4 align-items-lg-start">
        <div className="d-flex align-items-start gap-3 w-100">
          <div className="scr-step-dot done d-lg-none">
            <i className="bi bi-check-lg" aria-hidden />
          </div>
          <div className="d-none d-lg-flex position-absolute" style={{ left: -8, top: "1.35rem" }}>
            <div className="scr-step-dot done">
              <i className="bi bi-check-lg" aria-hidden />
            </div>
          </div>
          <div className="flex-grow-1 ms-lg-4">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold mb-0" style={{ color: "var(--scr-slate-900)" }}>
                Assign Personnel
              </h2>
              <span
                className="badge rounded-pill fw-semibold px-2 py-1"
                style={{
                  background: "var(--scr-emerald-soft)",
                  color: "var(--scr-emerald)",
                  fontSize: "0.7rem",
                }}
              >
                Completed
              </span>
            </div>
            <p className="small mb-3 mb-lg-4" style={{ color: "var(--scr-slate-500)" }}>
              Assigned personnel for this report.
            </p>
            <div className="d-flex flex-column flex-md-row flex-wrap gap-3">{personnelList()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

type CrewsProps = {
  crews: CrewEntry[];
  openAddCrewModal: () => void;
  openAddWorkModal: (crewId: string) => void;
  openEditWorkModal: (crewId: string, item: CrewWorkItem) => void;
  onDeleteWork: (crewId: string, workId: string) => void;
  onOpenCompensationPreview?: (crewId: string) => void;
  onOpenWaiverPreview?: (crewId: string) => void;
  crewPdfSignatures: CrewPdfSignatures;
  crewPaymentFlags: Record<string, CrewPaymentFlags>;
  setCrewPaymentFlag: (crewId: string, key: keyof CrewPaymentFlags, checked: boolean) => void;
  layout: "d1" | "d2" | "d3";
};

function CrewsSection({
  crews,
  openAddCrewModal,
  openAddWorkModal,
  openEditWorkModal,
  onDeleteWork,
  onOpenCompensationPreview,
  onOpenWaiverPreview,
  crewPdfSignatures,
  crewPaymentFlags,
  setCrewPaymentFlag,
  layout,
}: CrewsProps) {
  const isD1 = layout === "d1";
  const emptyShowsBodyAdd = layout === "d1";

  const crewsEmpty = (
    <>
      <div className={isD1 ? "py-3 py-md-4" : "py-2 py-md-3"}>
        <CrewPlaceholderIllustration />
        <p className="small mt-3 mb-0 mx-auto text-start" style={{ maxWidth: 400, color: "var(--scr-slate-500)" }}>
          No crew created yet. Add a crew to continue your compensation report.
        </p>
      </div>
      {emptyShowsBodyAdd ? (
        <div className="scr-add-crew-wrap mt-2">
          <button type="button" className="scr-add-crew-btn" onClick={openAddCrewModal}>
            <i className="bi bi-plus-lg me-2" aria-hidden />
            Add Crew
          </button>
        </div>
      ) : null}
      <p className="small mt-3 mb-0" style={{ color: "var(--scr-slate-500)" }}>
        {emptyShowsBodyAdd
          ? "You need to add at least one crew to proceed."
          : "Use Add Crew above to create your first crew."}
      </p>
    </>
  );

  const crewsFilled = (
    <div className="text-start">
      <p className="small text-success fw-semibold mb-3">
        <i className="bi bi-check2-circle me-1" />
        {crews.length} crew{crews.length > 1 ? "s" : ""} on this report
      </p>
      <div className="mb-4">
        {crews.map((c) => {
          const sig = crewPdfSignatures[c.id];
          const flags = crewPaymentFlags[c.id] ?? { submit: false, paid: false };
          return (
            <SubcontractorCrewCard
              key={c.id}
              crew={c}
              layout={layout}
              onAddWork={openAddWorkModal}
              onEditWork={openEditWorkModal}
              onDeleteWork={onDeleteWork}
              onOpenCompensationPreview={onOpenCompensationPreview}
              onOpenWaiverPreview={onOpenWaiverPreview}
              pdfSigned={{
                compensation: Boolean(sig?.compensationDataUrl),
                waiver: Boolean(sig?.waiverDataUrl),
              }}
              paymentFlags={flags}
              onPaymentFlagChange={(key, checked) => setCrewPaymentFlag(c.id, key, checked)}
            />
          );
        })}
      </div>
    </div>
  );

  const crewsMain = crews.length === 0 ? crewsEmpty : crewsFilled;

  if (layout === "d2") {
    return (
      <section className="scr-card scr-card-step-focus scr-d2-crews-panel p-4 p-lg-5 border border-2 h-100 d-flex flex-column">
        <div className="scr-d2-unified-personnel pb-4 mb-4" aria-labelledby="scr-personnel-d2">
          <div className="d-flex flex-column flex-md-row flex-md-wrap align-items-md-center justify-content-md-between gap-3">
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span
                className="scr-d2-personnel-kicker text-uppercase fw-bold small"
                style={{ color: "var(--scr-slate-500)" }}
              >
                Personnel
              </span>
              <span
                className="badge rounded-0 fw-semibold px-2 py-1"
                style={{
                  background: "var(--scr-emerald-soft)",
                  color: "var(--scr-emerald)",
                  fontSize: "0.65rem",
                }}
              >
                OK
              </span>
            </div>
            <div
              className="d-flex flex-column flex-sm-row flex-wrap gap-3 flex-grow-1 justify-content-md-end"
              id="scr-personnel-d2"
            >
              {personnelList()}
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h6 fw-bold mb-1" style={{ color: "var(--scr-slate-900)" }}>
              Crews &amp; work lines
            </h2>
            <p className="small mb-0" style={{ color: "var(--scr-slate-500)" }}>
              Primary workspace — add crews, then line items.
            </p>
          </div>
          <button type="button" className="scr-add-crew-btn scr-d2-crews-inline-btn" onClick={openAddCrewModal}>
            <i className="bi bi-plus-lg me-2" aria-hidden />
            Add Crew
          </button>
        </div>
        <div className="flex-grow-1">{crewsMain}</div>
      </section>
    );
  }

  if (layout === "d3") {
    return (
      <section className="scr-card scr-card-step-focus scr-d3-crews-hero p-4 p-lg-5 border border-2 h-100 d-flex flex-column">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
          <div>
            <p className="small text-uppercase fw-semibold mb-1 scr-d3-crews-kicker" style={{ letterSpacing: "0.08em" }}>
              Workspace
            </p>
            <h2 className="h4 fw-bold mb-0" style={{ color: "var(--scr-slate-900)" }}>
              Crews
            </h2>
          </div>
          <div className="scr-add-crew-wrap">
            <button type="button" className="scr-add-crew-btn" onClick={openAddCrewModal}>
              <i className="bi bi-plus-lg me-2" aria-hidden />
              Add Crew
            </button>
          </div>
        </div>
        <div className="flex-grow-1">{crewsMain}</div>
      </section>
    );
  }

  return (
    <section className="scr-card scr-card-step-focus p-4 p-lg-5 position-relative border border-2">
      <div className="d-flex align-items-start gap-3">
        <div className="scr-step-dot current d-lg-none">
          <span className="fw-bold" style={{ fontSize: "0.75rem" }}>
            2
          </span>
        </div>
        <div className="d-none d-lg-flex position-absolute" style={{ left: -8, top: "1.35rem" }}>
          <div className="scr-step-dot current">
            <span className="fw-bold" style={{ fontSize: "0.75rem" }}>
              2
            </span>
          </div>
        </div>
        <div className="flex-grow-1 text-center ms-lg-4">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 text-start mb-3">
            <div>
              <h2 className="h6 fw-bold mb-1" style={{ color: "var(--scr-slate-900)" }}>
                Add Crews
              </h2>
              <p className="small mb-0" style={{ color: "var(--scr-slate-500)" }}>
                Current step — organize workers into crews for cost allocation.
              </p>
            </div>
            {crews.length > 0 ? (
              <div className="scr-add-crew-wrap flex-shrink-0">
                <button type="button" className="scr-add-crew-btn" onClick={openAddCrewModal}>
                  <i className="bi bi-plus-lg me-2" aria-hidden />
                  Add Crew
                </button>
              </div>
            ) : null}
          </div>
          {crewsMain}
        </div>
      </div>
    </section>
  );
}

const D2_WORKFLOW_STEPS = [
  { num: "01", label: "Personnel" },
  { num: "02", label: "Crews & cost" },
  { num: "03", label: "Documents" },
  { num: "04", label: "Sign" },
  { num: "05", label: "Submit" },
  { num: "06", label: "Paid" },
] as const;

type CrewPaidRollup = {
  total: number;
  submit: number;
  paid: number;
  sign: number;
  signMax: number;
};

/** Design 2 stepper: done = green; current = next incomplete step after data / signatures / flags. */
function getDesign2WorkflowState(crewTotal: number, workTotal: number, rollup: CrewPaidRollup) {
  const personnelDone = true;
  const crewsDone = crewTotal > 0;
  const documentsDone = workTotal > 0;
  const signDone = rollup.signMax > 0 && rollup.sign === rollup.signMax;
  const submitDone = rollup.total > 0 && rollup.submit === rollup.total;
  const paidDone = rollup.total > 0 && rollup.paid === rollup.total;

  const doneFlags = [personnelDone, crewsDone, documentsDone, signDone, submitDone, paidDone];
  const firstIncomplete = doneFlags.findIndex((d) => !d);

  const stepClass = (i: number) => {
    if (doneFlags[i]) return "scr-d2-step scr-d2-step-done";
    if (firstIncomplete === -1) return "scr-d2-step scr-d2-step-done";
    if (i === firstIncomplete) return "scr-d2-step scr-d2-step-current";
    return "scr-d2-step scr-d2-step-todo";
  };

  const connectorClass = (afterStepIndex: number) =>
    doneFlags[afterStepIndex]
      ? "scr-d2-step-connector"
      : "scr-d2-step-connector scr-d2-step-connector-dim";

  const isCurrent = (i: number) =>
    firstIncomplete !== -1 && !doneFlags[i] && i === firstIncomplete;

  return { stepClass, connectorClass, isCurrent };
}

type CostProps = {
  totalCost: number;
  workTotal: number;
  contractAmount: number;
  /** Submit/Paid checkboxes; Sign = PDF signatures done (2 per crew: Compensation + Waiver) */
  crewPaidRollup: CrewPaidRollup;
  compact?: boolean;
};

function InstallationCostSection({
  totalCost,
  workTotal,
  contractAmount,
  crewPaidRollup,
  compact,
}: CostProps) {
  const { total: crewTotal, submit: submitCrews, paid: paidCrews, sign: signDone, signMax: signTotal } = crewPaidRollup;
  return (
    <section className={`scr-card h-100 p-4 p-lg-4 d-flex flex-column ${compact ? "scr-sidebar-cost" : ""}`}>
      <h2 className={`fw-bold mb-4 ${compact ? "h6" : "h5"}`} style={{ color: "var(--scr-slate-900)" }}>
        Installation Cost
      </h2>
      <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-4">
        <span className="small fw-semibold text-uppercase" style={{ color: "var(--scr-slate-500)", letterSpacing: "0.04em" }}>
          Total Cost
        </span>
        <span className={`fw-bold ${compact ? "fs-3" : "display-6"}`} style={{ color: "var(--scr-slate-900)" }}>
          ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <ul className="list-unstyled d-flex flex-column gap-3 mb-0 pb-4 border-bottom border-light">
        <li className="d-flex justify-content-between align-items-center small">
          <span style={{ color: "var(--scr-slate-600)" }}>Installation Cost</span>
          <span className="fw-semibold" style={{ color: "var(--scr-slate-800)" }}>
            ${workTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </li>
        <li className="d-flex justify-content-between align-items-center small">
          <span style={{ color: "var(--scr-slate-600)" }}>Based on Contract</span>
          <span className="fw-semibold" style={{ color: "var(--scr-slate-800)" }}>
            ${contractAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </li>
      </ul>

      <div className="d-flex flex-wrap align-items-center gap-3 gap-sm-4 mt-auto pt-3 border-top border-light scr-install-cost-status-row">
        <div className="d-flex align-items-baseline gap-2">
          <span className="small fw-semibold text-uppercase" style={{ color: "var(--scr-slate-500)", letterSpacing: "0.05em", fontSize: "0.65rem" }}>
            Sign
          </span>
          <span className={`fw-bold scr-tabular-nums ${compact ? "fs-5" : "fs-4"}`} style={{ color: "var(--scr-slate-900)" }}>
            {signDone}/{signTotal}
          </span>
        </div>
        <span className="text-secondary opacity-50 d-none d-sm-inline" aria-hidden>
          |
        </span>
        <div className="d-flex align-items-baseline gap-2">
          <span className="small fw-semibold text-uppercase" style={{ color: "var(--scr-slate-500)", letterSpacing: "0.05em", fontSize: "0.65rem" }}>
            Submit
          </span>
          <span className={`fw-bold scr-tabular-nums ${compact ? "fs-5" : "fs-4"}`} style={{ color: "var(--scr-slate-900)" }}>
            {submitCrews}/{crewTotal}
          </span>
        </div>
        <span className="text-secondary opacity-50 d-none d-sm-inline" aria-hidden>
          |
        </span>
        <div className="d-flex align-items-baseline gap-2">
          <span className="small fw-semibold text-uppercase" style={{ color: "var(--scr-slate-500)", letterSpacing: "0.05em", fontSize: "0.65rem" }}>
            Paid
          </span>
          <span className={`fw-bold scr-tabular-nums ${compact ? "fs-5" : "fs-4"}`} style={{ color: "var(--scr-slate-900)" }}>
            {paidCrews}/{crewTotal}
          </span>
        </div>
      </div>

      <p className="small pt-2 mb-0" style={{ color: "var(--scr-slate-500)" }}>
        Sign = Compensation + Waiver per crew (2 each). Submit/Paid = checkboxes on each card (independent).
      </p>
    </section>
  );
}

export default function SubcontractorReport() {
  const [design, setDesign] = useState<DesignVariant>(1);
  const [crews, setCrews] = useState<CrewEntry[]>([]);
  const [addCrewOpen, setAddCrewOpen] = useState(false);
  const [addCrewModalKey, setAddCrewModalKey] = useState(0);
  const [workModal, setWorkModal] = useState<{ crewId: string; editItem: CrewWorkItem | null } | null>(null);
  const [addWorkModalKey, setAddWorkModalKey] = useState(0);
  const [crewPaymentFlags, setCrewPaymentFlags] = useState<Record<string, CrewPaymentFlags>>({});
  const compensationPreviewOpenRef = useRef<((crewId: string) => void) | null>(null);
  const waiverPreviewOpenRef = useRef<((crewId: string) => void) | null>(null);
  const [crewPdfSignatures, setCrewPdfSignatures] = useState<CrewPdfSignatures>({});

  function handleCrewPdfSigned(crewId: string, kind: "compensation" | "waiver", dataUrl: string) {
    setCrewPdfSignatures((prev) => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        ...(kind === "compensation"
          ? { compensationDataUrl: dataUrl }
          : { waiverDataUrl: dataUrl }),
      },
    }));
  }

  const workTotal = crews.reduce(
    (sum, crew) => sum + crew.workItems.reduce((s, w) => s + (Number(w.installCost) || 0), 0),
    0
  );
  const contractAmount = 0;
  const totalCost = contractAmount + workTotal;

  const crewPaidRollup = useMemo(() => {
    const total = crews.length;
    if (total === 0) return { total: 0, submit: 0, paid: 0, sign: 0, signMax: 0 };
    const paid = crews.filter((c) => crewPaymentFlags[c.id]?.paid === true).length;
    const submit = crews.filter((c) => crewPaymentFlags[c.id]?.submit === true).length;
    const sign = crews.reduce((acc, c) => {
      const s = crewPdfSignatures[c.id];
      return acc + (s?.compensationDataUrl ? 1 : 0) + (s?.waiverDataUrl ? 1 : 0);
    }, 0);
    const signMax = 2 * total;
    return { total, submit, paid, sign, signMax };
  }, [crews, crewPaymentFlags, crewPdfSignatures]);

  const d2Workflow = useMemo(
    () => getDesign2WorkflowState(crews.length, workTotal, crewPaidRollup),
    [crews.length, workTotal, crewPaidRollup]
  );

  function handleAddCrew(payload: CrewEntryPayload) {
    setCrewPaymentFlags((prev) => ({
      ...prev,
      [payload.id]: { submit: false, paid: false },
    }));
    setCrews((c) => [
      ...c,
      {
        ...payload,
        code: `SCR${c.length + 1}`,
        workItems: [],
      },
    ]);
  }

  function setCrewPaymentFlag(crewId: string, key: keyof CrewPaymentFlags, checked: boolean) {
    setCrewPaymentFlags((prev) => {
      const cur = prev[crewId] ?? { submit: false, paid: false };
      return {
        ...prev,
        [crewId]: { ...cur, [key]: checked },
      };
    });
  }

  function handleSaveWorkItem(crewId: string, item: CrewWorkItem) {
    setCrews((list) =>
      list.map((crew) => {
        if (crew.id !== crewId) return crew;
        const exists = crew.workItems.some((w) => w.id === item.id);
        if (exists) {
          return {
            ...crew,
            workItems: crew.workItems.map((w) => (w.id === item.id ? item : w)),
          };
        }
        return { ...crew, workItems: [...crew.workItems, item] };
      })
    );
  }

  function handleDeleteWorkItem(crewId: string, workId: string) {
    setCrews((list) =>
      list.map((crew) =>
        crew.id === crewId
          ? { ...crew, workItems: crew.workItems.filter((w) => w.id !== workId) }
          : crew
      )
    );
  }

  const workModalCrew = workModal ? crews.find((c) => c.id === workModal.crewId) : undefined;

  function openAddCrewModal() {
    setAddCrewModalKey((k) => k + 1);
    setAddCrewOpen(true);
  }

  function openAddWorkModal(crewId: string) {
    setAddWorkModalKey((k) => k + 1);
    setWorkModal({ crewId, editItem: null });
  }

  function openEditWorkModal(crewId: string, item: CrewWorkItem) {
    setAddWorkModalKey((k) => k + 1);
    setWorkModal({ crewId, editItem: item });
  }

  const dClass = scrDesignClass(design);

  const costProps: CostProps = {
    totalCost,
    workTotal,
    contractAmount,
    crewPaidRollup,
  };

  const crewsBase = {
    crews,
    openAddCrewModal,
    openAddWorkModal,
    openEditWorkModal,
    onDeleteWork: handleDeleteWorkItem,
    onOpenCompensationPreview: (crewId: string) => compensationPreviewOpenRef.current?.(crewId),
    onOpenWaiverPreview: (crewId: string) => waiverPreviewOpenRef.current?.(crewId),
    crewPdfSignatures,
    crewPaymentFlags,
    setCrewPaymentFlag,
  };

  return (
    <DesignThemeProvider value={design}>
      <div className={`min-vh-100 py-4 py-lg-5 scr-app ${dClass}`}>
        <AddCrewModal
          key={addCrewModalKey}
          show={addCrewOpen}
          onClose={() => setAddCrewOpen(false)}
          onAdd={handleAddCrew}
        />
        {workModal && workModalCrew ? (
          <AddWorkModal
            key={`${workModal.crewId}-${workModal.editItem?.id ?? "new"}-${addWorkModalKey}`}
            show
            onClose={() => setWorkModal(null)}
            subcontractorName={workModalCrew.employeeName || "Subcontractor"}
            tradeBadge={workModalCrew.serviceType}
            initialItem={workModal.editItem}
            onSubmit={(item) => handleSaveWorkItem(workModal.crewId, item)}
          />
        ) : null}
        <div className="container-xl px-3 px-lg-4">
          <div className="scr-design-tablist mb-4" role="tablist" aria-label="Report layout design">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={design === n}
                aria-controls="scr-design-content"
                id={`scr-design-tab-${n}`}
                className={`scr-design-tab ${design === n ? "scr-design-tab-active" : ""}`}
                onClick={() => setDesign(n)}
              >
                Design {n}
              </button>
            ))}
          </div>

          {design === 3 ? (
            <div className="scr-d3-status-row d-flex flex-wrap align-items-center gap-2 mb-3" aria-hidden={false}>
              <span className="scr-d3-chip">Draft workspace</span>
              <span className="scr-d3-chip scr-d3-chip-muted">Review before export</span>
            </div>
          ) : null}

          <div id="scr-design-content" role="tabpanel" aria-labelledby={`scr-design-tab-${design}`}>
            <header className="scr-report-header d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4 mb-lg-5">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 scr-card border-0"
                  style={{ width: 52, height: 52 }}
                >
                  <i className="bi bi-file-earmark-text fs-3" style={{ color: "var(--scr-slate-600)" }} />
                </div>
                <div>
                  <h1 className="h4 fw-bold mb-0" style={{ color: "var(--scr-slate-900)" }}>
                    Subcontractor Compensation Report
                  </h1>
                  <p className="small mb-0 mt-1" style={{ color: "var(--scr-slate-500)" }}>
                    Build, review, and export this compensation package.
                  </p>
                </div>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 scr-btn-group-premium">
                <button type="button" className="btn d-inline-flex align-items-center gap-2">
                  <i className="bi bi-hammer" aria-hidden />
                  Build
                </button>
                <button type="button" className="btn btn-primary-like d-inline-flex align-items-center gap-2">
                  <i className="bi bi-box-arrow-up" aria-hidden />
                  Export
                </button>
              </div>
            </header>

            {design === 2 ? (
              <div className="scr-d2-stepper scr-d2-stepper-extended mb-4" aria-label="Workflow progress">
                {D2_WORKFLOW_STEPS.map((step, i) => (
                  <Fragment key={step.label}>
                    {i > 0 ? (
                      <span className={d2Workflow.connectorClass(i - 1)} aria-hidden />
                    ) : null}
                    <div
                      className={d2Workflow.stepClass(i)}
                      aria-current={d2Workflow.isCurrent(i) ? "step" : undefined}
                    >
                      <span className="scr-d2-step-num">{step.num}</span>
                      <span className="scr-d2-step-label">{step.label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            ) : null}

            {design === 1 ? (
              <>
                <div className="position-relative mb-4 scr-workflow-region">
                  <div className="scr-workflow-rail d-none d-lg-block" aria-hidden />
                  <div className="d-flex flex-column gap-4 ps-lg-5">
                    <AssignPersonnelSection layout="d1" />
                    <CrewsSection {...crewsBase} layout="d1" />
                  </div>
                </div>
                <div className="row g-4 mb-4 scr-cost-docs-row justify-content-center">
                  <div className="col-lg-8 col-xl-7">
                    <InstallationCostSection {...costProps} />
                  </div>
                </div>
              </>
            ) : null}

            {design === 2 ? (
              <div className="row g-4 mb-4 align-items-stretch scr-d2-split">
                <div className="col-lg-8 order-1">
                  <CrewsSection {...crewsBase} layout="d2" />
                </div>
                <div className="col-lg-4 order-2">
                  <div className="d-flex flex-column gap-4 scr-d2-sidebar">
                    <div className="sticky-lg-top scr-d2-sticky-stack" style={{ top: "0.75rem" }}>
                      <InstallationCostSection {...costProps} compact />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {design === 3 ? (
              <>
                <AssignPersonnelSection layout="d3" />
                <div className="row g-4 mb-4 scr-d3-triple">
                  <div className="col-12 col-lg-3 order-2 order-lg-1">
                    <InstallationCostSection {...costProps} compact />
                  </div>
                  <div className="col-12 col-lg-9 order-1 order-lg-2">
                    <CrewsSection {...crewsBase} layout="d3" />
                  </div>
                </div>
              </>
            ) : null}

            <DocumentsPanel
              crews={crews}
              crewPdfSignatures={crewPdfSignatures}
              onCrewPdfSigned={handleCrewPdfSigned}
              compensationPreviewOpenRef={compensationPreviewOpenRef}
              waiverPreviewOpenRef={waiverPreviewOpenRef}
            />
          </div>
        </div>
      </div>
    </DesignThemeProvider>
  );
}
