"use client";

import { pdf } from "@react-pdf/renderer";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildCompensationRows } from "../lib/buildCompensationRows";
import { scrDesignClass, useDesignVariant } from "./DesignThemeContext";
import { DEFAULT_JOB_META } from "../lib/defaultJobMeta";
import type { CrewEntry } from "./crewTypes";
import PdfSignatureModal from "./PdfSignatureModal";
import { CompensationAgreementDocument } from "./pdf/CompensationAgreementDocument";
import { WaiverLienDocument } from "./pdf/WaiverLienDocument";

type Props = {
  crews: CrewEntry[];
  workTotal: number;
};

type PreviewState = {
  url: string;
  blob: Blob;
  filename: string;
  title: string;
  docKind: "compensation" | "waiver";
  signatureDataUrl?: string;
};

function logoAbsoluteSrc(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/logo.png`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DocumentsPanel({ crews, workTotal }: Props) {
  const design = useDesignVariant();
  const dClass = scrDesignClass(design);
  const rows = buildCompensationRows(crews);
  const hasCompensationData = rows.length > 0;
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [generating, setGenerating] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [applyingSignature, setApplyingSignature] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const makePreviewBlob = useCallback(
    async (docKind: "compensation" | "waiver", signatureDataUrl?: string) => {
      const logoSrc = logoAbsoluteSrc();
      if (docKind === "compensation") {
        return pdf(
          <CompensationAgreementDocument
            logoSrc={logoSrc}
            jobNumber={DEFAULT_JOB_META.jobNumber}
            accountName={DEFAULT_JOB_META.accountName}
            accountAddress={DEFAULT_JOB_META.accountAddress}
            rows={rows}
            totalInstallationCost={workTotal}
            payeeCompanyName={DEFAULT_JOB_META.subcontractorCompany}
            signatureDataUrl={signatureDataUrl}
          />
        ).toBlob();
      }
      return pdf(
        <WaiverLienDocument
          logoSrc={logoSrc}
          jobNumber={DEFAULT_JOB_META.jobNumber}
          subcontractorCompany={DEFAULT_JOB_META.subcontractorCompany}
          paymentAmount={workTotal}
          customerName={DEFAULT_JOB_META.customerName}
          customerAddress={DEFAULT_JOB_META.customerAddress}
          printNameTitle={DEFAULT_JOB_META.printNameTitle}
          signatureDataUrl={signatureDataUrl}
        />
      ).toBlob();
    },
    [rows, workTotal]
  );

  useEffect(() => {
    if (!preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [preview]);

  function closePreview() {
    setSignModalOpen(false);
    setPreview((p) => {
      if (p) URL.revokeObjectURL(p.url);
      return null;
    });
  }

  async function applySignatureToPreview(dataUrl: string) {
    const current = preview;
    if (!current) return;
    const previousUrl = current.url;
    setApplyingSignature(true);
    try {
      const blob = await makePreviewBlob(current.docKind, dataUrl);
      const url = URL.createObjectURL(blob);
      setPreview({
        ...current,
        url,
        blob,
        signatureDataUrl: dataUrl,
      });
      setSignModalOpen(false);
      queueMicrotask(() => URL.revokeObjectURL(previousUrl));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setApplyingSignature(false));
      });
    } catch (err) {
      console.error("Failed to embed signature in PDF", err);
      setApplyingSignature(false);
    }
  }

  async function openCompensationPreview() {
    if (!hasCompensationData || generating) return;
    setGenerating(true);
    try {
      const blob = await makePreviewBlob("compensation");
      const url = URL.createObjectURL(blob);
      setPreview({
        url,
        blob,
        filename: "Subcontractor-Compensation-Agreement.pdf",
        title: "Subcontractor Compensation Agreement",
        docKind: "compensation",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function openWaiverPreview() {
    if (generating) return;
    setGenerating(true);
    try {
      const blob = await makePreviewBlob("waiver");
      const url = URL.createObjectURL(blob);
      setPreview({
        url,
        blob,
        filename: "Waiver-Release-of-Lien.pdf",
        title: "Waiver and Release of Lien Upon Final Payment",
        docKind: "waiver",
      });
    } finally {
      setGenerating(false);
    }
  }

  function handlePrint() {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  }

  return (
    <>
      {preview ? (
        <>
          <PdfSignatureModal
            open={signModalOpen}
            onClose={() => setSignModalOpen(false)}
            applying={applyingSignature}
            documentLabel={preview.title}
            onApply={(dataUrl) => void applySignatureToPreview(dataUrl)}
          />
          <div className={`modal-backdrop fade show scr-modal-backdrop ${dClass}`} aria-hidden onClick={closePreview} />
          <div
            className={`modal fade show d-block scr-modal-root ${dClass}`}
            style={{ zIndex: 1060 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-preview-title"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable px-2 my-3">
              <div className="modal-content border-0 rounded-3 shadow-lg overflow-hidden">
                <div className="modal-header border-bottom">
                  <h2 id="pdf-preview-title" className="modal-title h6 fw-semibold mb-0">
                    Preview — {preview.title}
                  </h2>
                  <button type="button" className="btn-close" aria-label="Close preview" onClick={closePreview} />
                </div>
                <div className="modal-body p-0 bg-light position-relative">
                  {applyingSignature ? (
                    <div
                      className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
                      style={{ zIndex: 1 }}
                      role="status"
                      aria-live="polite"
                    >
                      <div className="text-center small text-secondary px-3">
                        <div className="spinner-border spinner-border-sm text-success mb-2" aria-hidden />
                        <div className="fw-semibold text-dark">Embedding signature in PDF…</div>
                      </div>
                    </div>
                  ) : null}
                  <iframe
                    key={preview.url}
                    ref={iframeRef}
                    src={preview.url}
                    title={preview.title}
                    className="w-100 border-0 d-block bg-white"
                    style={{ minHeight: "70vh", height: "75vh" }}
                  />
                </div>
                <div className="modal-footer border-top gap-2 flex-wrap">
                  <button type="button" className="btn btn-light border rounded-3" onClick={closePreview}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success scr-sign-online-btn rounded-3 fw-semibold text-white"
                    title="Opens signing pad; signature applies to this PDF preview and download"
                    onClick={() => setSignModalOpen(true)}
                  >
                    <i className="bi bi-pen me-1" aria-hidden />
                    Sign online
                  </button>
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={handlePrint}>
                    <i className="bi bi-printer me-1" aria-hidden />
                    Print
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary rounded-3"
                    onClick={() => triggerDownload(preview.blob, preview.filename)}
                  >
                    <i className="bi bi-download me-1" aria-hidden />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <section className="scr-card h-100 p-4 p-lg-4">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
          <h2
            className="h6 fw-bold text-uppercase small mb-0 tracking-wide"
            style={{ color: "var(--scr-slate-600)", letterSpacing: "0.06em" }}
          >
            Documents
          </h2>
          <span className="badge bg-light text-secondary border">PDF</span>
        </div>

        <ul className="list-unstyled d-flex flex-column gap-0 mb-0">
          <li className="d-flex align-items-start justify-content-between gap-3 py-3 border-bottom border-light">
            <div className="d-flex align-items-start gap-3 min-w-0">
              <span
                className="flex-shrink-0 rounded-1 bg-secondary bg-opacity-25"
                style={{ width: 4, minHeight: 40, marginTop: 2 }}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="fw-semibold" style={{ color: "var(--scr-slate-900)" }}>
                  Subcontractor Compensation Agreement
                </div>
              </div>
            </div>
            <div className="d-flex flex-shrink-0 gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary border rounded-3"
                title="Preview PDF"
                aria-label="Preview Subcontractor Compensation Agreement"
                disabled={!hasCompensationData || generating}
                onClick={() => void openCompensationPreview()}
              >
                <i className="bi bi-eye me-1" aria-hidden />
                Preview
              </button>
            </div>
          </li>

          <li className="d-flex align-items-start justify-content-between gap-3 py-3">
            <div className="d-flex align-items-start gap-3 min-w-0">
              <span
                className="flex-shrink-0 rounded-1 bg-secondary bg-opacity-25"
                style={{ width: 4, minHeight: 40, marginTop: 2 }}
                aria-hidden
              />
              <div className="min-w-0">
                <div
                  className="fw-semibold text-uppercase small"
                  style={{ color: "var(--scr-slate-900)", letterSpacing: "0.02em" }}
                >
                  Waiver and Release of Lien Upon Final Payment
                </div>
              </div>
            </div>
            <div className="d-flex flex-shrink-0 gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary border rounded-3"
                title="Preview PDF"
                aria-label="Preview Waiver and Release of Lien"
                disabled={generating}
                onClick={() => void openWaiverPreview()}
              >
                <i className="bi bi-eye me-1" aria-hidden />
                Preview
              </button>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
