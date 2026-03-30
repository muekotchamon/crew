"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { scrDesignClass, useDesignVariant } from "./DesignThemeContext";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with PNG data URL suitable for @react-pdf Image */
  onApply: (dataUrl: string) => void | Promise<void>;
  applying?: boolean;
  /** Which PDF is being signed (Compensation vs Waiver, etc.) */
  documentLabel?: string;
};

export default function PdfSignatureModal({ open, onClose, onApply, applying, documentLabel }: Props) {
  const design = useDesignVariant();
  const dClass = scrDesignClass(design);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  const initCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  useEffect(() => {
    if (!open) return;
    initCanvas();
    setHasInk(false);
  }, [open, initCanvas]);

  const getCtx = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return null;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    return { c, ctx };
  }, []);

  const pos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    const scaleX = c.width / r.width;
    const scaleY = c.height / r.height;
    return {
      x: (e.clientX - r.left) * scaleX,
      y: (e.clientY - r.top) * scaleY,
    };
  }, []);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const g = getCtx();
    if (!g) return;
    const { x, y } = pos(e);
    g.ctx.beginPath();
    g.ctx.moveTo(x, y);
    g.ctx.strokeStyle = "#0f172a";
    g.ctx.lineWidth = 2.25;
    g.ctx.lineCap = "round";
    g.ctx.lineJoin = "round";
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const g = getCtx();
    if (!g) return;
    const { x, y } = pos(e);
    g.ctx.lineTo(x, y);
    g.ctx.stroke();
    setHasInk(true);
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drawing.current = false;
  };

  const clear = () => {
    initCanvas();
    setHasInk(false);
  };

  async function handleApply() {
    const c = canvasRef.current;
    if (!c || !hasInk) return;
    const dataUrl = c.toDataURL("image/png");
    await onApply(dataUrl);
  }

  if (!open) return null;

  return (
    <>
      <div
        className={`modal-backdrop fade show scr-modal-backdrop ${dClass}`}
        style={{ zIndex: 1080 }}
        aria-hidden
        onClick={onClose}
      />
      <div
        className={`modal fade show d-block scr-modal-root ${dClass}`}
        style={{ zIndex: 1085 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-sig-modal-title"
      >
        <div className="modal-dialog modal-dialog-centered px-2">
          <div className="modal-content border-0 rounded-3 shadow-lg">
            <div className="modal-header border-bottom">
              <div className="min-w-0">
                <h2 id="pdf-sig-modal-title" className="modal-title h6 fw-semibold mb-0">
                  Sign in preview
                </h2>
                {documentLabel ? (
                  <p className="small text-secondary mb-0 text-truncate" title={documentLabel}>
                    {documentLabel}
                  </p>
                ) : null}
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="small text-secondary mb-3">
                Draw your signature below. It will appear in this preview right away and in the PDF you
                print or download.
              </p>
              <canvas
                ref={canvasRef}
                width={640}
                height={220}
                className="w-100 rounded-3 border bg-white"
                style={{ maxHeight: 220, cursor: "crosshair", touchAction: "none" }}
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
                onPointerLeave={(e) => {
                  if (drawing.current) end(e);
                }}
              />
              <div className="d-flex flex-wrap gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary btn-sm rounded-3" onClick={clear}>
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-3 fw-semibold"
                  disabled={!hasInk || applying}
                  onClick={() => void handleApply()}
                >
                  {applying ? "Updating PDF…" : "Apply to PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
