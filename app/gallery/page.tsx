"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STAGES } from "@/lib/data";
import { loadProgress, loadDrawings, getStageProgress } from "@/lib/progress";

export default function GalleryPage() {
  const router = useRouter();
  const [drawings, setDrawings] = useState<Record<string, string[]>>({});
  const [progress, setProgress] = useState<ReturnType<typeof loadProgress> | null>(null);
  const [selected, setSelected] = useState<{ url: string; title: string; date?: string } | null>(null);

  useEffect(() => {
    setDrawings(loadDrawings());
    setProgress(loadProgress());
  }, []);

  const allChallenges = STAGES.flatMap((s) => s.challenges);
  const totalDrawings = Object.values(drawings).flat().length;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-[#90D5FF]/30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-[#4a7a9b] hover:text-[#0d1f33] text-sm transition-colors">←</button>
          <span className="font-bold text-[#0d1f33] flex-1">My Gallery</span>
          <span className="text-xs text-[#4a7a9b]">{totalDrawings} drawing{totalDrawings !== 1 ? "s" : ""}</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-10">
        {totalDrawings === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎨</p>
            <p className="font-bold text-[#0d1f33] text-lg mb-2">No drawings yet</p>
            <p className="text-[#4a7a9b] text-sm mb-6">Complete challenges using the canvas to save your drawings here.</p>
            <button onClick={() => router.push("/")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}>
              Start drawing →
            </button>
          </div>
        ) : (
          STAGES.map((stage) => {
            const stageDrawings = stage.challenges.flatMap((c) =>
              (drawings[c.id] ?? []).map((url, i) => ({ url, challenge: c, index: i }))
            );
            if (stageDrawings.length === 0) return null;

            return (
              <div key={stage.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{stage.emoji}</span>
                  <h2 className="font-bold text-[#0d1f33]">{stage.title}</h2>
                  <span className="text-xs text-[#4a7a9b] ml-1">
                    {stageDrawings.length} drawing{stageDrawings.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {stageDrawings.map(({ url, challenge, index }) => (
                    <button
                      key={`${challenge.id}-${index}`}
                      onClick={() => setSelected({ url, title: challenge.title })}
                      className="group relative rounded-xl overflow-hidden border border-[#90D5FF]/20 hover:border-[#2baaee]/50 transition-all hover:shadow-md hover:-translate-y-0.5 bg-white"
                      style={{ aspectRatio: "4/3" }}>
                      <img src={url} alt={challenge.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-2">
                        <p className="text-white text-xs font-semibold">{challenge.title}</p>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-1.5 right-1.5 bg-[#2baaee] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          Latest
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,31,51,0.92)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelected(null)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-white">{selected.title}</p>
              <div className="flex items-center gap-2">
                {/* Download */}
                <a
                  href={selected.url}
                  download={`anisketch-${selected.title.replace(/\s+/g, "-").toLowerCase()}.jpg`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg,#2baaee,#60a5fa)" }}
                  onClick={(e) => e.stopPropagation()}>
                  ⬇️ Download
                </a>
                {/* Copy to clipboard */}
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const res = await fetch(selected.url);
                      const blob = await res.blob();
                      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                      alert("Copied to clipboard!");
                    } catch {
                      alert("Copy not supported in this browser — use Download instead.");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 border border-white/20 hover:bg-white/10 transition-all">
                  📋 Copy
                </button>
                <button onClick={() => setSelected(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white border border-white/10 hover:bg-white/10 transition-all">
                  ✕ Close
                </button>
              </div>
            </div>
            {/* Image */}
            <img src={selected.url} alt={selected.title}
              className="w-full rounded-xl border border-white/10"
              style={{ maxHeight: "75vh", objectFit: "contain" }} />
          </div>
        </div>
      )}
    </div>
  );
}
