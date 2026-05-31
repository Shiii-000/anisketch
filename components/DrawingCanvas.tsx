"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Challenge } from "@/lib/data";

interface Props {
  challenge: Challenge;
  onSubmit: (stars: number, dataUrl: string) => void;
  onClose: () => void;
}

type Tool = "pencil" | "pen" | "brush" | "marker" | "eraser" | "bucket" | "eyedropper" | "smudge";

interface Point { x: number; y: number; pressure: number; time: number; }
interface Stroke { tool: Tool; color: string; size: number; opacity: number; points: Point[]; }

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

const DRAW_TOOLS: { id: Tool; icon: string; label: string; shortcut: string }[] = [
  { id: "pencil",     icon: "✏️", label: "Pencil",     shortcut: "P" },
  { id: "pen",        icon: "🖊️", label: "Pen",        shortcut: "N" },
  { id: "brush",      icon: "🖌️", label: "Brush",      shortcut: "B" },
  { id: "marker",     icon: "🖍️", label: "Marker",     shortcut: "M" },
  { id: "smudge",     icon: "💧", label: "Smudge",     shortcut: "S" },
  { id: "eraser",     icon: "⬜", label: "Eraser",     shortcut: "E" },
  { id: "bucket",     icon: "🪣", label: "Fill",       shortcut: "F" },
  { id: "eyedropper", icon: "🎨", label: "Eyedropper", shortcut: "I" },
];

const SHORTCUTS: Record<string, Tool> = {
  p:"pencil", n:"pen", b:"brush", m:"marker",
  s:"smudge", e:"eraser", f:"bucket", i:"eyedropper",
};

// ─── Catmull-Rom spline smoothing ─────────────────────────
function catmullRom(pts: Point[]): Point[] {
  if (pts.length < 3) return pts;
  const out: Point[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let t = 0.15; t <= 1; t += 0.15) {
      const t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
        pressure: p1.pressure + (p2.pressure - p1.pressure) * t,
        time: p1.time,
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function stabilize(pts: Point[], w = 5): Point[] {
  return pts.map((p, i) => {
    const sl = pts.slice(Math.max(0, i - w), i + 1);
    return { ...p,
      x: sl.reduce((a, b) => a + b.x, 0) / sl.length,
      y: sl.reduce((a, b) => a + b.y, 0) / sl.length,
    };
  });
}

// ─── Flood fill ───────────────────────────────────────────
function floodFill(ctx: CanvasRenderingContext2D, sx: number, sy: number, fillColor: string, w: number, h: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  const x0 = Math.round(sx), y0 = Math.round(sy);
  const idx = (y0 * w + x0) * 4;
  const tr = data[idx], tg = data[idx+1], tb = data[idx+2], ta = data[idx+3];

  // Parse fill color
  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = 1;
  const tc = tmp.getContext("2d")!;
  tc.fillStyle = fillColor;
  tc.fillRect(0, 0, 1, 1);
  const fc = tc.getImageData(0, 0, 1, 1).data;
  const [fr, fg, fb, fa] = [fc[0], fc[1], fc[2], fc[3]];

  if (tr === fr && tg === fg && tb === fb && ta === fa) return;

  const tolerance = 30;
  function match(i: number) {
    return Math.abs(data[i]-tr) <= tolerance &&
           Math.abs(data[i+1]-tg) <= tolerance &&
           Math.abs(data[i+2]-tb) <= tolerance &&
           Math.abs(data[i+3]-ta) <= tolerance;
  }

  const stack = [x0 + y0 * w];
  const visited = new Uint8Array(w * h);
  while (stack.length) {
    const pos = stack.pop()!;
    if (visited[pos]) continue;
    visited[pos] = 1;
    const i = pos * 4;
    if (!match(i)) continue;
    data[i] = fr; data[i+1] = fg; data[i+2] = fb; data[i+3] = fa;
    const x = pos % w, y = Math.floor(pos / w);
    if (x > 0)     stack.push(pos - 1);
    if (x < w - 1) stack.push(pos + 1);
    if (y > 0)     stack.push(pos - w);
    if (y < h - 1) stack.push(pos + w);
  }
  ctx.putImageData(img, 0, 0);
}

// ─── Eyedropper ───────────────────────────────────────────
function pickColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
  const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
  return `rgb(${d[0]},${d[1]},${d[2]})`;
}

// ─── Smudge ───────────────────────────────────────────────
function smudgeAt(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, size: number) {
  const r = size * 3;
  const imgData = ctx.getImageData(Math.max(0, px - r), Math.max(0, py - r), r * 2, r * 2);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.drawImage(
    createImageBitmap(imgData) as unknown as HTMLImageElement,
    px - r + (x - px) * 0.4,
    py - r + (y - py) * 0.4,
  );
  ctx.restore();
}

export default function DrawingCanvas({ challenge, onSubmit, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreen = useRef<HTMLCanvasElement | null>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  const [tool,     setTool]     = useState<Tool>("pen");
  const [color,    setColor]    = useState("#0d0d0d");
  const [size,     setSize]     = useState(4);
  const [opacity,  setOpacity]  = useState(100);
  const [zoom,     setZoom]     = useState(1);
  const [pan,      setPan]      = useState({ x: 0, y: 0 });
  const [flipped,  setFlipped]  = useState(false);
  const [showRating,    setShowRating]    = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hasDrawn,      setHasDrawn]      = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [doStabilize,   setDoStabilize]   = useState(true);

  const strokes   = useRef<Stroke[]>([]);
  const redoStack = useRef<Stroke[]>([]);
  const current   = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const spaceDown = useRef(false);
  const lastPan   = useRef({ x: 0, y: 0 });
  const panOff    = useRef({ x: 0, y: 0 });
  const prevPos   = useRef<{ x: number; y: number } | null>(null);

  const W = 2400, H = 1800;

  // ── Init ─────────────────────────────────────────────
  useEffect(() => {
    const oc = document.createElement("canvas");
    oc.width = W; oc.height = H;
    const ctx = oc.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    offscreen.current = oc;
    composite();
  }, []);

  // ── Composite ────────────────────────────────────────
  const composite = useCallback(() => {
    const canvas = canvasRef.current;
    const oc = offscreen.current;
    if (!canvas || !oc) return;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#fff";
    ctx.fillRect(pan.x, pan.y, W * zoom, H * zoom);
    ctx.shadowBlur = 0;
    if (flipped) {
      ctx.translate(pan.x + W * zoom, pan.y);
      ctx.scale(-zoom, zoom);
      ctx.drawImage(oc, 0, 0, W, H);
    } else {
      ctx.drawImage(oc, pan.x, pan.y, W * zoom, H * zoom);
    }
    ctx.restore();
  }, [zoom, pan, flipped]);

  useEffect(() => { composite(); }, [zoom, pan, flipped, composite]);

  // ── Render stroke ─────────────────────────────────────
  function renderStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
    if (s.points.length < 2) return;
    let pts = s.points;
    if (doStabilize && pts.length > 4) pts = stabilize(pts);
    if (pts.length > 3) pts = catmullRom(pts);

    const alpha = (s.opacity / 100);

    function path() {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }

    ctx.save();
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";

    switch (s.tool) {
      case "eraser":
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = s.size * 8;
        ctx.globalAlpha = 1;
        path(); break;
      case "pen":
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalAlpha = alpha;
        path(); break;
      case "pencil":
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalAlpha = alpha * 0.88;
        path(); break;
      case "brush":
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 3.5;
        ctx.globalAlpha = alpha * 0.45;
        path(); break;
      case "marker":
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 5;
        ctx.globalAlpha = alpha * 0.4;
        ctx.lineCap = "square";
        path(); break;
    }
    ctx.restore();
  }

  // ── Pointer coords ────────────────────────────────────
  function toDoc(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = (clientX - rect.left) * (canvas.width / rect.width);
    const cy = (clientY - rect.top)  * (canvas.height / rect.height);
    return { x: (cx - pan.x) / zoom, y: (cy - pan.y) / zoom };
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const src = "touches" in e ? e.touches[0] : e;
    return toDoc(src.clientX, src.clientY);
  }

  // ── Pointer events ────────────────────────────────────
  function pointerDown(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();

    // Pan
    if (spaceDown.current) {
      isPanning.current = true;
      const src = "touches" in e ? e.touches[0] : e;
      lastPan.current = { x: src.clientX, y: src.clientY };
      panOff.current  = { ...pan };
      return;
    }

    const pos = getPos(e);
    const oc  = offscreen.current;

    // Eyedropper — instant pick
    if (tool === "eyedropper" && oc) {
      const ctx = oc.getContext("2d")!;
      const picked = pickColor(ctx, pos.x, pos.y);
      setColor(picked);
      setTool("pen");
      return;
    }

    // Bucket — instant fill
    if (tool === "bucket" && oc) {
      const ctx = oc.getContext("2d")!;
      floodFill(ctx, pos.x, pos.y, color, W, H);
      // Save as a stroke marker for undo (empty points = bucket action)
      strokes.current.push({ tool: "bucket", color, size, opacity, points: [{ ...pos, pressure: 1, time: Date.now() }] });
      redoStack.current = [];
      setHasDrawn(true);
      composite();
      return;
    }

    isDrawing.current = true;
    setHasDrawn(true);
    redoStack.current = [];
    prevPos.current = pos;
    current.current = { tool, color, size, opacity, points: [{ ...pos, pressure: 0.5, time: Date.now() }] };
  }

  function pointerMove(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();

    if (isPanning.current) {
      const src = "touches" in e ? e.touches[0] : e;
      setPan({
        x: panOff.current.x + src.clientX - lastPan.current.x,
        y: panOff.current.y + src.clientY - lastPan.current.y,
      });
      return;
    }

    if (!isDrawing.current || !current.current) return;
    const pos = getPos(e);
    const prev = prevPos.current ?? pos;

    // Smudge: work directly on offscreen
    if (tool === "smudge" && offscreen.current) {
      const ctx = offscreen.current.getContext("2d")!;
      const r = size * 3;
      try {
        const img = ctx.getImageData(Math.max(0, prev.x - r), Math.max(0, prev.y - r), r * 2, r * 2);
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.putImageData(img,
          Math.max(0, prev.x - r) + (pos.x - prev.x) * 0.5,
          Math.max(0, prev.y - r) + (pos.y - prev.y) * 0.5
        );
        ctx.restore();
      } catch {}
      prevPos.current = pos;
      composite();
      return;
    }

    current.current.points.push({ ...pos, pressure: 0.5, time: Date.now() });

    prevPos.current = pos;

    // Live preview
    const canvas = canvasRef.current;
    const oc = offscreen.current;
    if (!canvas || !oc) return;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#fff";
    ctx.fillRect(pan.x, pan.y, W * zoom, H * zoom);
    ctx.shadowBlur = 0;
    ctx.drawImage(oc, pan.x, pan.y, W * zoom, H * zoom);
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    renderStroke(ctx, current.current);
    ctx.restore();
  }

  function pointerUp() {
    if (isPanning.current) { isPanning.current = false; return; }
    if (!isDrawing.current || !current.current) return;
    isDrawing.current = false;
    if (tool !== "smudge" && tool !== "bucket") {
      const oc = offscreen.current;
      if (oc) renderStroke(oc.getContext("2d")!, current.current);
      strokes.current.push({ ...current.current, points: [...current.current.points] });
    }
    current.current = null;
    prevPos.current = null;
    composite();
  }

  // ── Zoom ─────────────────────────────────────────────
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const nz = Math.max(0.1, Math.min(10, zoom * factor));
    setPan(p => ({ x: mx - (mx - p.x) * (nz / zoom), y: my - (my - p.y) * (nz / zoom) }));
    setZoom(nz);
  }

  // ── Undo / Redo ───────────────────────────────────────
  const redraw = useCallback(() => {
    const oc = offscreen.current;
    if (!oc) return;
    const ctx = oc.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    for (const s of strokes.current) {
      if (s.tool === "bucket") {
        floodFill(ctx, s.points[0].x, s.points[0].y, s.color, W, H);
      } else {
        renderStroke(ctx, s);
      }
    }
    composite();
  }, [composite]);

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
    const oc = offscreen.current;
    if (oc) {
      const ctx = oc.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }
    composite();
    setHasDrawn(false);
  }

  // ── Keyboard ──────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space")   { spaceDown.current = true;  e.preventDefault(); return; }
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && k === "y") { e.preventDefault(); redo(); return; }
      if (SHORTCUTS[k]) { setTool(SHORTCUTS[k]); return; }
      if (k === "z" && !e.ctrlKey) { undo(); return; }
      if (k === "x") { redo(); return; }
      if (k === "[") setSize(s => Math.max(1, s - 1));
      if (k === "]") setSize(s => Math.min(40, s + 1));
      if (k === "c" && !e.ctrlKey) clearCanvas();
      if (k === "0") { setZoom(1); setPan({ x: 0, y: 0 }); }
      if (k === "h") setFlipped(f => !f);
      const idx = parseInt(k) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < COLORS.length) {
        setColor(COLORS[idx]);
        if (tool === "eraser" || tool === "eyedropper") setTool("pen");
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space")   { spaceDown.current = false; isPanning.current = false; }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup",   onKeyUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp); };
  }, [undo, redo, tool]);

  const cursor = tool === "eyedropper" ? "crosshair"
    : tool === "bucket" ? "cell"
    : tool === "eraser"  ? "cell"
    : spaceDown.current  ? "grab"
    : "crosshair";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#1a1a2e" }}>

      {/* Top bar */}
      <div className="px-4 h-12 flex items-center justify-between shrink-0 border-b gap-2"
        style={{ background: "#141428", borderColor: "rgba(144,213,255,0.12)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm transition-colors shrink-0">← Back</button>
          <div className="h-4 w-px bg-white/10 shrink-0" />
          <p className="text-sm font-semibold text-white/70 truncate">{challenge.title}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <button onClick={() => setDoStabilize(v => !v)}
            className={`px-2 py-1 rounded-lg text-xs border transition-all ${doStabilize ? "bg-[#2baaee]/20 border-[#2baaee]/40 text-[#2baaee]" : "bg-white/5 border-white/10 text-white/30"}`}>
            ✦ Stable
          </button>
          <button onClick={() => setFlipped(f => !f)} title="Flip canvas (H)"
            className={`px-2 py-1 rounded-lg text-xs border transition-all ${flipped ? "bg-[#2baaee]/20 border-[#2baaee]/40 text-[#2baaee]" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}>
            ↔️ Flip
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all font-mono">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setShowShortcuts(v => !v)}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all hidden sm:block">⌨️</button>
          <button onClick={undo}  className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">↩</button>
          <button onClick={redo}  className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">↪</button>
          <button onClick={clearCanvas} className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-red-400 transition-all">🗑</button>
          <button
            onClick={() => {
              const oc = offscreen.current;
              if (!oc) return;
              const a = document.createElement("a");
              a.href = oc.toDataURL("image/png");
              a.download = `anisketch-${challenge.title.replace(/\s+/g,"-").toLowerCase()}.png`;
              a.click();
            }}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            ⬇️
          </button>
          <button onClick={() => hasDrawn && setShowRating(true)} disabled={!hasDrawn}
            className="px-3 py-1 rounded-lg text-xs font-bold text-white disabled:opacity-30 transition-all"
            style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>Submit ✓</button>
        </div>
      </div>

      {/* Challenge strip */}
      <div className="px-4 py-1.5 shrink-0 border-b" style={{ background: "rgba(43,170,238,0.07)", borderColor: "rgba(144,213,255,0.1)" }}>
        <p className="text-xs text-white/35">{challenge.description}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left toolbar */}
        <div className="w-12 flex flex-col items-center py-2 gap-1 shrink-0 border-r overflow-y-auto"
          style={{ background: "#141428", borderColor: "rgba(144,213,255,0.1)" }}>

          {DRAW_TOOLS.map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)}
              title={`${t.label} (${t.shortcut})`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all ${
                tool === t.id ? "bg-[#2baaee] shadow-lg shadow-sky-500/30 scale-105" : "hover:bg-white/10 text-white/50"
              }`}>
              {t.icon}
            </button>
          ))}

          <div className="w-6 h-px my-1" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Current color preview */}
          <div className="w-8 h-8 rounded-lg border-2 border-white/20 mb-1 cursor-pointer"
            style={{ background: color }} title="Current color" />

          {/* Color swatches */}
          {COLORS.map((c, i) => (
            <button key={c} onClick={() => { setColor(c); if (tool === "eraser" || tool === "eyedropper") setTool("pen"); }}
              title={`Color ${i + 1}`}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                background: c,
                borderColor: color === c && tool !== "eraser" ? "#2baaee" : "rgba(255,255,255,0.1)",
                transform: color === c && tool !== "eraser" ? "scale(1.3)" : "scale(1)",
                boxShadow: color === c && tool !== "eraser" ? "0 0 8px rgba(43,170,238,0.5)" : "none",
                outline: c === "#ffffff" ? "1px solid rgba(255,255,255,0.15)" : "none",
              }} />
          ))}

          <div className="w-6 h-px my-1" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Size */}
          <button onClick={() => setSize(s => Math.min(40, s + 1))} className="w-7 h-5 text-xs text-white/40 hover:text-white font-bold transition-all">+</button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="rounded-full bg-white" style={{ width: Math.min(22, Math.max(2, size * 1.1)), height: Math.min(22, Math.max(2, size * 1.1)) }} />
          </div>
          <button onClick={() => setSize(s => Math.max(1, s - 1))} className="w-7 h-5 text-xs text-white/40 hover:text-white font-bold transition-all">−</button>
          <span className="text-xs text-white/25 font-mono">{size}</span>

          <div className="w-6 h-px my-1" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Opacity */}
          <span className="text-xs text-white/25" style={{ writingMode: "vertical-rl", fontSize: 9 }}>OPACITY</span>
          <input type="range" min={5} max={100} value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            className="h-16 cursor-pointer accent-sky-400"
            style={{ writingMode: "vertical-lr", direction: "rtl", width: 20 }} />
          <span className="text-xs text-white/25 font-mono" style={{ fontSize: 9 }}>{opacity}%</span>
        </div>

        {/* Canvas */}
        <div ref={wrapRef} className="flex-1 relative overflow-hidden select-none" style={{ cursor }}>
          <canvas ref={canvasRef}
            width={wrapRef.current?.clientWidth  ?? 1200}
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
                <p className="text-white/30 text-sm">Start drawing</p>
                <p className="text-white/15 text-xs mt-1">Scroll = zoom · Space+drag = pan · H = flip</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-3 right-3 text-xs text-white/15 pointer-events-none font-mono">
            {Math.round(zoom * 100)}% · {W}×{H}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      {showShortcuts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(10,10,25,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl p-6 max-w-xs w-full shadow-2xl border"
            style={{ background: "#1e1e36", borderColor: "rgba(144,213,255,0.12)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">⌨️ Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-white/40 hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-1">
              {[
                ["P","Pencil"], ["N","Pen"], ["B","Brush"], ["M","Marker"],
                ["S","Smudge"], ["E","Eraser"], ["F","Fill (bucket)"], ["I","Eyedropper"],
                ["Z","Undo"], ["X","Redo"], ["Ctrl+Z / Ctrl+Y","Undo / Redo"],
                ["[ / ]","Size −/+"], ["C","Clear"], ["0","Reset view"],
                ["H","Flip canvas"],
                ["Space+drag","Pan"], ["Scroll","Zoom"], ["1–8","Color"],
              ].map(([k, a]) => (
                <div key={k} className="flex justify-between items-center py-0.5 border-b border-white/5 last:border-0">
                  <span className="text-white/35 text-xs">{a}</span>
                  <kbd className="px-1.5 py-0.5 rounded text-white/60 font-mono text-xs border border-white/10 ml-2 shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)" }}>{k}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating */}
      {showRating && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(10,10,25,0.88)", backdropFilter: "blur(12px)" }}>
          <div className="rounded-2xl w-full max-w-sm p-6 border shadow-2xl"
            style={{ background: "#1e1e36", borderColor: "rgba(144,213,255,0.18)" }}>
            <h3 className="font-bold text-lg text-white mb-1">How did it go?</h3>
            <p className="text-sm text-white/35 mb-5">Rate yourself honestly — this affects what unlocks next.</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {RATINGS.map((r) => (
                <button key={r.stars} onClick={() => setSelectedStars(r.stars)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    selectedStars === r.stars ? "border-[#2baaee] bg-[#2baaee]/15" : "border-white/10 hover:border-white/20"
                  }`} style={{ background: selectedStars === r.stars ? undefined : "rgba(255,255,255,0.03)" }}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-bold text-white">{r.label}</span>
                  <span className="text-xs text-white/35">{r.desc}</span>
                  <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowRating(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/35 border border-white/10 hover:bg-white/5 transition-all">
                Keep drawing
              </button>
              <button onClick={() => {
                if (selectedStars === 0) return;
                const oc = offscreen.current;
                const dataUrl = oc ? oc.toDataURL("image/jpeg", 0.7) : "";
                onSubmit(selectedStars, dataUrl);
              }}
                disabled={selectedStars === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-30 transition-all"
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
