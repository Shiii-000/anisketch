"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePrompt, getDailyPromptSeed, DrawingPrompt } from "@/lib/prompts";

export default function PromptsPage() {
  const router = useRouter();
  const dailyPrompt = generatePrompt(getDailyPromptSeed());
  const [current, setCurrent] = useState<DrawingPrompt | null>(null);
  const [rolling, setRolling] = useState(false);

  function roll() {
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrent(generatePrompt());
      count++;
      if (count >= 10) { clearInterval(interval); setRolling(false); }
    }, 70);
  }

  const display = current ?? dailyPrompt;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">←</button>
          <span className="font-bold text-[#0d1f33]">Prompt Generator</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-5 py-8 space-y-6">

        {/* Daily */}
        <div>
          <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-widest mb-3">Today's Prompt</p>
          <div className="glass relative rounded-2xl p-6 overflow-hidden" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
            <PromptDisplay prompt={dailyPrompt} />
            <p className="text-xs text-center text-white/30 mt-4">Changes every day at midnight</p>
          </div>
        </div>

        {/* Random */}
        <div>
          <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-widest mb-3">Random Prompt</p>
          <div className="glass relative rounded-2xl p-6 overflow-hidden space-y-5">
            <div className={`transition-all duration-75 ${rolling ? "opacity-50 scale-[0.98]" : ""}`}>
              <PromptDisplay prompt={display} />
            </div>
            <button onClick={roll} disabled={rolling}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 0 16px rgba(56,189,248,0.3)" }}>
              {rolling ? "Rolling…" : "🎲 Roll new prompt"}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="glass relative rounded-2xl p-5 overflow-hidden">
          <p className="font-semibold text-sm text-white mb-3">How to use prompts</p>
          <ul className="space-y-2.5 text-sm text-[#4a7a9b]">
            {[
              ["🎯", "Use as warm-ups before doing challenges"],
              ["⏱️", "Try to finish in 10–15 minutes — keep it loose"],
              ["📸", "Save your sketches to track your progress over time"],
              ["🔄", "Roll again if a prompt feels too hard — no pressure"],
            ].map(([icon, text]) => (
              <li key={text as string} className="flex gap-2.5">
                <span>{icon}</span><span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
}

function PromptDisplay({ prompt }: { prompt: DrawingPrompt }) {
  return (
    <div className="text-center space-y-3">
      <p className="text-lg font-bold text-[#0d1f33] leading-snug">
        Draw <span className="text-[#2baaee]">{prompt.subject}</span>
        {" "}{prompt.style},{" "}
        <span className="text-indigo-400">{prompt.constraint}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {[prompt.subject, prompt.style, prompt.constraint].map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full text-[#4a7a9b]"
            style={{ background: "rgba(144,213,255,0.15)", border: "1px solid rgba(144,213,255,0.35)" }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
