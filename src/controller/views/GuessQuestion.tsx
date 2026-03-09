import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface GuessQuestionProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function GuessQuestion({ ac }: GuessQuestionProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Reset when question changes
  useEffect(() => {
    setSelectedIdx(null);
  }, [state.guessQuestion]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handleGuess = useCallback(
    (idx: number) => {
      if (selectedIdx !== null || state.hasGuessed) return;
      setSelectedIdx(idx);
      ac.current?.message(AirConsole.SCREEN, {
        action: "player_guess",
        answerId: idx,
      });
    },
    [ac, selectedIdx, state.hasGuessed],
  );

  return (
    <div className="view active" id="view-guess">
      <div className="guess-title">
        {t("guessAnswer")} {state.guessHostNickname}
      </div>
      <div className="guess-question-text">{state.guessQuestion}</div>
      <div className="guess-timer">
        {state.guessTimeLeft}
        {t("seconds")}
      </div>
      <div className="guess-options">
        {state.guessOptions.map((ans, idx) => (
          <div
            key={idx}
            className={`guess-option${idx === selectedIdx ? " selected" : ""}`}
            style={{
              pointerEvents:
                state.hasGuessed || selectedIdx !== null ? "none" : "auto",
              opacity:
                state.hasGuessed ||
                (selectedIdx !== null && idx !== selectedIdx)
                  ? 0.7
                  : 1,
            }}
            onPointerDown={() => handleGuess(idx)}
          >
            {ans}
          </div>
        ))}
      </div>
    </div>
  );
}
