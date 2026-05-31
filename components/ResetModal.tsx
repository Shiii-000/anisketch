"use client";

interface Props { onConfirm: () => void; onClose: () => void; }

export default function ResetModal({ onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(144,213,255,0.3)", backdropFilter: "blur(12px)" }}>
      <div className="glass relative rounded-2xl max-w-sm w-full p-6 text-center overflow-hidden bg-white/80">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-[#0d1f33] mb-1">Reset progress?</h2>
        <p className="text-sm text-[#4a7a9b] mb-6 leading-relaxed">
          This will delete all your XP, challenges, streaks and achievements. Cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-[#4a7a9b] border border-[#90D5FF]/40 hover:bg-[#90D5FF]/10 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-400 hover:bg-red-500 transition-all">
            Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}
