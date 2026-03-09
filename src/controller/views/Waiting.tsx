import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

export default function Waiting() {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  return (
    <div className="view active" id="view-waiting">
      <div className="waiting-message">
        {state.waitingMessage ||
          (uiText ? uiText.waitingToStart : "Waiting...")}
      </div>
    </div>
  );
}
