"use client";

import { Challenge } from "@/lib/data";
import { UserProgress, isChallengeCompleted, getChallengeStars } from "@/lib/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DIFF_LABEL = ["", "Easy", "Medium", "Hard"];
const DIFF_STYLE = [
  "",
  "bg-green-100 text-green-700 hover:bg-green-100",
  "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  "bg-red-100 text-red-700 hover:bg-red-100",
];

interface Props {
  challenge: Challenge;
  progress: UserProgress;
  onClick: (challenge: Challenge) => void;
  isDaily?: boolean;
}

export default function ChallengeCard({ challenge, progress, onClick, isDaily }: Props) {
  const done = isChallengeCompleted(progress, challenge.id);
  const stars = getChallengeStars(progress, challenge.id);

  return (
    <button onClick={() => onClick(challenge)} className="w-full text-left">
      <Card className={`transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border ${
        done
          ? "border-sky-200 bg-sky-50/50"
          : "border-slate-100 hover:border-sky-200"
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {isDaily && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                    ⚡ Daily
                  </Badge>
                )}
                <Badge className={`text-xs ${DIFF_STYLE[challenge.difficulty]}`}>
                  {"⭐".repeat(challenge.difficulty)} {DIFF_LABEL[challenge.difficulty]}
                </Badge>
                <span className="text-xs text-sky-500 font-semibold">+{challenge.xp} XP</span>
              </div>
              <h4 className="font-semibold text-foreground text-sm">{challenge.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{challenge.description}</p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
              {done ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-sky-600 text-sm">✓</span>
                  </div>
                  <span className="text-xs text-amber-500">{"⭐".repeat(stars)}</span>
                </>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center">
                  <span className="text-slate-300 text-sm">○</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
