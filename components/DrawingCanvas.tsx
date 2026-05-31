"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Challenge } from "@/lib/data";

interface Props {
  challenge: Challenge;
  onSubmit: (stars: number) => void;
  onClose: () => void;
}

type Tool = "pencil" | "pen" | "brush" | "marker" | "eraser";

interface Point { x: number; y: number; pressure: number; time: number; }
interface Stroke { tool: Tool; color: string; size: number; points: Point[]; }

const RATINGS = [
  { stars: 1, emoji: "🙂", label: "Tried it",  desc: "Needs more practice" },
  { stars: 2, emoji: "😊", label: "Did OK",    desc: "Looking good!" },
  { stars: 3, emoji: "🤩", label: "Nailed it", desc: "Excellent work!" },
];

const COLORS = [
  "#0d0d0d", "#555555", "#2baaee", "#3b82f6",
  "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#f97316", "#ffffff", "#1a1a2e",
];

const TOOLS: { id: Tool; icon: string; label: string; shortcut: string }[] = [
  { id: "pencil", icon: "✏️", label: "Pencil",  shortcut: "P" },
  { id: "pen",    icon: "🖊️", label: "Pen",     shortcut: "N" },
  { id: "brush",  icon: "🖌️", label: "Brush",   shortcut: "B" },
  { id: "marker", icon: "🖍️", label: "Marker",  shortcut: "M" },
  { id: "eraser", icon: "⬜", label: "Eraser",  shortcut: "E" },
];

const SHORTCUTS: Record<string, Tool> = { p:"pencil", n:"pen", b:"brush", m:"marker", e:"eraser" };

// ─── Catmull-Rom spline smoothing ──────────────────────────
function catmullRomPoints(pts: Point[], tension = 0.5): Point[] {
  if (pts.length < 3) return pts;
  const result: Point[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let t = 0.1; t <= 1; t += 0.1) {
      const t2 = t * t, t3 = t2 * t;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      const pressure = p1.pressure + (p2.pressure - p1.pressure) * t;
      result.push({ x, y, pressure, time: p1.time });
    }
  }
  result.push(pts[pts.length - 1]);
  return result;
}

// ─── Stabilizer: moving average over last N points ─────────
function stabilize(pts: Point[], window = 6): Point[] {
  if (pts.length < window) return pts;
  return pts.map((p, i) => {
    const start = Math.max(0, i - window);
    const slice = pts.slice(start, i + 1);
    return {
      x: slice.reduce((s, p) => s + p.x, 0) / slice.length,
      y: slice.reduce((s, p) => s + p.y, 0) / slice.length,
      pressure: p.pressure,
      time: p.time,
    };
  });
}

// ─── Compute simulated pressure from speed ─────────────────
function computePressure(pts: Point[]): Point[] {
  if (pts.length < 2) return pts;
  return pts.map((p, i) => {
    if (i === 0) return { ...p, pressure: 0.5 };
    const prev = pts[i - 1];
    const dx = p.x - prev.x, dy = p.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = Math.max(1, p.time - prev.time);
    const speed = dist / dt;
    // Slow = more pressure (thicker), fast = less pressure (thinner)
    const pressure = Math.max(0.2, Math.min(1, 1 - speed * 0.012));
    return { ...p, pressure };
  });
}

export default function DrawingCanvas({ challenge, onSubmit, onClose }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const offscreen  = useRef<HTMLCanvasElement | null>(null); // committed strokes
  const wrapRef    = useRef<HTMLDivElement>(null);

  const [tool,  setTool]  = useState<Tool>("pen");
  const [color, setColor] = useState("#0d0d0d");
  const [size,  setSize]  = useState(4);
  const [zoom,  setZoom]  = useState(1);
  const [pan,   setPan]   = useState({ x: 0, y: 0 });
  const [showRating,    setShowRating]    = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hasDrawn,      setHasDrawn]      = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [stabilize_,    setStabilize]     = useState(true);

  const strokes    = useRef<Stroke[]>([]);
  const redoStack  = useRef<Stroke[]>([]);
  const current    = useRef<Stroke | null>(null);
  const isDrawing  = useRef(false);
  const isPanning  = useRef(false);
  const spaceDown  = useRef(false);
  const lastPan    = useRef({ x: 0, y: 0 });
  const panOffset  = useRef({ x: 0, y: 0 });

  const W = 2400, H = 1800; // high-res canvas

  // ── Init offscreen canvas ──────────────────────────────
  useEffect(() => {
    const oc = document.createElement("canvas");
    oc.width = W; oc.height = H;
    const ctx = oc.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    offscreen.current = oc;
    composite();
  }, []);

  // ── Draw offscreen + current stroke onto visible canvas ─
  const composite = useCallback(() => {
    const canvas = canvasRef.current;
    const oc = offscreen.current;
    if (!canvas || !oc) return;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Paper shadow
    const px = pan.x, py = pan.y, z = zoom;
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px, py, W * z, H * z);
    ctx.shadowBlur = 0;
    // Draw committed strokes
    ctx.drawImage(oc, px, py, W * z, H * z);
    ctx.restore();
  }, [zoom, pan]);

  // ── Render a single stroke to a context ───────────────
  function renderStroke(ctx: CanvasRenderingContext2D, s: Stroke, toOffscreen = false) {
    if (s.points.length < 2) return;
    const scale = toOffscreen ? 1 : zoom;

    // Apply stabilization & catmull-rom smoothing
    let pts = computePressure(s.points);
    if (stabilize_ && pts.length > 4) pts = stabilize(pts);
    if (pts.length > 3) pts = catmullRomPoints(pts, 0.5);

    ctx.save();
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";

    if (s.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = s.size * 8 * (toOffscreen ? 1 : 1 / zoom);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    } else if (s.tool === "pen") {
      // Pen: pressure-sensitive width, sharp edges, full opacity
      ctx.globalAlpha = 1;
      ctx.strokeStyle = s.color;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.lineWidth = Math.max(0.5, s.size * p.pressure * 1.4);
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    } else if (s.tool === "pencil") {
      // Pencil: textured, slightly transparent, pressure-sensitive
      ctx.strokeStyle = s.color;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.globalAlpha = 0.6 + p.pressure * 0.3;
        ctx.lineWidth = Math.max(0.5, s.size * p.pressure * 1.1);
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        // Pencil grain: tiny scattered dots along the stroke
        if (Math.random() > 0.6) {
          ctx.globalAlpha = 0.08 + Math.random() * 0.08;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(
            p.x + (Math.random() - 0.5) * s.size * 1.5,
            p.y + (Math.random() - 0.5) * s.size * 1.5,
            Math.random() * s.size * 0.4, 0, Math.PI * 2
          );
          ctx.fill();
        }
      }
    } else if (s.tool === "brush") {
      // Brush: wide, soft, low opacity — builds up with overlapping
      ctx.strokeStyle = s.color;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.globalAlpha = 0.04 + p.pressure * 0.06;
        ctx.lineWidth = Math.max(2, s.size * 4 * p.pressure);
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    } else if (s.tool === "marker") {
      // Marker: wide, flat, semi-transparent — highlights/flat fill
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size * 5;
      ctx.globalAlpha = 0.35;
      ctx.lineCap = "square";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── Full redraw (undo/redo) ─────────────────────────────
  const redraw = useCallback(() => {
    const oc = offscreen.current;
    if (!oc) return;
    const ctx = oc.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    for (const s of strokes.current) renderStroke(ctx, s, true);
    composite();
  }, [composite]);

  // ── Pointer helpers ────────────────────────────────────
  function canvasToDoc(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = (clientX - rect.left) * (canvas.width / rect.width);
    const cy = (clientY - rect.top) * (canvas.height / rect.height);
    return {
      x: (cx - pan.x) / zoom,
      y: (cy - pan.y) / zoom,
    };
  }

  function getEventPos(e: React.MouseEvent | React.TouchEvent) {
    if ("touches" in e) return canvasToDoc(e.touches[0].clientX, e.touches[0].clientY);
    return canvasToDoc(e.clientX, e.clientY);
  }

  // ── Drawing ────────────────────────────────────────────
  function pointerDown(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (spaceDown.current) {
      isPanning.current = true;
      const src = "touches" in e ? e.touches[0] : e;
      lastPan.current = { x: src.clientX, y: src.clientY };
      panOffset.current = { ...pan };
      return;
    }
    isDrawing.current = true;
    setHasDrawn(true);
    redoStack.current = [];
    const pos = getEventPos(e);
    current.current = { tool, color, size, points: [{ ...pos, pressure: 0.5, time: Date.now() }] };
  }

  function pointerMove(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (isPanning.current) {
      const src = "touches" in e ? e.touches[0] : e;
      const dx = src.clientX - lastPan.current.x;
      const dy = src.clientY - lastPan.current.y;
      setPan({ x: panOffset.current.x + dx, y: panOffset.current.y + dy });
      composite();
      return;
    }
    if (!isDrawing.current || !current.current) return;
    const pos = getEventPos(e);
    const pts = current.current.points;
    const last = pts[pts.length - 1];
    const dx = pos.x - last.x, dy = pos.y - last.y;
    if (dx * dx + dy * dy < 1) return; // skip micro-moves
    current.current.points.push({ ...pos, pressure: 0.5, time: Date.now() });

    // Live preview: render current stroke on top
    const canvas = canvasRef.current;
    const oc = offscreen.current;
    if (!canvas || !oc) return;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(pan.x, pan.y, W * zoom, H * zoom);
    ctx.shadowBlur = 0;
    ctx.drawImage(oc, pan.x, pan.y, W * zoom, H * zoom);
    // Draw live stroke scaled
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    renderStroke(ctx, current.current, false);
    ctx.restore();
  }

  function pointerUp(e: React.MouseEvent | React.TouchEvent) {
    if (isPanning.current) { isPanning.current = false; return; }
    if (!isDrawing.current || !current.current) return;
    isDrawing.current = false;
    // Commit stroke to offscreen
    const oc = offscreen.current;
    if (oc) {
      const ctx = oc.getContext("2d")!;
      renderStroke(ctx, current.current, true);
    }
    strokes.current.push({ ...current.current, points: [...current.current.points] });
    current.current = null;
    composite();
  }

  // ── Zoom ───────────────────────────────────────────────
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.2, Math.min(8, zoom * factor));
    // Zoom toward mouse position
    setPan(p => ({
      x: mx - (mx - p.x) * (newZoom / zoom),
      y: my - (my - p.y) * (newZoom / zoom),
    }));
    setZoom(newZoom);
  }

  useEffect(() => { composite(); }, [zoom, pan, composite]);

  // ── Undo / Redo ────────────────────────────────────────
  const undo = useCallback(() => {
    if (!strokes.current.length) return;
    redoStack.current.push(strokes.current.pop()!);
    redraw();
  }, [redraw]);

  const redo = useCallback(() => {
    if (!redoStack.current.length) return;
    strokes.current.push(redoStack.current.pop()!);
    redraw();
  }, [redraw]);

  function clearCanvas() {
    strokes.current = [];
    redoStack.current = [];
    redraw();
    setHasDrawn(false);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  // ── Keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { spaceDown.current = true; e.preventDefault(); return; }
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && k === "y") { e.preventDefault(); redo(); return; }
      if (SHORTCUTS[k]) { setTool(SHORTCUTS[k]); return; }
      if (k === "z" && !e.ctrlKey && !e.metaKey) { undo(); return; }
      if (k === "x") { redo(); return; }
      if (k === "[") setSize(s => Math.max(1, s - 1));
      if (k === "]") setSize(s => Math.min(40, s + 1));
      if (k === "c" && !e.ctrlKey && !e.metaKey) clearCanvas();
      if (k === "0") resetView();
      const idx = parseInt(k) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < COLORS.length) {
        setColor(COLORS[idx]);
        if (tool === "eraser") setTool("pen");
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") { spaceDown.current = false; isPanning.current = false; }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp); };
  }, [undo, redo, tool]);

  const cursor = spaceDown.current ? "grab" : tool === "eraser" ? "cell" : "crosshair";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#1a1a2e" }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div className="px-4 h-12 flex items-center justify-between shrink-0 gap-3 border-b"
        style={{ background: "#141428", borderColor: "rgba(144,213,255,0.15)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm transition-colors shrink-0">← Back</button>
          <div className="h-4 w-px bg-white/10 shrink-0" />
          <p className="text-sm font-semibold text-white/80 truncate">{challenge.title}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Stabilizer toggle */}
          <button onClick={() => setStabilize(v => !v)}
            className={`px-2 py-1 rounded-lg text-xs transition-all border ${
              stabilize_
                ? "bg-[#2baaee]/20 border-[#2baaee]/40 text-[#2baaee]"
                : "bg-white/5 border-white/10 text-white/40"
            }`}>
            ✦ Stabilize
          </button>
          {/* Zoom indicator */}
          <button onClick={resetView}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all font-mono">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setShowShortcuts(v => !v)}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all hidden sm:block">
            ⌨️
          </button>
          <button onClick={undo} title="Undo (Z)"
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">↩</button>
          <button onClick={redo} title="Redo (X)"
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">↪</button>
          <button onClick={clearCanvas}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-red-400 transition-all">🗑</button>
          <button onClick={() => hasDrawn && setShowRating(true)} disabled={!hasDrawn}
            className="px-3 py-1 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-30"
            style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
            Submit ✓
          </button>
        </div>
      </div>

      {/* ── Challenge strip ─────────────────────────── */}
      <div className="px-4 py-1.5 shrink-0 border-b" style={{ background: "rgba(43,170,238,0.08)", borderColor: "rgba(144,213,255,0.1)" }}>
        <p className="text-xs text-white/40 leading-relaxed">{challenge.description}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left toolbar ────────────────────────────── */}
        <div className="w-12 flex flex-col items-center py-3 gap-1 shrink-0 border-r overflow-y-auto"
          style={{ background: "#141428", borderColor: "rgba(144,213,255,0.1)" }}>
          {/* Tools */}
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)}
              title={`${t.label} (${t.shortcut})`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all ${
                tool === t.id
                  ? "bg-[#2baaee] shadow-lg shadow-sky-500/30"
                  : "hover:bg-white/10 text-white/50"
              }`}>
              {t.icon}
            </button>
          ))}

          <div className="w-6 h-px my-1" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Colors */}
          {COLORS.map((c, i) => (
            <button key={c} onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }}
              title={`Color ${i + 1}`}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                background: c,
                borderColor: color === c && tool !== "eraser" ? "#2baaee" : "rgba(255,255,255,0.12)",
                transform: color === c && tool !== "eraser" ? "scale(1.3)" : "scale(1)",
                boxShadow: color === c && tool !== "eraser" ? "0 0 8px rgba(43,170,238,0.6)" : "none",
                outline: c === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : "none",
              }} />
          ))}

          <div className="w-6 h-px my-1" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Size */}
          <button onClick={() => setSize(s => Math.min(40, s + 1))}
            className="w-7 h-7 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/10 font-bold transition-all">+</button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="rounded-full bg-white"
              style={{ width: Math.min(20, Math.max(2, size * 1.2)), height: Math.min(20, Math.max(2, size * 1.2)) }} />
          </div>
          <button onClick={() => setSize(s => Math.max(1, s - 1))}
            className="w-7 h-7 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/10 font-bold transition-all">−</button>
          <span className="text-xs text-white/30 font-mono">{size}</span>
        </div>

        {/* ── Canvas area ─────────────────────────────── */}
        <div ref={wrapRef} className="flex-1 relative overflow-hidden select-none"
          style={{ background: "#2a2a3e", cursor }}>
          <canvas ref={canvasRef}
            width={wrapRef.current?.clientWidth ?? 1200}
            height={wrapRef.current?.clientHeight ?? 800}
            className="absolute inset-0 w-full h-full touch-none"
            onMouseDown={pointerDown} onMouseMove={pointerMove}
            onMouseUp={pointerUp}    onMouseLeave={pointerUp}
            onTouchStart={pointerDown} onTouchMove={pointerMove} onTouchEnd={pointerUp}
            onWheel={onWheel} />

          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-5xl mb-3">✏️</p>
                <p className="text-white/40 text-sm font-medium">Start drawing</p>
                <p className="text-white/20 text-xs mt-1">Scroll to zoom · Space+drag to pan</p>
              </div>
            </div>
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 text-xs text-white/20 pointer-events-none font-mono">
            {Math.round(zoom * 100)}% · {W}×{H}
          </div>
        </div>
      </div>

      {/* ── Shortcuts panel ─────────────────────────── */}
      {showShortcuts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(20,20,40,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl p-6 max-w-xs w-full shadow-2xl border"
            style={{ background: "#1e1e36", borderColor: "rgba(144,213,255,0.15)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">⌨️ Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-white/40 hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-1.5">
              {[
                ["P", "Pencil — textured"],
                ["N", "Pen — pressure sensitive"],
                ["B", "Brush — soft & wide"],
                ["M", "Marker — flat fill"],
                ["E", "Eraser"],
                ["Z", "Undo"],
                ["X", "Redo"],
                ["Ctrl+Z / Ctrl+Y", "Undo / Redo"],
                ["[ / ]", "Size −/+"],
                ["C", "Clear canvas"],
                ["0", "Reset zoom & pan"],
                ["Space+drag", "Pan canvas"],
                ["Scroll", "Zoom in/out"],
                ["1–8", "Switch color"],
              ].map(([k, a]) => (
                <div key={k} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                  <span className="text-white/40 text-xs">{a}</span>
                  <kbd className="px-2 py-0.5 rounded-lg text-white/70 font-mono text-xs border border-white/10 shrink-0 ml-2"
                    style={{ background: "rgba(255,255,255,0.07)" }}>{k}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rating modal ─────────────────────────────── */}
      {showRating && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(20,20,40,0.85)", backdropFilter: "blur(12px)" }}>
          <div className="rounded-2xl w-full max-w-sm p-6 border shadow-2xl"
            style={{ background: "#1e1e36", borderColor: "rgba(144,213,255,0.2)" }}>
            <h3 className="font-bold text-lg text-white mb-1">How did it go?</h3>
            <p className="text-sm text-white/40 mb-5">Rate yourself honestly — this affects what unlocks next.</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {RATINGS.map((r) => (
                <button key={r.stars} onClick={() => setSelectedStars(r.stars)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    selectedStars === r.stars
                      ? "border-[#2baaee] bg-[#2baaee]/15"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={{ background: selectedStars === r.stars ? undefined : "rgba(255,255,255,0.03)" }}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-bold text-white">{r.label}</span>
                  <span className="text-xs text-white/40">{r.desc}</span>
                  <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowRating(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:bg-white/5 transition-all">
                Keep drawing
              </button>
              <button onClick={() => selectedStars > 0 && onSubmit(selectedStars)}
                disabled={selectedStars === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30"
                style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
                Save & continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
