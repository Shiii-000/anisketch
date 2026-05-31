"use client";

import { useEffect } from "react";

interface Props { level: number; onClose: () => void; }

export default function LevelUpModal({ level, onClose }: Props) {
  useEffect(() => {
    // Dynamically import confetti so it doesn't affect SSR
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      // Big burst
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ["#2baaee", "#60a5fa", "#38bdf8", "#fbbf24", "#a78bfa"] });
      // Side cannons
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ["#2baaee", "#fbbf24"] });
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ["#60a5fa", "#a78bfa"] });
      }, 200);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(144,213,255,0.3)", backdropFilter: "blur(12px)" }}>
      <div className="glass relative rounded-2xl max-w-xs w-full p-8 text-center overflow-hidden bg-white/90">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-xs font-bold text-[#2baaee] uppercase tracking-widest mb-1">Level up!</p>
        <h2 className="text-5xl font-black text-[#0d1f33] mb-1">{level}</h2>
        <p className="text-sm text-[#4a7a9b] mb-6">Keep going — new stages await!</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all"
          style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}
