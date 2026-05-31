"use client";

import Link from "next/link";
import { Stage } from "@/lib/data";
import { UserProgress, isStageUnlocked, getStageProgress } from "@/lib/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Props {
  stage: Stage;
  progress: UserProgress;
}

export default function StageCard({ stage, progress }: Props) {
  const unlocked = isStageUnlocked(progress, stage.unlockLevel);
  const { done, total } = getStageProgress(progress, stage.id);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = done === total && total > 0;

  const inner = (
    <Card className={`transition-all duration-200 border ${
      unlocked
        ? complete
          ? "border-green-200 bg-green-50/50 hover:shadow-md hover:-translate-y-0.5"
          : "border-sky-100 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        : "border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed"
    }`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              complete ? "bg-green-100" : unlocked ? "bg-sky-100" : "bg-slate-100"
            }`}>
              {stage.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{stage.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{stage.description}</p>
            </div>
          </div>
          {!unlocked && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              🔒 Lv.{stage.unlockLevel}
            </Badge>
          )}
          {complete && (
            <Badge className="shrink-0 bg-green-100 text-green-700 hover:bg-green-100 text-xs">
              ✓ Done
            </Badge>
          )}
        </div>

        {unlocked && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{done}/{total} challenges</span>
              <span>{pct}%</span>
            </div>
            <Progress
              value={pct}
              className={`h-2 ${complete ? "bg-green-100 [&>div]:bg-green-400" : "bg-sky-100 [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-blue-500"}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return unlocked ? (
    <Link href={`/stage/${stage.id}`} className="block">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}
