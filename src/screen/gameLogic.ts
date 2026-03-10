import type { Question } from "../shared/types";
import { QUESTION_CATEGORIES } from "../shared/constants";

// ─── Shuffle ───

export function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// ─── Name placeholder ───

export function replaceNamePlaceholder(text: string, name: string): string {
  return text.replace(/\{name\}/g, name);
}

// ─── Question picking ───

export function getRandomQuestions(
  allQuestions: Question[],
  usedIds: number[],
  disabledCategories: string[],
  isPremium: boolean,
  count: number,
): { questions: Question[]; updatedUsedIds: number[] } {
  const heroCategories = QUESTION_CATEGORIES.filter((c) => c.hero).map(
    (c) => c.key,
  );

  const isAllowed = (q: Question) => {
    if (!isPremium && heroCategories.includes(q.category)) return false;
    if (disabledCategories.includes(q.category)) return false;
    return true;
  };

  let currentUsedIds = usedIds;
  let available = allQuestions.filter(
    (q) => isAllowed(q) && !currentUsedIds.includes(q.id),
  );

  // If not enough, reset used IDs
  if (available.length < count) {
    currentUsedIds = [];
    available = allQuestions.filter(isAllowed);
  }

  const shuffled = shuffleArray(available);
  return {
    questions: shuffled.slice(0, count),
    updatedUsedIds: currentUsedIds,
  };
}

// ─── Scoring ───

export function getStreakBonus(streak: number): number {
  if (streak < 3) return 0;
  const capped = Math.min(streak, 8);
  return 50 + (capped - 3) * 25;
}

export function getHostPointsPerCorrect(numPlayers: number): number {
  const guessers = numPlayers - 1;
  if (guessers <= 0) return 0;
  return Math.floor(200 / guessers);
}

// ─── Leaderboard ranking ───

export interface RankedPlayer {
  deviceId: number;
  nickname: string;
  profilePic: string;
  score: number;
  correctGuesses: number;
  rank: number;
}

export function computeRankedPlayers(
  players: {
    deviceId: number;
    nickname: string;
    profilePic: string;
    score: number;
    correctGuesses: number;
  }[],
): RankedPlayer[] {
  const sorted = players.slice().sort((a, b) => b.score - a.score);
  const ranks: number[] = [];

  sorted.forEach((player, idx) => {
    if (idx === 0) {
      ranks.push(1);
    } else if (player.score === sorted[idx - 1]!.score) {
      ranks.push(ranks[idx - 1]!);
    } else {
      ranks.push(idx + 1);
    }
  });

  return sorted.map((player, idx) => ({
    ...player,
    rank: ranks[idx]!,
  }));
}

export interface RankGroup {
  rank: number;
  players: RankedPlayer[];
  score: number;
}

export function buildRankGroups(ranked: RankedPlayer[]): RankGroup[] {
  const groups: RankGroup[] = [];
  let current: RankGroup | null = null;

  for (const player of ranked) {
    if (!current || player.rank !== current.rank) {
      current = { rank: player.rank, players: [player], score: player.score };
      groups.push(current);
    } else {
      current.players.push(player);
    }
  }

  return groups;
}
