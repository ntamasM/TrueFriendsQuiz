import type { Question, UiText } from "../types";
import type { LanguageCode } from "../constants";
import { SUPPORTED_LANGUAGES } from "../constants";

// Caches so we only import each language once
const uiTextCache: Partial<Record<LanguageCode, UiText>> = {};
const questionsCache: Partial<Record<LanguageCode, Question[]>> = {};

export async function loadUiText(lang: LanguageCode): Promise<UiText> {
  const cached = uiTextCache[lang];
  if (cached) return cached;

  const mod = await import(`./locales/${lang}/ui-text.json`);
  const data = mod.default as UiText;
  uiTextCache[lang] = data;
  return data;
}

export async function loadQuestions(lang: LanguageCode): Promise<Question[]> {
  const cached = questionsCache[lang];
  if (cached) return cached;

  const mod = await import(`./locales/${lang}/questions.json`);
  const data = mod.default as Question[];
  questionsCache[lang] = data;
  return data;
}

export async function loadLanguage(
  lang: LanguageCode,
): Promise<{ uiText: UiText; questions: Question[] }> {
  const [uiText, questions] = await Promise.all([
    loadUiText(lang),
    loadQuestions(lang),
  ]);
  return { uiText, questions };
}

export function isValidLanguage(lang: string): lang is LanguageCode {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

export function detectBrowserLanguage(): LanguageCode {
  const raw = (navigator.language || "en").substring(0, 2).toLowerCase();
  return isValidLanguage(raw) ? raw : "en";
}
