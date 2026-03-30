import type { CategoryDef, CategoryVoteOption } from "./types";

export const QUESTION_CATEGORIES: CategoryDef[] = [
  // Free categories
  { key: "favorites", hero: false },
  { key: "personality", hero: false },
  { key: "wouldYouRather", hero: false },
  { key: "deepPersonal", hero: false },
  { key: "funRandom", hero: false },
  { key: "experiencesDreams", hero: false },
  { key: "hotTakes", hero: false },
  { key: "hypothetical", hero: false },
  { key: "memories", hero: false },
  // Pro (Hero) categories
  { key: "deepSpicy", hero: true },
  { key: "relationships", hero: true },
  { key: "moneyPower", hero: true },
  { key: "darkSecrets", hero: true },
  { key: "bodyCount", hero: true },
  { key: "neverHaveIEver", hero: true },
  { key: "afterDark", hero: true },
  { key: "guilty", hero: true },
  { key: "drunkConfessions", hero: true },
  { key: "conspiracyTheories", hero: true },
  { key: "superlatives", hero: true },
];

export const SUPPORTED_LANGUAGES = [
  "en",
  "el",
  "es",
  "fr",
  "de",
  "tr",
  "ar",
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const CATEGORY_VOTE_GROUPS: Record<CategoryVoteOption, string[]> = {
  fun: [
    "funRandom",
    "favorites",
    "personality",
    "hotTakes",
    "conspiracyTheories",
    "superlatives",
  ],
  deep: ["deepPersonal", "experiencesDreams", "memories", "relationships"],
  dilemma: ["wouldYouRather", "hypothetical", "moneyPower"],
  spicy: [
    "deepSpicy",
    "darkSecrets",
    "bodyCount",
    "neverHaveIEver",
    "afterDark",
    "guilty",
    "drunkConfessions",
  ],
};

export const CATEGORY_VOTE_LABELS: Record<
  CategoryVoteOption,
  { icon: string; label: string }
> = {
  fun: { icon: "😂", label: "Fun & Random" },
  deep: { icon: "💭", label: "Deep & Personal" },
  dilemma: { icon: "🤔", label: "Would You Rather" },
  spicy: { icon: "🔥", label: "Spicy" },
};

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: "🇬🇧 English",
  el: "🇬🇷 Ελληνικά",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  de: "🇩🇪 Deutsch",
  tr: "🇹🇷 Türkçe",
  ar: "🇸🇦 العربية",
};
