"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Challenge } from "@/lib/data";

interface Props {
  challenge: Challenge;
  onSubmit: (stars: number) => void;
  onClose: () => void;
}

type Tool = "pencil" | "pen" | "brush" | "eraser" | "line" | "circle" | "rect";

interface Stroke {
  tool: Tool;
  color: string;
  size: number;
  points: { x: number; y: number }[];
  // for shape tools
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const RATINGS = [
  { stars: 1, emoji: "🙂", label: "Tried it", desc: "Needs more practice" },
  { stars: 2, emoji: "😊", label: "Did OK", desc: "Looking good!" },
  { stars: 3, emoji: "🤩", label: "Nailed it", desc: "Excellent work!" },
];

const COLORS = [
  "#1a1a2e", "#4a4a6a", "#2baaee", "#3b82f6",
  "#f87171", "#34d399", "#fbbf24", "#a78bfa",
  "#f472b6", "#fb923c", "#ffffff", "#000000",
];

const TOOL_ICONS: Record<Tool, string> = {
  pencil: "✏️", pen: "🖊️", brush: "🖌️",
  eraser: "⬜", line: "📏", circle: "⭕", rect: "▭",
};

const SHORTCUTS: Record<string, string> = {
  p: "pencil", n: "pen", b: "brush", e: "eraser",
  l: "line", o: "circle", r: "rect",
};

export default function DrawingCanvas({ challenge, onSubmit, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#1a1a2e");
  const [size, setSize] = useState(3);
  const [showRating, setShowRating] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const strokes = useRef<Stroke[]>([]);
  const redoStack = useRef<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // ── Init canvas ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Redraw all strokes ───────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokes.current) drawStroke(ctx, stroke, false);
  }, []);

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, isPreview: boolean) {
    ctx.save();
    ctx.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
    ctx.lineWidth = stroke.tool === "eraser" ? stroke.size * 5 : stroke.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (stroke.tool === "pencil") {
      ctx.globalAlpha = 0.85;
      // Simulate pencil texture with slight jitter
      ctx.setLineDash([1, 0]);
    } else if (stroke.tool === "brush") {
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = stroke.size * 2.5;
    } else if (stroke.tool === "pen") {
      ctx.globalAlpha = 1;
      ctx.lineWidth = stroke.size;
    } else {
      ctx.globalAlpha = 1;
    }

    if (stroke.tool === "line" && stroke.start && stroke.end) {
      ctx.beginPath();
      ctx.moveTo(stroke.start.x, stroke.start.y);
      ctx.lineTo(stroke.end.x, stroke.end.y);
      ctx.stroke();
    } else if (stroke.tool === "circle" && stroke.start && stroke.end) {
      const rx = Math.abs(stroke.end.x - stroke.start.x) / 2;
      const ry = Math.abs(stroke.end.y - stroke.start.y) / 2;
      const cx = (stroke.start.x + stroke.end.x) / 2;
      const cy = (stroke.start.y + stroke.end.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (stroke.tool === "rect" && stroke.start && stroke.end) {
      ctx.beginPath();
      ctx.strokeRect(
        stroke.start.x, stroke.start.y,
        stroke.end.x - stroke.start.x,
        stroke.end.y - stroke.start.y
      );
    } else if (stroke.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        if (stroke.tool === "pencil" && i % 2 === 0) {
          // Slight jitter for pencil texture
          const jx = stroke.points[i].x + (Math.random() - 0.5) * 0.5;
          const jy = stroke.points[i].y + (Math.random() - 0.5) * 0.5;
          ctx.lineTo(jx, jy);
        } else {
          const mid = {
            x: (stroke.points[i - 1].x + stroke.points[i].x) / 2,
            y: (stroke.points[i - 1].y + stroke.points[i].y) / 2,
          };
          ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, mid.x, mid.y);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Preview canvas for shape tools ──────────────────────
  function drawPreview(end: { x: number; y: number }) {
    const preview = previewRef.current;
    if (!preview || !dragStart.current) return;
    const ctx = preview.getContext("2d")!;
    ctx.clearRect(0, 0, preview.width, preview.height);
    if (!currentStroke.current) return;
    const s = { ...currentStroke.current, start: dragStart.current, end };
    drawStroke(ctx, s, true);
  }

  // ── Get pointer position ─────────────────────────────────
  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = "touches" in e ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  }

  function pointerDown(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    isDrawing.current = true;
    setHasDrawn(true);
    redoStack.current = [];
    const pos = getPos(e, canvas);
    const isShape = tool === "line" || tool === "circle" || tool === "rect";
    currentStroke.current = { tool, color, size, points: isShape ? [] : [pos], start: pos };
    if (!isShape) {
      const ctx = canvas.getContext("2d")!;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tool === "eraser" ? size * 2.5 : size / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.fill();
    }
    dragStart.current = pos;
  }

  function pointerMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current || !currentStroke.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const pos = getPos(e, canvas);
    const isShape = tool === "line" || tool === "circle" || tool === "rect";

    if (isShape) {
      drawPreview(pos);
    } else {
      currentStroke.current.points.push(pos);
      // Draw incrementally for performance
      const ctx = canvas.getContext("2d")!;
      const pts = currentStroke.current.points;
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = tool === "eraser" ? size * 5 : tool === "brush" ? size * 2.5 : size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = tool === "brush" ? 0.7 : tool === "pencil" ? 0.85 : 1;
      ctx.beginPath();
      const i = pts.length - 1;
      const mid = { x: (pts[i - 1].x + pts[i].x) / 2, y: (pts[i - 1].y + pts[i].y) / 2 };
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, mid.x, mid.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function pointerUp(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current || !currentStroke.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = false;
    const pos = getPos(e, canvas);
    const isShape = tool === "line" || tool === "circle" || tool === "rect";

    if (isShape) {
      currentStroke.current.end = pos;
      const ctx = canvas.getContext("2d")!;
      drawStroke(ctx, currentStroke.current, false);
      // Clear preview
      const preview = previewRef.current;
      if (preview) preview.getContext("2d")!.clearRect(0, 0, preview.width, preview.height);
    }

    strokes.current.push({ ...currentStroke.current });
    currentStroke.current = null;
    dragStart.current = null;
  }

  // ── Undo / Redo ──────────────────────────────────────────
  const undo = useCallback(() => {
    if (strokes.current.length === 0) return;
    const last = strokes.current.pop()!;
    redoStack.current.push(last);
    redraw();
  }, [redraw]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    strokes.current.push(next);
    redraw();
  }, [redraw]);

  function clearCanvas() {
    strokes.current = [];
    redoStack.current = [];
    redraw();
    setHasDrawn(false);
  }

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      const k = e.key.toLowerCase();
      if (SHORTCUTS[k]) { setTool(SHORTCUTS[k] as Tool); return; }
      if (k === "z" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); undo(); return; }
      if (k === "y" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); redo(); return; }
      if (k === "z" && !e.ctrlKey && !e.metaKey) { undo(); return; }
      if (k === "x") { redo(); return; }
      if (k === "[") setSize((s) => Math.max(1, s - 1));
      if (k === "]") setSize((s) => Math.min(30, s + 1));
      if (k === "c" && !e.ctrlKey) clearCanvas();
      // Color shortcuts 1-8
      const idx = parseInt(k) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < COLORS.length) setColor(COLORS[idx]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const toolCursor: Record<Tool, string> = {
    pencil: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z' fill='%231a1a2e'/%3E%3C/svg%3E\") 0 24, crosshair",
    pen: "crosshair",
    brush: "crosshair",
    eraser: "cell",
    line: "crosshair",
    circle: "crosshair",
    rect: "crosshair",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">

      {/* ── Top bar ── */}
      <div className="border-b border-[#90D5FF]/30 bg-white px-4 h-14 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors shrink-0">← Back</button>
          <div className="h-4 w-px bg-[#90D5FF]/30 shrink-0" />
          <p className="text-sm font-bold text-[#0d1f33] truncate">{challenge.title}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setShowShortcuts(v => !v)}
            className="px-2 py-1.5 rounded-lg text-xs text-[#4a7a9b] hover:bg-[#90D5FF]/10 border border-[#90D5FF]/30 transition-all hidden sm:block">
            ⌨️ Shortcuts
          </button>
          <button onClick={undo} title="Undo (Z)"
            className="px-2 py-1.5 rounded-lg text-xs text-[#4a7a9b] hover:bg-[#90D5FF]/10 border border-[#90D5FF]/30 transition-all">
            ↩ Undo
          </button>
          <button onClick={redo} title="Redo (X)"
            className="px-2 py-1.5 rounded-lg text-xs text-[#4a7a9b] hover:bg-[#90D5FF]/10 border border-[#90D5FF]/30 transition-all">
            ↪ Redo
          </button>
          <button onClick={clearCanvas}
            className="px-2 py-1.5 rounded-lg text-xs text-[#4a7a9b] hover:text-red-500 hover:bg-red-50 border border-[#90D5FF]/30 transition-all">
            🗑 Clear
          </button>
          <button onClick={() => hasDrawn && setShowRating(true)} disabled={!hasDrawn}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
            Submit ✓
          </button>
        </div>
      </div>

      {/* ── Challenge strip ── */}
      <div className="bg-[#90D5FF]/10 border-b border-[#90D5FF]/20 px-4 py-2 shrink-0">
        <p className="text-xs text-[#4a7a9b] leading-relaxed">{challenge.description}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left toolbar ── */}
        <div className="w-14 border-r border-[#90D5FF]/20 bg-white flex flex-col items-center py-3 gap-1.5 shrink-0 overflow-y-auto">
          {(Object.keys(TOOL_ICONS) as Tool[]).map((t) => (
            <button key={t} onClick={() => setTool(t)} title={`${t} (${Object.entries(SHORTCUTS).find(([, v]) => v === t)?.[0] ?? ""})`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                tool === t
                  ? "bg-[#2baaee] shadow-sm"
                  : "hover:bg-[#90D5FF]/20 text-[#4a7a9b]"
              }`}>
              {TOOL_ICONS[t]}
            </button>
          ))}

          <div className="w-8 h-px bg-[#90D5FF]/30 my-1" />

          {/* Color swatches */}
          {COLORS.map((c, i) => (
            <button key={c} onClick={() => { setColor(c); if (tool === "eraser") setTool("pencil"); }}
              title={`Color ${i + 1}`}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{
                background: c,
                borderColor: color === c ? "#2baaee" : "rgba(144,213,255,0.4)",
                transform: color === c ? "scale(1.2)" : "scale(1)",
                boxShadow: c === "#ffffff" ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "none",
              }} />
          ))}

          <div className="w-8 h-px bg-[#90D5FF]/30 my-1" />

          {/* Size */}
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => setSize(s => Math.max(1, s - 1))}
              className="w-7 h-7 rounded-lg text-xs text-[#4a7a9b] hover:bg-[#90D5FF]/20 font-bold transition-all">−</button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#90D5FF]/10 border border-[#90D5FF]/30">
              <div className="rounded-full bg-[#1a1a2e]"
                style={{ width: Math.min(20, Math.max(2, size)), height: Math.min(20, Math.max(2, size)) }} />
            </div>
            <button onClick={() => setSize(s => Math.min(30, s + 1))}
              className="w-7 h-7 rounded-lg text-xs text-[#4a7a9b] hover:bg-[#90D5FF]/20 font-bold transition-all">+</button>
            <span className="text-xs text-[#4a7a9b]">{size}</span>
          </div>
        </div>

        {/* ── Canvas ── */}
        <div className="flex-1 relative overflow-hidden bg-slate-100">
          {/* Grid background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(144,213,255,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

          <canvas ref={canvasRef} width={1600} height={1200}
            className="absolute inset-0 w-full h-full touch-none"
            style={{ cursor: toolCursor[tool] }}
            onMouseDown={pointerDown} onMouseMove={pointerMove}
            onMouseUp={pointerUp} onMouseLeave={pointerUp}
            onTouchStart={pointerDown} onTouchMove={pointerMove} onTouchEnd={pointerUp} />

          {/* Preview canvas for shape tools */}
          <canvas ref={previewRef} width={1600} height={1200}
            className="absolute inset-0 w-full h-full pointer-events-none" />

          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-4xl mb-2">✏️</p>
                <p className="text-[#4a7a9b] text-sm">Start drawing here</p>
                <p className="text-[#90D5FF] text-xs mt-1">Press ⌨️ Shortcuts to see keyboard shortcuts</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Shortcuts panel ── */}
      {showShortcuts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(144,213,255,0.2)", backdropFilter: "blur(8px)" }}>
          <div className="glass bg-white/90 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0d1f33]">⌨️ Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-[#4a7a9b] text-xl">×</button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["P", "Pencil"],
                ["N", "Pen"],
                ["B", "Brush"],
                ["E", "Eraser"],
                ["L", "Line tool"],
                ["O", "Circle tool"],
                ["R", "Rectangle tool"],
                ["Z", "Undo last stroke"],
                ["X", "Redo"],
                ["Ctrl+Z", "Undo"],
                ["Ctrl+Y", "Redo"],
                ["[ / ]", "Decrease / Increase size"],
                ["C", "Clear canvas"],
                ["1–8", "Switch to color 1–8"],
              ].map(([key, action]) => (
                <div key={key} className="flex justify-between items-center py-1 border-b border-[#90D5FF]/20">
                  <span className="text-[#4a7a9b]">{action}</span>
                  <kbd className="px-2 py-0.5 rounded-lg bg-[#90D5FF]/20 text-[#0d1f33] font-mono text-xs border border-[#90D5FF]/30">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rating modal ── */}
      {showRating && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(144,213,255,0.3)", backdropFilter: "blur(12px)" }}>
          <div className="glass relative rounded-2xl w-full max-w-sm p-6 overflow-hidden bg-white/90">
            <h3 className="font-bold text-lg text-[#0d1f33] mb-1">How did it go?</h3>
            <p className="text-sm text-[#4a7a9b] mb-5">Rate your attempt honestly — this affects what unlocks next.</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {RATINGS.map((r) => (
                <button key={r.stars} onClick={() => setSelectedStars(r.stars)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    selectedStars === r.stars ? "border-[#2baaee] bg-[#90D5FF]/20" : "border-[#90D5FF]/30 hover:border-[#2baaee]/50"
                  }`}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-bold text-[#0d1f33]">{r.label}</span>
                  <span className="text-xs text-[#4a7a9b]">{r.desc}</span>
                  <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowRating(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-[#4a7a9b] border border-[#90D5FF]/40 hover:bg-[#90D5FF]/10 transition-all">
                Keep drawing
              </button>
              <button onClick={() => selectedStars > 0 && onSubmit(selectedStars)}
                disabled={selectedStars === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
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
