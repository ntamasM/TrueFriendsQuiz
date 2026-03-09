import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface PickQuestionProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function PickQuestion({ ac }: PickQuestionProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Reset selection when questions change
  useEffect(() => {
    setSelectedId(null);
  }, [state.pickQuestions]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handlePick = useCallback(
    (questionId: number) => {
      if (selectedId !== null) return;
      setSelectedId(questionId);
      ac.current?.message(AirConsole.SCREEN, {
        action: "question_selected",
        questionId,
      });
    },
    [ac, selectedId],
  );

  return (
    <div className="view active" id="view-pick">
      <div className="pick-title">{t("pickQuestion")}</div>
      <div className="question-options">
        {state.pickQuestions.map((q) => (
          <div
            key={q.id}
            className={`question-option${q.id === selectedId ? " selected" : ""}`}
            style={{
              pointerEvents: selectedId !== null ? "none" : "auto",
              opacity: selectedId !== null && q.id !== selectedId ? 0.6 : 1,
            }}
            onPointerDown={() => handlePick(q.id)}
          >
            {q.question}
          </div>
        ))}
      </div>
    </div>
  );
}
