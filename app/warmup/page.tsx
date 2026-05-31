"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface WarmupExercise {
  id: string;
  title: string;
  instruction: string;
  duration: number; // seconds
  emoji: string;
}

const EXERCISES: WarmupExercise[] = [
  { id: "lines-h",   title: "Horizontal Lines",  instruction: "Draw smooth horizontal lines from left to right. Focus on confidence, not perfection.", duration: 60, emoji: "➖" },
  { id: "lines-v",   title: "Vertical Lines",    instruction: "Draw vertical lines top to bottom. Use your whole arm, not just your wrist.", duration: 60, emoji: "⬆️" },
  { id: "lines-d",   title: "Diagonal Lines",    instruction: "Draw diagonal lines at a consistent angle. Keep them parallel.", duration: 60, emoji: "↗️" },
  { id: "curves",    title: "Smooth Curves",     instruction: "Draw flowing C-shaped curves. Think about the arc before you start each one.", duration: 60, emoji: "〰️" },
  { id: "circles",   title: "Circles",           instruction: "Draw circles of different sizes. Draw fast — slow circles become polygons.", duration: 60, emoji: "⭕" },
];

const TOTAL = EXERCISES.reduce((a, e) => a + e.duration, 0);

export default function WarmupPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "active" | "done">("intro");
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercise = EXERCISES[exerciseIdx];
  const totalDone = EXERCISES.slice(0, exerciseIdx).reduce((a, e) => a + e.duration, 0);
  const overallPct = Math.round(((totalDone + (exercise?.duration - timeLeft)) / TOTAL) * 100);

  function start() {
    setPhase("active");
    setExerciseIdx(0);
    setTimeLeft(EXERCISES[0].duration);
    setIsPaused(false);
  }

  useEffect(() => {
    if (phase !== "active" || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Move to next exercise
          setExerciseIdx((idx) => {
            const next = idx + 1;
            if (next >= EXERCISES.length) {
              setPhase("done");
              return idx;
            }
            setTimeLeft(EXERCISES[next].duration);
            return next;
          });
          return EXERCISES[exerciseIdx]?.duration ?? 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, isPaused, exerciseIdx]);

  function skip() {
    const next = exerciseIdx + 1;
    if (next >= EXERCISES.length) { setPhase("done"); return; }
    setExerciseIdx(next);
    setTimeLeft(EXERCISES[next].duration);
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerPct = exercise ? Math.round(((exercise.duration - timeLeft) / exercise.duration) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">←</button>
          <span className="font-bold text-[#0d1f33] flex-1">Daily Warmup</span>
          {phase === "active" && (
            <span className="text-xs text-[#4a7a9b] font-mono">{overallPct}% done</span>
          )}
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-5 py-10">

        {/* Intro */}
        {phase === "intro" && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🖊️</div>
            <div>
              <h1 className="text-2xl font-black text-[#0d1f33] mb-2">5 Minute Warmup</h1>
              <p className="text-[#4a7a9b] leading-relaxed">
                Like a musician doing scales — warm up your hand before every drawing session.
                5 short exercises, 1 minute each.
              </p>
            </div>

            {/* Exercise list */}
            <div className="glass rounded-2xl overflow-hidden text-left">
              {EXERCISES.map((ex, i) => (
                <div key={ex.id} className={`flex items-center gap-3 px-4 py-3 ${i < EXERCISES.length - 1 ? "border-b border-[#90D5FF]/20" : ""}`}>
                  <span className="text-xl w-8 text-center">{ex.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0d1f33]">{ex.title}</p>
                    <p className="text-xs text-[#4a7a9b]">{ex.duration}s</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button onClick={start}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all"
                style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
                Start Warmup 🚀
              </button>
              <p className="text-xs text-[#4a7a9b]">
                Grab your pen/mouse and some paper or use the drawing canvas on each challenge.
              </p>
            </div>
          </div>
        )}

        {/* Active */}
        {phase === "active" && exercise && (
          <div className="space-y-6">
            {/* Overall progress */}
            <div>
              <div className="flex justify-between text-xs text-[#4a7a9b] mb-1.5">
                <span>Exercise {exerciseIdx + 1} of {EXERCISES.length}</span>
                <span>{overallPct}% complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#90D5FF]/20 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${overallPct}%`, background: "linear-gradient(90deg,#2baaee,#60a5fa)" }} />
              </div>
            </div>

            {/* Exercise card */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">{exercise.emoji}</div>
              <h2 className="text-2xl font-black text-[#0d1f33] mb-3">{exercise.title}</h2>
              <p className="text-[#4a7a9b] leading-relaxed mb-6">{exercise.instruction}</p>

              {/* Timer ring */}
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg width="112" height="112" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(144,213,255,0.2)" strokeWidth="8" />
                    <circle cx="56" cy="56" r="48" fill="none"
                      stroke="url(#timer-grad)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - timerPct / 100)}
                      style={{ transition: "stroke-dashoffset 1s linear" }} />
                    <defs>
                      <linearGradient id="timer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2baaee" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#0d1f33] font-mono">
                      {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : secs}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button onClick={() => setIsPaused(p => !p)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-[#90D5FF]/40 text-[#4a7a9b] hover:bg-[#90D5FF]/10 transition-all">
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button onClick={skip}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
                Next →
              </button>
            </div>

            {/* Upcoming */}
            {exerciseIdx < EXERCISES.length - 1 && (
              <p className="text-xs text-center text-[#4a7a9b]">
                Up next: {EXERCISES[exerciseIdx + 1].emoji} {EXERCISES[exerciseIdx + 1].title}
              </p>
            )}
          </div>
        )}

        {/* Done */}
        {phase === "done" && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div>
              <h1 className="text-2xl font-black text-[#0d1f33] mb-2">Warmup Complete!</h1>
              <p className="text-[#4a7a9b]">
                Great work — your hand is warmed up and ready to draw.
                Now go tackle some challenges!
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black text-[#0d1f33]">{EXERCISES.length}</p>
                  <p className="text-xs text-[#4a7a9b]">exercises</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#0d1f33]">5</p>
                  <p className="text-xs text-[#4a7a9b]">minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#0d1f33]">✓</p>
                  <p className="text-xs text-[#4a7a9b]">done!</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => router.push("/")}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all"
                style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
                Go to challenges →
              </button>
              <button onClick={() => { setPhase("intro"); setExerciseIdx(0); }}
                className="w-full py-3 rounded-xl text-sm text-[#4a7a9b] border border-[#90D5FF]/30 hover:bg-[#90D5FF]/10 transition-all">
                Do it again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
