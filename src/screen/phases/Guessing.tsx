import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";
import { replaceNamePlaceholder } from "../gameLogic";

const ANSWER_CLASSES = ["answer-a", "answer-b", "answer-c", "answer-d"];

export default function Guessing() {
  const state = useScreenState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const host = state.players[state.currentRound % state.players.length];
  const question = state.currentQuestion;
  if (!host || !question) return null;

  const displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );
  const pct = (state.guessTimeLeft / state.guessTime) * 100;

  const guessers = state.players.filter(
    (_, i) => i !== state.currentRound % state.players.length,
  );

  return (
    <div className="phase active" id="guessing">
      <div className="question-display">
        <div className="question-text">{displayQuestion}</div>
        <div className="answers-grid">
          {question.answers.map((ans, idx) => (
            <div key={idx} className={`answer-card ${ANSWER_CLASSES[idx]}`}>
              {ans}
            </div>
          ))}
        </div>
      </div>

      <div className="timer-container">
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="timer-text">
          {state.guessTimeLeft}
          {t("seconds")}
        </div>
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
