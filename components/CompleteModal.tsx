"use client";

import { useState } from "react";
import { Challenge } from "@/lib/data";

const DIFF_LABEL = ["", "Easy", "Medium", "Hard"];
const DIFF_COLOR = ["", "text-emerald-600 bg-emerald-50", "text-amber-600 bg-amber-50", "text-red-600 bg-red-50"];
const RATINGS = [
  { stars: 1, emoji: "🙂", label: "Tried it" },
  { stars: 2, emoji: "😊", label: "Did OK" },
  { stars: 3, emoji: "🤩", label: "Nailed it" },
];

interface Props {
  challenge: Challenge;
  alreadyDone: boolean;
  onComplete: (stars: number) => void;
  onClose: () => void;
}

export default function CompleteModal({ challenge, alreadyDone, onComplete, onClose }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(144,213,255,0.25)", backdropFilter: "blur(12px)" }}>
      <div className="glass relative rounded-2xl w-full max-w-sm p-6 overflow-hidden bg-white/80">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLOR[challenge.difficulty]}`}>
              {DIFF_LABEL[challenge.difficulty]}
            </span>
            <span className="text-xs font-bold text-[#2baaee]">+{challenge.xp} XP</span>
          </div>
          <h2 className="text-xl font-bold text-[#0d1f33] leading-tight">{challenge.title}</h2>
          <p className="text-sm text-[#4a7a9b] mt-1 leading-relaxed">{challenge.description}</p>
        </div>

        <div className="h-px bg-[#90D5FF]/30 mb-5" />

        <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-wide mb-3">
          {alreadyDone ? "Redo & rate yourself" : "Complete it, then rate yourself"}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {RATINGS.map((r) => (
            <button key={r.stars} onClick={() => setSelected(r.stars)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                selected === r.stars
                  ? "border-[#2baaee] bg-[#90D5FF]/20"
                  : "border-[#90D5FF]/30 hover:border-[#2baaee]/50 bg-white/60"
              }`}>
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs font-semibold text-[#0d1f33]">{r.label}</span>
              <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-[#4a7a9b] hover:text-[#0d1f33] border border-[#90D5FF]/40 hover:bg-[#90D5FF]/10 transition-all">
            Cancel
          </button>
          <button onClick={() => selected > 0 && onComplete(selected)} disabled={selected === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={selected > 0 ? {
              background: "linear-gradient(135deg,#2baaee,#60a5fa)",
              color: "white",
            } : { background: "rgba(144,213,255,0.15)", color: "#90D5FF", cursor: "not-allowed" }}>
            Mark complete
          </button>
        </div>
      </div>
    </div>
  );
}
