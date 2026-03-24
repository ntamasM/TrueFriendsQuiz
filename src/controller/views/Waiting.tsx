import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

const WAITING_KEY_MAP: Record<string, keyof UiText> = {
  choosingCategory: "choosingCategory",
  choosingQuestion: "choosingQuestion",
  waitingForAnswer: "waitingForAnswer",
  waitingForGuesses: "waitingForGuesses",
  gameInProgress: "gameInProgress",
  notEnoughPlayers: "notEnoughPlayers",
};

export default function Waiting() {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  let displayMessage: string;

  if (state.waitingKey && uiText) {
    const uiKey = WAITING_KEY_MAP[state.waitingKey];
    const translated = uiKey ? (uiText[uiKey] as string) : null;
    if (translated && state.waitingHostNickname) {
      displayMessage = `${state.waitingHostNickname} ${translated}`;
    } else if (translated) {
      displayMessage = translated;
    } else {
      displayMessage = state.waitingMessage;
    }
  } else {
    displayMessage =
      state.waitingMessage || (uiText ? uiText.waitingToStart : "Waiting...");
  }

  return (
    <div className="view active" id="view-waiting">
      <div className="waiting-icon">⏳</div>
      <div className="waiting-message">{displayMessage}</div>
    </div>
  );
}
