"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { STAGES } from "@/lib/data";
import type { Challenge } from "@/lib/data";
import {
  loadProgress, saveProgress, UserProgress, getLevel, getXpIntoLevel, getXpForNextLevel,
  isChallengeCompleted, isChallengeAttempted, getChallengeStars, completeChallenge,
  getDailyChallenge, isStageUnlocked, isChallengeUnlocked, getChallengeStatus,
} from "@/lib/progress";
import { getNewAchievements } from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";
import XpBar from "@/components/XpBar";
import CompleteModal from "@/components/CompleteModal";
import LevelUpModal from "@/components/LevelUpModal";
import AchievementToast from "@/components/AchievementToast";

const DIFF_LABEL = ["", "Easy", "Medium", "Hard"];
const DIFF_COLOR = ["", "text-emerald-600", "text-amber-600", "text-red-500"];

export default function StagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [xpToast, setXpToast] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showRef, setShowRef] = useState<Challenge | null>(null);

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
        <p className="text-[#4a7a9b] text-sm">Reach Level {stage.unlockLevel} to unlock.</p>
        <button onClick={() => router.push("/")} className="mt-2 px-4 py-2 rounded-xl glass text-[#4a7a9b] text-sm hover:text-[#0d1f33] transition-all">
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
    <div className="min-h-screen bg-white">
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

        {/* XP */}
        <div className="glass relative rounded-xl px-5 py-4 overflow-hidden">
          <XpBar xpIntoLevel={xpIn} xpForNext={xpNext} level={level} />
        </div>

        {/* Complete banner */}
        {allDone && (
          <div className="glass relative rounded-xl px-5 py-4 text-center overflow-hidden" style={{ borderColor: "rgba(52,211,153,0.4)" }}>
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-bold text-emerald-600">Stage complete!</p>
            <p className="text-sm text-[#4a7a9b] mt-0.5">Every challenge done — great work.</p>
          </div>
        )}

        <p className="text-sm text-[#4a7a9b] px-1">{stage.description}</p>

        {/* Challenges */}
        <div className="space-y-3">
          {stage.challenges.map((c, i) => {
            const status = getChallengeStatus(progress, stage.id, i);
            const stars = getChallengeStars(progress, c.id);
            const isDaily = c.id === dailyId;
            const unlocked = status !== "locked";

            return (
              <div key={c.id} className={`glass relative rounded-xl overflow-hidden transition-all ${
                status === "locked" ? "opacity-40" : "glass-hover"
              } ${status === "done" ? "border-[#90D5FF]/60" : ""} ${
                status === "in_progress" ? "border-amber-300/60" : ""
              }`}>
                <div className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5 ${
                      status === "done" ? "border-[#2baaee] bg-[#90D5FF]/20" :
                      status === "in_progress" ? "border-amber-400 bg-amber-50" :
                      status === "available" ? "border-[#90D5FF]/50 bg-[#90D5FF]/10" :
                      "border-slate-200 bg-slate-50"
                    }`}>
                      {status === "done" && <span className="text-[#2baaee] text-sm font-bold">✓</span>}
                      {status === "in_progress" && <span className="text-amber-500 text-sm">↺</span>}
                      {status === "locked" && <span className="text-slate-400 text-xs">🔒</span>}
                      {status === "available" && <span className="text-[#90D5FF] text-sm">○</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm text-[#0d1f33]">{c.title}</span>
                        {isDaily && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">⚡ Daily</span>
                        )}
                        {status === "in_progress" && (
                          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">Practice more</span>
                        )}
                      </div>
                      <p className="text-xs text-[#4a7a9b] leading-relaxed">{c.description}</p>

                      {/* Stars */}
                      {stars > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          {[1,2,3].map((s) => (
                            <span key={s} className={`text-sm ${s <= stars ? "text-amber-400" : "text-slate-200"}`}>★</span>
                          ))}
                          {status === "in_progress" && (
                            <span className="text-xs text-amber-500 ml-1">Need ⭐⭐ to unlock next</span>
                          )}
                        </div>
                      )}

                      {/* Next unlock hint */}
                      {i < stage.challenges.length - 1 && status === "available" && (
                        <p className="text-xs text-[#4a7a9b]/60 mt-1">
                          Complete with ⭐⭐+ to unlock next challenge
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold ${DIFF_COLOR[c.difficulty]}`}>{DIFF_LABEL[c.difficulty]}</span>
                      <span className="text-xs font-bold text-[#2baaee]">+{c.xp} XP</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {unlocked && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setShowRef(c)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#2baaee] transition-all"
                        style={{ background: "rgba(144,213,255,0.15)", border: "1px solid rgba(144,213,255,0.35)" }}
                      >
                        📖 See Example
                      </button>
                      <button
                        onClick={() => setSelected(c)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}
                      >
                        {status === "done" ? "↺ Redo" : status === "in_progress" ? "↺ Try again" : "Start →"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Reference panel */}
      {showRef && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(144,213,255,0.25)", backdropFilter: "blur(12px)" }}>
          <div className="glass relative rounded-2xl w-full max-w-md overflow-hidden bg-white/90">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-[#2baaee] uppercase tracking-wide mb-0.5">Reference Example</p>
                  <h3 className="font-bold text-lg text-[#0d1f33]">{showRef.title}</h3>
                </div>
                <button onClick={() => setShowRef(null)} className="text-[#4a7a9b] hover:text-[#0d1f33] text-xl leading-none ml-3">×</button>
              </div>

              {/* Reference image */}
              <div className="rounded-xl overflow-hidden mb-4 bg-[#90D5FF]/10 border border-[#90D5FF]/20"
                style={{ minHeight: 180 }}>
                <img
                  src={showRef.referenceUrl}
                  alt={showRef.referenceCaption}
                  className="w-full object-contain"
                  style={{ maxHeight: 240 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      `<div class="flex items-center justify-center h-44 text-[#4a7a9b] text-sm flex-col gap-2"><span class="text-3xl">🎨</span><span>Search "${showRef?.title} drawing tutorial" for references</span></div>`;
                  }}
                />
                <p className="text-xs text-center text-[#4a7a9b] py-2 px-3">{showRef.referenceCaption}</p>
              </div>

              {/* Goal */}
              <div className="mb-3 p-3 rounded-xl bg-[#90D5FF]/10 border border-[#90D5FF]/20">
                <p className="text-xs font-bold text-[#0d1f33] mb-1">🎯 What to aim for</p>
                <p className="text-sm text-[#4a7a9b] leading-relaxed">{showRef.goal}</p>
              </div>

              {/* Tips */}
              <div className="mb-4">
                <p className="text-xs font-bold text-[#0d1f33] mb-2">💡 Tips</p>
                <ul className="space-y-1.5">
                  {showRef.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#4a7a9b]">
                      <span className="text-[#2baaee] shrink-0">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => { setShowRef(null); setSelected(showRef); }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}
              >
                Start challenge →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 font-bold px-5 py-2 rounded-full text-sm pointer-events-none text-white"
          style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)", boxShadow: "0 4px 16px rgba(43,170,238,0.4)" }}>
          {xpToast} ✨
        </div>
      )}

      {selected && (
        <CompleteModal challenge={selected} alreadyDone={isChallengeAttempted(progress, selected.id)}
          onComplete={handleComplete} onClose={() => setSelected(null)} />
      )}
      {levelUp !== null && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      {newAchievements.length > 0 && (
        <AchievementToast achievements={newAchievements} onDone={() => setNewAchievements([])} />
      )}
    </div>
  );
}
