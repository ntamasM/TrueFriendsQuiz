import type { CategoryDef } from "./types";

export const QUESTION_CATEGORIES: CategoryDef[] = [
  { key: "favorites", hero: false },
  { key: "personality", hero: false },
  { key: "wouldYouRather", hero: false },
  { key: "deepPersonal", hero: false },
  { key: "funRandom", hero: false },
  { key: "experiencesDreams", hero: false },
  { key: "deepSpicy", hero: true },
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

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: "🇬🇧 English",
  el: "🇬🇷 Ελληνικά",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  de: "🇩🇪 Deutsch",
  tr: "🇹🇷 Türkçe",
  ar: "🇸🇦 العربية",
};
