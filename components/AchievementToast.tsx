"use client";

import { useEffect, useState } from "react";
import { Achievement } from "@/lib/achievements";

interface Props { achievements: Achievement[]; onDone: () => void; }

export default function AchievementToast({ achievements, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => {
        if (index + 1 < achievements.length) { setIndex((i) => i + 1); setVisible(true); }
        else onDone();
      }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [visible, index, achievements.length, onDone]);

  const a = achievements[index];
  if (!a) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="glass relative rounded-2xl px-5 py-3.5 flex items-center gap-3 min-w-72 overflow-hidden bg-white/80"
        style={{ boxShadow: "0 4px 24px rgba(43,170,238,0.2)" }}>
        <span className="text-3xl">{a.emoji}</span>
        <div>
          <p className="text-xs font-bold text-[#2baaee] uppercase tracking-wide">Achievement!</p>
          <p className="font-bold text-[#0d1f33] text-sm">{a.title}</p>
          <p className="text-xs text-[#4a7a9b]">{a.description}</p>
        </div>
      </div>
    </div>
  );
}
