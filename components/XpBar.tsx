"use client";

interface XpBarProps {
  xpIntoLevel: number;
  xpForNext: number;
  level: number;
  slim?: boolean;
}

export default function XpBar({ xpIntoLevel, xpForNext, level, slim }: XpBarProps) {
  const pct = Math.min(100, Math.round((xpIntoLevel / xpForNext) * 100));
  return (
    <div className="w-full">
      {!slim && (
        <div className="flex justify-between text-xs text-[#4a7a9b] mb-2">
          <span className="font-semibold text-[#0d1f33]">Level {level}</span>
          <span>{xpIntoLevel} / {xpForNext} XP</span>
        </div>
      )}
      <div className="w-full rounded-full overflow-hidden bg-[#90D5FF]/20" style={{ height: slim ? 4 : 8 }}>
        <div className="h-full rounded-full" style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #2baaee, #60a5fa)",
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}
