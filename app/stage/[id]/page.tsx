"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { STAGES } from "@/lib/data";
import type { Challenge } from "@/lib/data";
import {
  loadProgress, saveProgress, UserProgress, getLevel, getXpIntoLevel, getXpForNextLevel,
  isChallengeCompleted, completeChallenge, getDailyChallenge, isStageUnlocked,
} from "@/lib/progress";
import { getNewAchievements } from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";
import XpBar from "@/components/XpBar";
import CompleteModal from "@/components/CompleteModal";
import LevelUpModal from "@/components/LevelUpModal";
import AchievementToast from "@/components/AchievementToast";

const DIFF_LABEL = ["", "Easy", "Medium", "Hard"];
const DIFF_COLOR = ["", "text-emerald-400", "text-amber-400", "text-red-400"];

export default function StagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [xpToast, setXpToast] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => { setProgress(loadProgress()); }, []);

  const stage = STAGES.find((s) => s.id === id);
  if (!progress || !stage) return (
    <div className="min-h-screen flex items-center justify-center text-[#4a7a9b] text-sm">Loading…</div>
  );

  if (!isStageUnlocked(progress, stage.unlockLevel)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 gap-3">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-[#0d1f33]">Stage Locked</h2>
        <p className="text-[#0d1f33]/50 text-sm">Reach Level {stage.unlockLevel} to unlock.</p>
        <button onClick={() => router.push("/")} className="mt-2 px-4 py-2 rounded-xl glass text-[#0d1f33]/70 text-sm hover:text-[#0d1f33] transition-all">
          ← Back
        </button>
      </div>
    );
  }

  const level = getLevel(progress);
  const xpIn = getXpIntoLevel(progress);
  const xpNext = getXpForNextLevel(progress);
  const dailyId = getDailyChallenge(progress);
  const done = stage.challenges.filter((c) => isChallengeCompleted(progress, c.id)).length;
  const allDone = done === stage.challenges.length;

  function handleComplete(stars: number) {
    if (!selected || !progress) return;
    const prevLevel = getLevel(progress);
    const updated = completeChallenge(progress, selected.id, selected.xp, stars);
    const newLevel = getLevel(updated);
    const earned = getNewAchievements(progress, updated);
    saveProgress(updated);
    setProgress(updated);
    setXpToast(`+${selected.xp} XP`);
    setSelected(null);
    if (newLevel > prevLevel) setLevelUp(newLevel);
    if (earned.length > 0) setNewAchievements(earned);
    setTimeout(() => setXpToast(null), 2000);
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">←</button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span>{stage.emoji}</span>
            <span className="font-bold text-[#0d1f33] truncate">{stage.title}</span>
          </div>
          <span className="text-xs text-[#4a7a9b] font-medium shrink-0">{done}/{stage.challenges.length}</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-5 py-8 space-y-5">

        {/* XP bar */}
        <div className="glass relative rounded-xl px-5 py-4 overflow-hidden">
          <XpBar xpIntoLevel={xpIn} xpForNext={xpNext} level={level} />
        </div>

        {/* Complete banner */}
        {allDone && (
          <div className="glass relative rounded-xl px-5 py-4 text-center overflow-hidden border-emerald-500/30">
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-bold text-emerald-400">Stage complete!</p>
            <p className="text-sm text-[#0d1f33]/40 mt-0.5">Every challenge finished.</p>
          </div>
        )}

        <p className="text-sm text-[#0d1f33]/40 px-1">{stage.description}</p>

        {/* Challenges */}
        <div className="space-y-2">
          {stage.challenges.map((c) => {
            const isDone = isChallengeCompleted(progress, c.id);
            const isDaily = c.id === dailyId;
            return (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`glass glass-hover relative w-full text-left rounded-xl px-5 py-4 overflow-hidden ${isDone ? "border-sky-500/30" : ""}`}>
                <div className="flex items-center gap-4">
                  {/* Check */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isDone
                      ? "border-sky-400 bg-sky-400/20"
                      : "border-white/20"
                  }`}>
                    {isDone && <span className="text-[#2baaee] text-sm font-bold">✓</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-sm text-[#0d1f33]">{c.title}</span>
                      {isDaily && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Daily</span>
                      )}
                    </div>
                    <p className="text-xs text-[#0d1f33]/40 leading-relaxed">{c.description}</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold ${DIFF_COLOR[c.difficulty]}`}>{DIFF_LABEL[c.difficulty]}</span>
                    <span className="text-xs font-bold text-[#2baaee]">+{c.xp} XP</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {xpToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 font-bold px-5 py-2 rounded-full text-sm pointer-events-none text-[#0d1f33]"
          style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 0 20px rgba(56,189,248,0.5)" }}>
          {xpToast} ✨
        </div>
      )}

      {selected && (
        <CompleteModal challenge={selected} alreadyDone={isChallengeCompleted(progress, selected.id)}
          onComplete={handleComplete} onClose={() => setSelected(null)} />
      )}
      {levelUp !== null && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      {newAchievements.length > 0 && (
        <AchievementToast achievements={newAchievements} onDone={() => setNewAchievements([])} />
      )}
    </div>
  );
}
