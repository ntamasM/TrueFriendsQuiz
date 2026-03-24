import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

export default function Result() {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Hide flash after animation
  useEffect(() => {
    setShowFlash(true);
    const timer = setTimeout(() => setShowFlash(false), 600);
    return () => clearTimeout(timer);
  }, [state.resultCorrect]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  let icon: string;
  let text: string;
  let textClass = "result-text";
  let answerText: string;
  let flashClass = "";

  if (state.resultIsHost) {
    icon = "👑";
    text = t("youAreHost");
    answerText = `${t("theAnswerWas")}: ${state.resultCorrectAnswer}`;
  } else if (state.resultCorrect) {
    icon = "🎉";
    text = t("correct");
    textClass = "result-text correct";
    answerText = `+${state.resultPoints} ${t("points")}`;
    flashClass = "correct";
  } else {
    icon = "😢";
    text = t("wrong");
    textClass = "result-text wrong";
    answerText = `${t("theAnswerWas")}: ${state.resultCorrectAnswer}`;
    flashClass = "wrong";
  }

  return (
    <div className="view active" id="view-result">
      {showFlash && !state.resultIsHost && (
        <div className={`result-flash ${flashClass}`} />
      )}
      <div className="result-icon">{icon}</div>
      <div className={textClass}>{text}</div>
      <div className="result-answer">{answerText}</div>
      {state.resultSpeedBonus > 0 && (
        <div className="result-speed-bonus">
          ⚡ +{state.resultSpeedBonus} {uiText?.speedBonus ?? "speed bonus!"}
        </div>
      )}
      {state.resultStreak >= 3 && (
        <div className="result-streak">
          🔥 {state.resultStreak} {uiText?.pointsGuide?.inARow ?? "in a row"}! +{state.resultStreakBonus}
        </div>
      )}
      <div className="result-score">
        {t("score")}: {state.resultTotalScore} {t("points")}
      </div>
    </div>
  );
}
