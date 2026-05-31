"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Challenge } from "@/lib/data";

interface Props {
  challenge: Challenge;
  onSubmit: (stars: number) => void;
  onClose: () => void;
}

type Tool = "pencil" | "pen" | "brush" | "marker" | "eraser";

interface Stroke {
  tool: Tool;
  color: string;
  size: number;
  opacity: number;
  points: { x: number; y: number }[];
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

const TOOLS: { id: Tool; icon: string; label: string; shortcut: string }[] = [
  { id: "pencil",  icon: "✏️", label: "Pencil",  shortcut: "P" },
  { id: "pen",     icon: "🖊️", label: "Pen",     shortcut: "N" },
  { id: "brush",   icon: "🖌️", label: "Brush",   shortcut: "B" },
  { id: "marker",  icon: "🖍️", label: "Marker",  shortcut: "M" },
  { id: "eraser",  icon: "⬜", label: "Eraser",  shortcut: "E" },
];

const SHORTCUTS: Record<string, Tool> = {
  p: "pencil", n: "pen", b: "brush", m: "marker", e: "eraser",
};

// Tool rendering settings
function getToolStyle(tool: Tool, color: string, size: number) {
  switch (tool) {
    case "pencil":
      return { strokeStyle: color, lineWidth: size, globalAlpha: 0.82, lineCap: "round" as const, lineJoin: "round" as const };
    case "pen":
      return { strokeStyle: color, lineWidth: size * 0.8, globalAlpha: 1, lineCap: "round" as const, lineJoin: "round" as const };
    case "brush":
      return { strokeStyle: color, lineWidth: size * 3, globalAlpha: 0.55, lineCap: "round" as const, lineJoin: "round" as const };
    case "marker":
      return { strokeStyle: color, lineWidth: size * 4, globalAlpha: 0.4, lineCap: "square" as const, lineJoin: "miter" as const };
    case "eraser":
      return { strokeStyle: "#ffffff", lineWidth: size * 6, globalAlpha: 1, lineCap: "round" as const, lineJoin: "round" as const };
  }
}

export default function DrawingCanvas({ challenge, onSubmit, onClose }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [tool, setTool]   = useState<Tool>("pencil");
  const [color, setColor] = useState("#1a1a2e");
  const [size, setSize]   = useState(3);
  const [showRating, setShowRating]       = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hasDrawn, setHasDrawn]           = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const strokes    = useRef<Stroke[]>([]);
  const redoStack  = useRef<Stroke[]>([]);
  const current    = useRef<Stroke | null>(null);
  const isDrawing  = useRef(false);

  // Init white background
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  // Full redraw from stroke history
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes.current) renderStroke(ctx, s);
  }, []);

  function renderStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
    if (s.points.length < 2) return;
    const style = getToolStyle(s.tool, s.color, s.size);
    ctx.save();
    ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth   = style.lineWidth;
    ctx.globalAlpha = style.globalAlpha;
    ctx.lineCap     = style.lineCap;
    ctx.lineJoin    = style.lineJoin;

    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++) {
      ctx.lineTo(s.points[i].x, s.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

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
    current.current = { tool, color, size, opacity: 1, points: [pos] };

    // Draw a dot for the starting point
    const ctx = canvas.getContext("2d")!;
    const style = getToolStyle(tool, color, size);
    ctx.save();
    ctx.fillStyle = style.strokeStyle;
    ctx.globalAlpha = style.globalAlpha;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, style.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function pointerMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current || !current.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const pos = getPos(e, canvas);
    current.current.points.push(pos);

    // Draw incrementally
    const pts = current.current.points;
    if (pts.length < 2) return;
    const ctx = canvas.getContext("2d")!;
    const s = current.current;
    const style = getToolStyle(s.tool, s.color, s.size);

    ctx.save();
    ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth   = style.lineWidth;
    ctx.globalAlpha = style.globalAlpha;
    ctx.lineCap     = style.lineCap;
    ctx.lineJoin    = style.lineJoin;

    const i = pts.length - 1;
    ctx.beginPath();
    ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
    ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.restore();
  }

  function pointerUp() {
    if (!isDrawing.current || !current.current) return;
    isDrawing.current = false;
    strokes.current.push({ ...current.current, points: [...current.current.points] });
    current.current = null;
  }

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

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && k === "z") { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && k === "y") { e.preventDefault(); redo(); return; }

      if (SHORTCUTS[k]) { setTool(SHORTCUTS[k]); return; }
      if (k === "z" && !e.ctrlKey && !e.metaKey) { undo(); return; }
      if (k === "x") { redo(); return; }
      if (k === "[") setSize(s => Math.max(1, s - 1));
      if (k === "]") setSize(s => Math.min(30, s + 1));
      if (k === "c" && !e.ctrlKey && !e.metaKey) clearCanvas();
      const idx = parseInt(k) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < COLORS.length) {
        setColor(COLORS[idx]);
        if (tool === "eraser") setTool("pencil");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, tool]);

  const cursor = tool === "eraser" ? "cell" : "crosshair";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">

      {/* Top bar */}
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

      {/* Challenge strip */}
      <div className="bg-[#90D5FF]/10 border-b border-[#90D5FF]/20 px-4 py-2 shrink-0">
        <p className="text-xs text-[#4a7a9b] leading-relaxed">{challenge.description}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left toolbar */}
        <div className="w-14 border-r border-[#90D5FF]/20 bg-white flex flex-col items-center py-3 gap-1.5 shrink-0 overflow-y-auto">

          {/* Tools */}
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)}
              title={`${t.label} (${t.shortcut})`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                tool === t.id ? "bg-[#2baaee] shadow-sm scale-105" : "hover:bg-[#90D5FF]/20"
              }`}>
              {t.icon}
            </button>
          ))}

          <div className="w-8 h-px bg-[#90D5FF]/30 my-1" />

          {/* Colors */}
          {COLORS.map((c, i) => (
            <button key={c} onClick={() => { setColor(c); if (tool === "eraser") setTool("pencil"); }}
              title={`Color ${i + 1}`}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{
                background: c,
                borderColor: color === c && tool !== "eraser" ? "#2baaee" : "rgba(144,213,255,0.4)",
                transform: color === c && tool !== "eraser" ? "scale(1.25)" : "scale(1)",
                boxShadow: c === "#ffffff" ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "none",
              }} />
          ))}

          <div className="w-8 h-px bg-[#90D5FF]/30 my-1" />

          {/* Size */}
          <button onClick={() => setSize(s => Math.min(30, s + 1))}
            className="w-7 h-7 rounded-lg text-sm text-[#4a7a9b] hover:bg-[#90D5FF]/20 font-bold transition-all">+</button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#90D5FF]/10 border border-[#90D5FF]/30">
            <div className="rounded-full bg-[#1a1a2e]"
              style={{ width: Math.min(22, Math.max(2, size * 1.5)), height: Math.min(22, Math.max(2, size * 1.5)) }} />
          </div>
          <button onClick={() => setSize(s => Math.max(1, s - 1))}
            className="w-7 h-7 rounded-lg text-sm text-[#4a7a9b] hover:bg-[#90D5FF]/20 font-bold transition-all">−</button>
          <span className="text-xs text-[#4a7a9b]">{size}</span>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-white">

          <canvas ref={canvasRef} width={1600} height={1200}
            className="absolute inset-0 w-full h-full touch-none"
            style={{ cursor }}
            onMouseDown={pointerDown} onMouseMove={pointerMove}
            onMouseUp={pointerUp}   onMouseLeave={pointerUp}
            onTouchStart={pointerDown} onTouchMove={pointerMove} onTouchEnd={pointerUp} />

          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-5xl mb-3">✏️</p>
                <p className="text-[#4a7a9b] text-sm font-medium">Start drawing here</p>
                <p className="text-[#90D5FF] text-xs mt-1">Press ⌨️ Shortcuts for keyboard shortcuts</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shortcuts panel */}
      {showShortcuts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(144,213,255,0.2)", backdropFilter: "blur(8px)" }}>
          <div className="glass bg-white/95 rounded-2xl p-6 max-w-xs w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0d1f33]">⌨️ Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-[#4a7a9b] text-xl leading-none">×</button>
            </div>
            <div className="space-y-1.5 text-sm">
              {[
                ["P", "Pencil — textured"],
                ["N", "Pen — smooth"],
                ["B", "Brush — soft & wide"],
                ["M", "Marker — flat & opaque"],
                ["E", "Eraser"],
                ["Z", "Undo last stroke"],
                ["X", "Redo"],
                ["Ctrl+Z / Ctrl+Y", "Undo / Redo"],
                ["[ / ]", "Size −/+"],
                ["C", "Clear canvas"],
                ["1 – 8", "Switch color"],
              ].map(([k, a]) => (
                <div key={k} className="flex justify-between items-center py-1 border-b border-[#90D5FF]/20 last:border-0">
                  <span className="text-[#4a7a9b] text-xs">{a}</span>
                  <kbd className="px-2 py-0.5 rounded-lg bg-[#90D5FF]/20 text-[#0d1f33] font-mono text-xs border border-[#90D5FF]/30 shrink-0 ml-2">{k}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating modal */}
      {showRating && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(144,213,255,0.3)", backdropFilter: "blur(12px)" }}>
          <div className="glass relative rounded-2xl w-full max-w-sm p-6 overflow-hidden bg-white/90">
            <h3 className="font-bold text-lg text-[#0d1f33] mb-1">How did it go?</h3>
            <p className="text-sm text-[#4a7a9b] mb-5">Rate yourself honestly — this affects what unlocks next.</p>
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
