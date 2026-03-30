"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function SignSessionClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [done, setDone] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

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
    g.ctx.lineWidth = 2;
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
    setDone(false);
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
    const g = getCtx();
    if (!g) return;
    g.ctx.fillStyle = "#f8fafc";
    g.ctx.fillRect(0, 0, g.c.width, g.c.height);
    setHasInk(false);
    setDone(false);
  };

  const complete = () => {
    if (!hasInk) return;
    setDone(true);
  };

  return (
    <div className="scr-card p-4 p-md-4 border">
      <h2 className="h6 fw-bold mb-2" style={{ color: "var(--scr-slate-900)" }}>
        Sign here
      </h2>
      <p className="small text-secondary mb-3">
        Draw your signature in the box. This demo stays in your browser only — connect your e-sign API
        later to send documents out.
      </p>
      <canvas
        ref={canvasRef}
        width={560}
        height={200}
        className="w-100 rounded-3 border bg-white"
        style={{ maxHeight: 200, cursor: "crosshair", touchAction: "none" }}
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
          disabled={!hasInk}
          onClick={complete}
        >
          Complete signing
        </button>
      </div>
      {done ? (
        <div className="alert alert-success small mt-3 mb-0 py-2" role="status">
          Signature captured for this session (demo). Replace this step with DocuSign / Dropbox Sign /
          your backend when ready.
        </div>
      ) : null}
    </div>
  );
}
