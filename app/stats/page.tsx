"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProgress, saveProgress, UserProgress, getLevel, getXpIntoLevel, getXpForNextLevel, getStageProgress } from "@/lib/progress";
import { STAGES } from "@/lib/data";
import { ACHIEVEMENTS, getUnlockedAchievements } from "@/lib/achievements";
import XpBar from "@/components/XpBar";
import ProgressRing from "@/components/ProgressRing";
import ResetModal from "@/components/ResetModal";

export default function StatsPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { setProgress(loadProgress()); }, []);
  if (!progress) return <div className="min-h-screen flex items-center justify-center text-[#4a7a9b] text-sm">Loading…</div>;

  const level = getLevel(progress);
  const xpIn = getXpIntoLevel(progress);
  const xpNext = getXpForNextLevel(progress);
  const xpPct = Math.round((xpIn / xpNext) * 100);
  const unlocked = getUnlockedAchievements(progress);
  const totalChallenges = STAGES.flatMap((s) => s.challenges).length;
  const threeStars = progress.completedChallenges.filter((c) => c.stars === 3).length;
  const stagesComplete = STAGES.filter((s) => {
    const { done, total } = getStageProgress(progress, s.id);
    return done === total && total > 0;
  }).length;

  function handleReset() {
    saveProgress({ totalXp: 0, completedChallenges: [], streak: 0, lastActiveDate: null, dailyChallengeId: null, dailyChallengeDate: null, dailyChallengeCompleted: false });
    router.push("/");
  }

  const stats = [
    { label: "Challenges", value: progress.completedChallenges.length, sub: `of ${totalChallenges}`, emoji: "✅" },
    { label: "Streak", value: progress.streak, sub: "days", emoji: "🔥" },
    { label: "3-Star", value: threeStars, sub: "perfect", emoji: "⭐" },
    { label: "Stages", value: `${stagesComplete}/${STAGES.length}`, sub: "complete", emoji: "🏆" },
  ];

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">←</button>
          <span className="font-bold text-[#0d1f33]">Stats & Achievements</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-5 py-8 space-y-6">

        {/* Level hero */}
        <div className="glass relative rounded-2xl p-6 overflow-hidden flex items-center gap-5">
          <ProgressRing value={xpPct} size={88} stroke={7}>
            <span className="text-3xl font-black text-[#0d1f33]">{level}</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#4a7a9b] mb-0.5">Current level</p>
            <p className="text-4xl font-black text-[#0d1f33] leading-none mb-3">Level {level}</p>
            <XpBar xpIntoLevel={xpIn} xpForNext={xpNext} level={level} slim />
            <p className="text-xs text-[#4a7a9b] mt-1.5">{xpIn}/{xpNext} XP · {progress.totalXp} total</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="glass relative rounded-xl p-4 text-center overflow-hidden">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-3xl font-black text-[#0d1f33]">{s.value}</p>
              <p className="text-xs text-[#4a7a9b] mt-0.5">{s.label} · {s.sub}</p>
            </div>
          ))}
        </div>

        {/* Stage progress */}
        <div>
          <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-widest mb-3">Stage Progress</p>
          <div className="glass relative rounded-xl overflow-hidden">
            {STAGES.map((stage, i) => {
              const { done, total } = getStageProgress(progress, stage.id);
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const locked = level < stage.unlockLevel;
              return (
                <div key={stage.id} className={`px-5 py-3.5 ${locked ? "opacity-30" : ""} ${i < STAGES.length - 1 ? "border-b border-white/6" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#0d1f33]">{stage.emoji} {stage.title}</span>
                    <span className="text-xs text-[#4a7a9b]">{locked ? `🔒 Lv.${stage.unlockLevel}` : `${done}/${total}`}</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(144,213,255,0.2)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg,#38bdf8,#818cf8)",
                      boxShadow: pct > 0 ? "0 0 6px rgba(56,189,248,0.5)" : "none",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-widest">Achievements</p>
            <span className="text-xs font-bold text-[#2baaee]">{unlocked.length}/{ACHIEVEMENTS.length}</span>
          </div>
          <div className="space-y-2">
            {ACHIEVEMENTS.map((a) => {
              const earned = a.check(progress);
              return (
                <div key={a.id} className={`glass relative rounded-xl px-4 py-3.5 flex items-center gap-3 overflow-hidden transition-all ${earned ? "border-sky-500/20" : "opacity-30"}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(144,213,255,0.2)" }}>
                    {a.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0d1f33]">{a.title}</p>
                      {earned && <span className="text-xs bg-sky-500/20 text-[#2baaee] px-1.5 py-0.5 rounded-full">✓</span>}
                    </div>
                    <p className="text-xs text-[#4a7a9b]">{a.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="pb-6">
          <button onClick={() => setShowReset(true)}
            className="w-full py-3 rounded-xl text-sm text-white/30 hover:text-red-400 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(144,213,255,0.2)" }}>
            Reset all progress
          </button>
        </div>
      </main>

      {showReset && <ResetModal onConfirm={handleReset} onClose={() => setShowReset(false)} />}
    </div>
  );
}
