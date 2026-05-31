import { levelFromXp, xpIntoCurrentLevel, xpForNextLevel, STAGES } from "./data";

export interface CompletedChallenge {
  challengeId: string;
  completedAt: string;
  stars: number;
}

export interface UserProgress {
  totalXp: number;
  completedChallenges: CompletedChallenge[];
  streak: number;
  lastActiveDate: string | null;
  dailyChallengeId: string | null;
  dailyChallengeDate: string | null;
  dailyChallengeCompleted: boolean;
}

const STORAGE_KEY = "anisketch_progress";

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress();
  try {
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function defaultProgress(): UserProgress {
  return {
    totalXp: 0,
    completedChallenges: [],
    streak: 0,
    lastActiveDate: null,
    dailyChallengeId: null,
    dailyChallengeDate: null,
    dailyChallengeCompleted: false,
  };
}

export function getLevel(p: UserProgress) {
  return levelFromXp(p.totalXp);
}

export function getXpIntoLevel(p: UserProgress) {
  return xpIntoCurrentLevel(p.totalXp);
}

export function getXpForNextLevel(p: UserProgress) {
  return xpForNextLevel(p.totalXp);
}

export function isChallengeCompleted(p: UserProgress, challengeId: string): boolean {
  return p.completedChallenges.some((c) => c.challengeId === challengeId);
}

export function getChallengeStars(p: UserProgress, challengeId: string): number {
  return p.completedChallenges.find((c) => c.challengeId === challengeId)?.stars ?? 0;
}

export function isStageUnlocked(p: UserProgress, unlockLevel: number): boolean {
  return getLevel(p) >= unlockLevel;
}

export function completeChallenge(
  p: UserProgress,
  challengeId: string,
  xpReward: number,
  stars: number
): UserProgress {
  const alreadyDone = isChallengeCompleted(p, challengeId);
  const existingStars = getChallengeStars(p, challengeId);

  let newXp = p.totalXp;
  let newCompleted = [...p.completedChallenges];

  if (!alreadyDone) {
    newXp += xpReward;
    newCompleted.push({ challengeId, completedAt: new Date().toISOString(), stars });
  } else if (stars > existingStars) {
    // Improved stars — give partial XP bonus
    newXp += Math.round(xpReward * 0.25);
    newCompleted = newCompleted.map((c) =>
      c.challengeId === challengeId ? { ...c, stars } : c
    );
  }

  // Update streak
  const today = new Date().toDateString();
  const lastActive = p.lastActiveDate;
  let streak = p.streak;
  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    streak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
  }

  return {
    ...p,
    totalXp: newXp,
    completedChallenges: newCompleted,
    streak,
    lastActiveDate: today,
  };
}

export function getDailyChallenge(p: UserProgress): string {
  const today = new Date().toDateString();
  if (p.dailyChallengeDate === today && p.dailyChallengeId) {
    return p.dailyChallengeId;
  }
  // Pick a random challenge from unlocked stages
  const level = getLevel(p);
  const available = STAGES.filter((s) => s.unlockLevel <= level).flatMap((s) => s.challenges);
  if (available.length === 0) return STAGES[0].challenges[0].id;
  const idx = Math.floor(
    (new Date().getFullYear() * 1000 + new Date().getMonth() * 31 + new Date().getDate()) %
      available.length
  );
  return available[idx].id;
}

export function getStageProgress(p: UserProgress, stageId: string): { done: number; total: number } {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return { done: 0, total: 0 };
  const done = stage.challenges.filter((c) => isChallengeCompleted(p, c.id)).length;
  return { done, total: stage.challenges.length };
}
