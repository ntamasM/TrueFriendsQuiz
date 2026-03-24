import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";
import { replaceNamePlaceholder } from "../gameLogic";

const ANSWER_CLASSES = ["answer-a", "answer-b", "answer-c", "answer-d"];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

let emojiIdCounter = 0;

export default function Guessing() {
  const state = useScreenState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Listen for emoji_broadcast messages on the AirConsole instance
  // We access it through the global window object since screen's AirConsole is initialized globally
  useEffect(() => {
    const handler = (event: CustomEvent) => {
      const { emoji, x } = event.detail;
      const id = ++emojiIdCounter;
      setEmojis((prev) => [...prev, { id, emoji, x }]);
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 2000);
    };

    window.addEventListener(
      "emoji_reaction" as string,
      handler as EventListener,
    );
    return () => {
      window.removeEventListener(
        "emoji_reaction" as string,
        handler as EventListener,
      );
    };
  }, []);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const host = state.players[state.currentRound % state.players.length];
  const question = state.currentQuestion;
  if (!host || !question) return null;

  const displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );
  const pct = (state.guessTimeLeft / state.guessTime) * 100;
  const isUrgent = state.guessTimeLeft <= 5;

  const guessers = state.players.filter(
    (_, i) => i !== state.currentRound % state.players.length,
  );

  return (
    <div className="phase active" id="guessing">
      {/* Floating emoji reactions */}
      <div className="emoji-reactions">
        {emojis.map((e) => (
          <div
            key={e.id}
            className="emoji-reaction"
            style={{ left: `${e.x * 100}%`, bottom: "20%" }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      <div className="round-info">
        {t("round")} {state.currentRound + 1} {t("of")} {state.totalRounds}
      </div>

      <div className="question-display">
        <div className="question-text">{displayQuestion}</div>
        <div className="answers-grid">
          {question.answers.map((ans, idx) => (
            <div key={idx} className={`answer-card ${ANSWER_CLASSES[idx]}`}>
              {ans}
            </div>
          ))}
        </div>
        <div className="category-badge">
          {(uiText?.categories as Record<string, string>)?.[
            question.category
          ] ?? question.category}
        </div>
      </div>

      <div className={`timer-container${isUrgent ? " timer-urgent" : ""}`}>
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="timer-text">
          {state.guessTimeLeft}
          {t("seconds")}
        </div>
      </div>

      {/* Streak indicators */}
      <div className="streak-indicators">
        {guessers
          .filter((p) => (state.streaks[p.deviceId] ?? 0) >= 3)
          .map((p) => (
            <div key={p.deviceId} className="streak-badge">
              <span>{p.nickname}</span>
              <span className="streak-fire">
                x{state.streaks[p.deviceId]}
              </span>
            </div>
          ))}
      </div>

      <div className="players-status">
        {guessers.map((p) => (
          <div
            key={p.deviceId}
            className={`player-status-dot ${
              state.playerGuesses[p.deviceId] !== undefined ? "answered" : ""
            }`}
          >
            <span className="dot" />
            <span>{p.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
