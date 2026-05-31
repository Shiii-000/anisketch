"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STAGES } from "@/lib/data";
import {
  loadProgress, UserProgress, getLevel, getXpIntoLevel, getXpForNextLevel,
  getDailyChallenge, isChallengeCompleted, getStageProgress,
} from "@/lib/progress";
import XpBar from "@/components/XpBar";
import ProgressRing from "@/components/ProgressRing";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  useEffect(() => { setProgress(loadProgress()); }, []);

  if (!progress) return (
    <div className="min-h-screen flex items-center justify-center text-[#4a7a9b] text-sm">Loading…</div>
  );

  const level = getLevel(progress);
  const xpIn = getXpIntoLevel(progress);
  const xpNext = getXpForNextLevel(progress);
  const xpPct = Math.round((xpIn / xpNext) * 100);
  const dailyId = getDailyChallenge(progress);
  const dailyChallenge = STAGES.flatMap((s) => s.challenges).find((c) => c.id === dailyId);
  const dailyDone = dailyChallenge ? isChallengeCompleted(progress, dailyChallenge.id) : false;
  const totalDone = progress.completedChallenges.length;
  const totalChallenges = STAGES.flatMap((s) => s.challenges).length;
  const activeStage = STAGES.find((s) => {
    if (level < s.unlockLevel) return false;
    const { done, total } = getStageProgress(progress, s.id);
    return done < total;
  }) ?? STAGES[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <span className="font-bold tracking-tight text-[#0d1f33]">AniSketch</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/gallery" className="px-3 py-1.5 rounded-lg text-sm text-[#4a7a9b] hover:text-[#0d1f33] hover:bg-[#90D5FF]/20 transition-all">
              Gallery
            </Link>
            <Link href="/prompts" className="px-3 py-1.5 rounded-lg text-sm text-[#4a7a9b] hover:text-[#0d1f33] hover:bg-[#90D5FF]/20 transition-all">
              Prompts
            </Link>
            <Link href="/stats" className="px-3 py-1.5 rounded-lg text-sm text-[#4a7a9b] hover:text-[#0d1f33] hover:bg-[#90D5FF]/20 transition-all">
              Stats
            </Link>
            {progress.streak > 0 && (
              <span className="ml-2 text-sm font-bold text-orange-500">🔥{progress.streak}</span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">

        {/* 4-panel hero grid */}
        <div className="grid grid-cols-2 gap-3">

          {/* Level card */}
          <div className="glass relative rounded-2xl p-5 flex flex-col justify-between row-span-2 overflow-hidden" style={{ minHeight: 210 }}>
            <div>
              <p className="text-xs text-[#4a7a9b] uppercase tracking-widest font-semibold mb-3">Your Level</p>
              <div className="flex justify-center mb-4">
                <ProgressRing value={xpPct} size={88} stroke={7}>
                  <span className="text-3xl font-black text-[#0d1f33]">{level}</span>
                </ProgressRing>
              </div>
              <XpBar xpIntoLevel={xpIn} xpForNext={xpNext} level={level} slim />
              <p className="text-xs text-[#4a7a9b] mt-1.5 text-center">{xpIn}/{xpNext} XP</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#4a7a9b]">{totalDone}/{totalChallenges} done</p>
              <div className="w-full h-1 rounded-full mt-1 bg-[#90D5FF]/20 overflow-hidden">
                <div className="h-full rounded-full bg-[#2baaee]/40"
                  style={{ width: `${Math.round((totalDone/totalChallenges)*100)}%`, transition: "width 0.5s ease" }} />
              </div>
            </div>
          </div>

          {/* Daily challenge */}
          {dailyChallenge ? (
            <Link href={`/stage/${dailyChallenge.stageId}`}>
              <div className={`glass glass-hover relative rounded-2xl p-4 overflow-hidden h-full`} style={{ minHeight: 100 }}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                  dailyDone ? "bg-emerald-100 text-emerald-700" : "bg-[#90D5FF]/40 text-[#1a6ea8]"
                }`}>
                  {dailyDone ? "✓ Done" : "⚡ Daily"}
                </span>
                <p className="font-bold text-[#0d1f33] text-sm leading-snug">{dailyChallenge.title}</p>
                <p className="text-xs text-[#4a7a9b] mt-1 line-clamp-2">{dailyChallenge.description}</p>
              </div>
            </Link>
          ) : <div />}

          {/* Continue */}
          <Link href={`/stage/${activeStage.id}`}>
            <div className="glass glass-hover relative rounded-2xl p-4 overflow-hidden h-full" style={{ minHeight: 100 }}>
              <span className="text-xs font-bold text-[#1a6ea8] bg-[#90D5FF]/40 px-2 py-0.5 rounded-full mb-2 inline-block">
                Continue
              </span>
              <p className="font-bold text-[#0d1f33] text-sm">{activeStage.emoji} {activeStage.title}</p>
              <p className="text-xs text-[#4a7a9b] mt-1">Keep going →</p>
            </div>
          </Link>

        </div>

        {/* Stages */}
        <div>
          <p className="text-xs font-semibold text-[#4a7a9b] uppercase tracking-widest mb-3">All Stages</p>
          <div className="space-y-2">
            {STAGES.map((stage) => {
              const unlocked = level >= stage.unlockLevel;
              const { done, total } = getStageProgress(progress, stage.id);
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const complete = done === total && total > 0;
              return unlocked ? (
                <Link key={stage.id} href={`/stage/${stage.id}`}>
                  <StageRow stage={stage} done={done} total={total} pct={pct} complete={complete} unlocked />
                </Link>
              ) : (
                <StageRow key={stage.id} stage={stage} done={done} total={total} pct={pct} complete={complete} unlocked={false} />
              );
            })}
          </div>
        </div>

        <p className="text-center text-[#4a7a9b]/40 text-xs pb-2">Anime stages coming soon 🎌</p>
      </main>
    </div>
  );
}

function StageRow({ stage, done, total, pct, complete, unlocked }: {
  stage: { emoji: string; title: string; unlockLevel: number };
  done: number; total: number; pct: number; complete: boolean; unlocked: boolean;
}) {
  return (
    <div className={`glass relative rounded-xl px-4 py-3.5 overflow-hidden ${
      unlocked ? "glass-hover cursor-pointer" : "opacity-40 cursor-not-allowed"
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-white/60">
          {unlocked ? stage.emoji : "🔒"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-semibold text-sm text-[#0d1f33]">{stage.title}</p>
            <span className="text-xs text-[#4a7a9b] shrink-0 ml-2">
              {unlocked ? `${done}/${total}` : `Lv.${stage.unlockLevel}`}
            </span>
          </div>
          {unlocked && (
            <div className="w-full h-1 rounded-full overflow-hidden bg-[#90D5FF]/20">
              <div className="h-full rounded-full" style={{
                width: `${pct}%`,
                background: complete ? "#34d399" : "linear-gradient(90deg,#2baaee,#60a5fa)",
                transition: "width 0.5s ease",
              }} />
            </div>
          )}
        </div>
        {unlocked && <span className="text-[#90D5FF] text-sm shrink-0">→</span>}
      </div>
    </div>
  );
}
