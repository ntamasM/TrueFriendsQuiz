import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

export default function Result() {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  let icon: string;
  let text: string;
  let textClass = "result-text";
  let answerText: string;

  if (state.resultIsHost) {
    icon = "👑";
    text = t("youAreHost");
    answerText = `${t("theAnswerWas")}: ${state.resultCorrectAnswer}`;
  } else if (state.resultCorrect) {
    icon = "🎉";
    text = t("correct");
    textClass = "result-text correct";
    answerText = `+${state.resultPoints} ${t("points")}`;
  } else {
    icon = "😢";
    text = t("wrong");
    textClass = "result-text wrong";
    answerText = `${t("theAnswerWas")}: ${state.resultCorrectAnswer}`;
  }

  return (
    <div className="view active" id="view-result">
      <div className="result-icon">{icon}</div>
      <div className={textClass}>{text}</div>
      <div className="result-answer">{answerText}</div>
      <div className="result-score">
        {t("score")}: {state.resultTotalScore} {t("points")}
      </div>
    </div>
  );
}
