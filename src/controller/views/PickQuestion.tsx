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
  const [locked, setLocked] = useState(false);
  const [rerolling, setRerolling] = useState(false);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // A new question arrived (initial assign or reroll result) → re-enable buttons.
  useEffect(() => {
    setLocked(false);
    setRerolling(false);
  }, [state.pickQuestions]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const q = state.pickQuestions[0];

  const handleUse = useCallback(() => {
    if (locked || rerolling || !q) return;
    setLocked(true);
    ac.current?.message(AirConsole.SCREEN, {
      action: "question_selected",
      questionId: q.id,
    });
  }, [ac, locked, rerolling, q]);

  const rerollsLeft = state.rerollsLeft;
  const canReroll = rerollsLeft > 0;

  const handleReroll = useCallback(() => {
    if (locked || rerolling || !canReroll) return;
    setRerolling(true);
    ac.current?.message(AirConsole.SCREEN, {
      action: "reroll_question",
    });
  }, [ac, locked, rerolling, canReroll]);

  if (!q) return null;

  return (
    <div className="view active" id="view-pick">
      <div className="pick-title">{t("pickQuestion")}</div>
      <div className="question-options">
        <div
          className={`question-option${rerolling ? " rerolling" : ""}`}
          style={{ opacity: rerolling ? 0.6 : 1, pointerEvents: "none" }}
        >
          <span className="question-option-category">
            {(uiText?.categories as Record<string, string>)?.[q.category] ??
              q.category}
          </span>
          {q.question}
        </div>
      </div>
      <div className="pick-actions">
        <button
          className="ctrl-btn ctrl-start-btn"
          disabled={locked || rerolling}
          onPointerDown={handleUse}
        >
          {t("useThisQuestion")}
        </button>
        <button
          className="ctrl-btn ctrl-settings-btn"
          disabled={locked || rerolling || !canReroll}
          onPointerDown={handleReroll}
        >
          {canReroll
            ? `🎲 ${t("reroll")} (${rerollsLeft})`
            : t("noRerollsLeft")}
        </button>
      </div>
    </div>
  );
}
