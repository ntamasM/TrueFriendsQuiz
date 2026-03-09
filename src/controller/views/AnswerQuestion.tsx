import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface AnswerQuestionProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function AnswerQuestion({ ac }: AnswerQuestionProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Reset when question changes
  useEffect(() => {
    setSelectedIdx(null);
  }, [state.answerQuestion]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selectedIdx !== null) return;
      setSelectedIdx(idx);
      ac.current?.message(AirConsole.SCREEN, {
        action: "host_answer",
        answerId: idx,
      });
    },
    [ac, selectedIdx],
  );

  return (
    <div className="view active" id="view-answer">
      <div className="answer-title">{t("answerQuestion")}</div>
      <div className="answer-question-text">{state.answerQuestion}</div>
      <div className="answer-options">
        {state.answerOptions.map((ans, idx) => (
          <div
            key={idx}
            className={`answer-option${idx === selectedIdx ? " selected" : ""}`}
            onPointerDown={() => handleAnswer(idx)}
          >
            {ans}
          </div>
        ))}
      </div>
    </div>
  );
}
