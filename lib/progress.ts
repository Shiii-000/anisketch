import { levelFromXp, xpIntoCurrentLevel, xpForNextLevel, STAGES, Challenge } from "./data";

export interface CompletedChallenge {
  challengeId: string;
  completedAt: string;
  stars: number;
  drawing?: string; // base64 PNG thumbnail
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
const DRAWINGS_KEY = "anisketch_drawings";

// Drawings stored separately to keep progress lean
export function saveDrawing(challengeId: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(DRAWINGS_KEY);
    const drawings: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (!drawings[challengeId]) drawings[challengeId] = [];
    // Keep last 5 drawings per challenge
    drawings[challengeId].unshift(dataUrl);
    drawings[challengeId] = drawings[challengeId].slice(0, 5);
    localStorage.setItem(DRAWINGS_KEY, JSON.stringify(drawings));
  } catch {}
}

export function loadDrawings(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAWINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getDrawingsForChallenge(challengeId: string): string[] {
  return loadDrawings()[challengeId] ?? [];
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress();
  try { return JSON.parse(raw) as UserProgress; }
  catch { return defaultProgress(); }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function defaultProgress(): UserProgress {
  return { totalXp: 0, completedChallenges: [], streak: 0, lastActiveDate: null, dailyChallengeId: null, dailyChallengeDate: null, dailyChallengeCompleted: false };
}

export function getLevel(p: UserProgress) { return levelFromXp(p.totalXp); }
export function getXpIntoLevel(p: UserProgress) { return xpIntoCurrentLevel(p.totalXp); }
export function getXpForNextLevel(p: UserProgress) { return xpForNextLevel(p.totalXp); }

export function isChallengeCompleted(p: UserProgress, challengeId: string): boolean {
  const c = p.completedChallenges.find((c) => c.challengeId === challengeId);
  // Completed = done with at least 2 stars (tried it = in progress only)
  return !!c && c.stars >= 2;
}

export function isChallengeAttempted(p: UserProgress, challengeId: string): boolean {
  return p.completedChallenges.some((c) => c.challengeId === challengeId);
}

export function getChallengeStars(p: UserProgress, challengeId: string): number {
  return p.completedChallenges.find((c) => c.challengeId === challengeId)?.stars ?? 0;
}

export function isStageUnlocked(p: UserProgress, unlockLevel: number): boolean {
  return getLevel(p) >= unlockLevel;
}

// A challenge is unlocked if:
// 1. It's the first challenge in the stage, OR
// 2. The previous challenge has been completed with >= minStarsToUnlock stars
export function isChallengeUnlocked(p: UserProgress, stageId: string, challengeIndex: number): boolean {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return false;
  if (!isStageUnlocked(p, stage.unlockLevel)) return false;
  if (challengeIndex === 0) return true;

  const prevChallenge = stage.challenges[challengeIndex - 1];
  const currentChallenge = stage.challenges[challengeIndex];
  const prevStars = getChallengeStars(p, prevChallenge.id);
  return prevStars >= currentChallenge.minStarsToUnlock;
}

export function completeChallenge(p: UserProgress, challengeId: string, xpReward: number, stars: number): UserProgress {
  const existing = p.completedChallenges.find((c) => c.challengeId === challengeId);
  const existingStars = existing?.stars ?? 0;

  let newXp = p.totalXp;
  let newCompleted = [...p.completedChallenges];

  if (!existing) {
    // First attempt — always give XP
    newXp += xpReward;
    newCompleted.push({ challengeId, completedAt: new Date().toISOString(), stars });
  } else if (stars > existingStars) {
    // Improved — give bonus XP and update stars
    newXp += Math.round(xpReward * 0.25);
    newCompleted = newCompleted.map((c) =>
      c.challengeId === challengeId ? { ...c, stars } : c
    );
  }

  // Streak
  const today = new Date().toDateString();
  const lastActive = p.lastActiveDate;
  let streak = p.streak;
  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    streak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
  }

  return { ...p, totalXp: newXp, completedChallenges: newCompleted, streak, lastActiveDate: today };
}

export function getDailyChallenge(p: UserProgress): string {
  const today = new Date().toDateString();
  if (p.dailyChallengeDate === today && p.dailyChallengeId) return p.dailyChallengeId;
  const level = getLevel(p);
  const available = STAGES.filter((s) => s.unlockLevel <= level).flatMap((s) => s.challenges);
  if (available.length === 0) return STAGES[0].challenges[0].id;
  const idx = Math.floor(
    (new Date().getFullYear() * 1000 + new Date().getMonth() * 31 + new Date().getDate()) % available.length
  );
  return available[idx].id;
}

export function getStageProgress(p: UserProgress, stageId: string): { done: number; total: number } {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return { done: 0, total: 0 };
  const done = stage.challenges.filter((c) => isChallengeCompleted(p, c.id)).length;
  return { done, total: stage.challenges.length };
}

// Returns the status of a challenge for display
export type ChallengeStatus = "locked" | "available" | "in_progress" | "done";

export function getChallengeStatus(p: UserProgress, stageId: string, challengeIndex: number): ChallengeStatus {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return "locked";
  const challenge = stage.challenges[challengeIndex];
  if (!isChallengeUnlocked(p, stageId, challengeIndex)) return "locked";
  const stars = getChallengeStars(p, challenge.id);
  if (stars === 0) return "available";
  if (stars === 1) return "in_progress"; // tried it but needs more practice
  return "done"; // 2+ stars = properly done
}
