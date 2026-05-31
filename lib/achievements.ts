import { UserProgress, getLevel, getStageProgress } from "./progress";
import { STAGES } from "./data";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (p: UserProgress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_challenge",
    title: "First Stroke",
    description: "Complete your first challenge",
    emoji: "✏️",
    check: (p) => p.completedChallenges.length >= 1,
  },
  {
    id: "five_challenges",
    title: "Getting Started",
    description: "Complete 5 challenges",
    emoji: "🎯",
    check: (p) => p.completedChallenges.length >= 5,
  },
  {
    id: "ten_challenges",
    title: "On a Roll",
    description: "Complete 10 challenges",
    emoji: "🔥",
    check: (p) => p.completedChallenges.length >= 10,
  },
  {
    id: "all_challenges",
    title: "Completionist",
    description: "Complete every single challenge",
    emoji: "🏆",
    check: (p) => {
      const total = STAGES.flatMap((s) => s.challenges).length;
      return p.completedChallenges.filter(c => c.stars >= 2).length >= total;
    },
  },
  {
    id: "final_boss",
    title: "Original Artist",
    description: "Complete the Final OC Reveal challenge",
    emoji: "🌸",
    check: (p) => p.completedChallenges.some(c => c.challengeId === "s15c6" && c.stars >= 2),
  },
  {
    id: "level_5",
    title: "Sketch Apprentice",
    description: "Reach Level 5",
    emoji: "⭐",
    check: (p) => getLevel(p) >= 5,
  },
  {
    id: "level_10",
    title: "Sketch Adept",
    description: "Reach Level 10",
    emoji: "🌟",
    check: (p) => getLevel(p) >= 10,
  },
  {
    id: "level_16",
    title: "Anime Initiate",
    description: "Reach Level 16 and unlock anime stages",
    emoji: "🎌",
    check: (p) => getLevel(p) >= 16,
  },
  {
    id: "level_25",
    title: "Character Creator",
    description: "Reach Level 25 and unlock the Full Character stage",
    emoji: "👑",
    check: (p) => getLevel(p) >= 25,
  },
  {
    id: "streak_3",
    title: "Consistent",
    description: "Maintain a 3-day streak",
    emoji: "🔥",
    check: (p) => p.streak >= 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    emoji: "💪",
    check: (p) => p.streak >= 7,
  },
  {
    id: "streak_30",
    title: "Dedicated Artist",
    description: "Maintain a 30-day streak",
    emoji: "🏅",
    check: (p) => p.streak >= 30,
  },
  {
    id: "stage1_complete",
    title: "Line Master",
    description: "Complete all Lines & Control challenges",
    emoji: "📏",
    check: (p) => {
      const { done, total } = getStageProgress(p, "stage1");
      return done === total && total > 0;
    },
  },
  {
    id: "stage2_complete",
    title: "Shape Shifter",
    description: "Complete all Basic Shapes challenges",
    emoji: "⭕",
    check: (p) => {
      const { done, total } = getStageProgress(p, "stage2");
      return done === total && total > 0;
    },
  },
  {
    id: "stage3_complete",
    title: "Third Dimension",
    description: "Complete all Form & 3D challenges",
    emoji: "📦",
    check: (p) => {
      const { done, total } = getStageProgress(p, "stage3");
      return done === total && total > 0;
    },
  },
  {
    id: "stage4_complete",
    title: "Perspective Pro",
    description: "Complete all Perspective challenges",
    emoji: "📐",
    check: (p) => {
      const { done, total } = getStageProgress(p, "stage4");
      return done === total && total > 0;
    },
  },
  {
    id: "stage5_complete",
    title: "Light Chaser",
    description: "Complete all Light & Shadow challenges",
    emoji: "💡",
    check: (p) => {
      const { done, total } = getStageProgress(p, "stage5");
      return done === total && total > 0;
    },
  },
  {
    id: "three_star",
    title: "Perfectionist",
    description: "Get 3 stars on any challenge",
    emoji: "🌠",
    check: (p) => p.completedChallenges.some((c) => c.stars === 3),
  },
  {
    id: "five_three_star",
    title: "Star Collector",
    description: "Get 3 stars on 5 challenges",
    emoji: "✨",
    check: (p) => p.completedChallenges.filter((c) => c.stars === 3).length >= 5,
  },
  {
    id: "daily_done",
    title: "Daily Devotion",
    description: "Complete a daily challenge",
    emoji: "⚡",
    check: (p) => p.dailyChallengeCompleted === true,
  },
];

export function getUnlockedAchievements(p: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(p));
}

export function getNewAchievements(before: UserProgress, after: UserProgress): Achievement[] {
  const beforeIds = new Set(ACHIEVEMENTS.filter((a) => a.check(before)).map((a) => a.id));
  return ACHIEVEMENTS.filter((a) => !beforeIds.has(a.id) && a.check(after));
}
