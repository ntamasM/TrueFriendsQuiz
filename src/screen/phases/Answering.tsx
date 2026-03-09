import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";
import { replaceNamePlaceholder } from "../gameLogic";

const ANSWER_CLASSES = ["answer-a", "answer-b", "answer-c", "answer-d"];

export default function Answering() {
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

  return (
    <div className="phase active" id="answering">
      <div className="round-info">
        {t("round")} {state.currentRound + 1} {t("of")} {state.totalRounds}
      </div>
      <div className="host-banner">
        <img
          className="host-avatar"
          src={host.profilePic}
          alt=""
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="host-info">
          <div className="host-name">{host.nickname}</div>
          <div className="host-status waiting-dots">
            {t("waitingForAnswer")}
          </div>
        </div>
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
      </div>
    </div>
  );
}
