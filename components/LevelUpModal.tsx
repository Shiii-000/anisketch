"use client";

interface Props { level: number; onClose: () => void; }

export default function LevelUpModal({ level, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(144,213,255,0.3)", backdropFilter: "blur(12px)" }}>
      <div className="glass relative rounded-2xl max-w-xs w-full p-8 text-center overflow-hidden bg-white/80">
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
