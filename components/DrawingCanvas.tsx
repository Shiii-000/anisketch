"use client";

import { useEffect, useRef, useState } from "react";
import type { Challenge } from "@/lib/data";

interface Props {
  challenge: Challenge;
  onSubmit: (stars: number) => void;
  onClose: () => void;
}

const RATINGS = [
  { stars: 1, emoji: "🙂", label: "Tried it", desc: "Needs more practice" },
  { stars: 2, emoji: "😊", label: "Did OK", desc: "Looking good!" },
  { stars: 3, emoji: "🤩", label: "Nailed it", desc: "Excellent work!" },
];

const DIFF_LABEL = ["", "Easy", "Medium", "Hard"];
const DIFF_COLOR = ["", "text-emerald-600", "text-amber-600", "text-red-500"];

export default function DrawingCanvas({ challenge, onSubmit, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [strokeSize, setStrokeSize] = useState(3);
  const [color, setColor] = useState("#1a1a2e");
  const [showRating, setShowRating] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const COLORS = ["#1a1a2e", "#2baaee", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#ffffff"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    lastPos.current = getPos(e, canvas);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? strokeSize * 6 : strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw() {
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="border-b border-[#90D5FF]/30 bg-white/90 backdrop-blur-xl px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">← Back</button>
          <div className="h-4 w-px bg-[#90D5FF]/30" />
          <div>
            <span className="font-bold text-sm text-[#0d1f33]">{challenge.title}</span>
            <span className={`ml-2 text-xs ${DIFF_COLOR[challenge.difficulty]}`}>{DIFF_LABEL[challenge.difficulty]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg text-xs text-[#4a7a9b] hover:text-red-500 hover:bg-red-50 transition-all border border-[#90D5FF]/30">
            🗑 Clear
          </button>
          <button
            onClick={() => hasDrawn && setShowRating(true)}
            disabled={!hasDrawn}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
            Submit ✓
          </button>
        </div>
      </div>

      {/* Challenge description bar */}
      <div className="bg-[#90D5FF]/10 border-b border-[#90D5FF]/20 px-4 py-2 shrink-0">
        <p className="text-xs text-[#4a7a9b] leading-relaxed">{challenge.description}</p>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <canvas
          ref={canvasRef}
          width={1200}
          height={900}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-4xl mb-2">✏️</p>
              <p className="text-[#4a7a9b] text-sm">Start drawing here</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-[#90D5FF]/30 bg-white px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">

          {/* Tool toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[#90D5FF]/30">
            <button onClick={() => setTool("pen")}
              className={`px-3 py-2 text-xs font-semibold transition-all ${tool === "pen" ? "bg-[#2baaee] text-white" : "text-[#4a7a9b] hover:bg-[#90D5FF]/10"}`}>
              ✏️ Pen
            </button>
            <button onClick={() => setTool("eraser")}
              className={`px-3 py-2 text-xs font-semibold transition-all ${tool === "eraser" ? "bg-[#2baaee] text-white" : "text-[#4a7a9b] hover:bg-[#90D5FF]/10"}`}>
              ⬜ Eraser
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button key={c} onClick={() => { setColor(c); setTool("pen"); }}
                className="w-6 h-6 rounded-full border-2 transition-all"
                style={{
                  background: c,
                  borderColor: color === c && tool === "pen" ? "#2baaee" : "rgba(144,213,255,0.3)",
                  transform: color === c && tool === "pen" ? "scale(1.2)" : "scale(1)",
                  boxShadow: c === "#ffffff" ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none",
                }} />
            ))}
          </div>

          {/* Stroke size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4a7a9b]">Size</span>
            <input type="range" min={1} max={20} value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              className="w-20 accent-sky-400" />
            <span className="text-xs text-[#4a7a9b] w-4">{strokeSize}</span>
          </div>
        </div>
      </div>

      {/* Rating modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                Back to drawing
              </button>
              <button
                onClick={() => selectedStars > 0 && onSubmit(selectedStars)}
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
