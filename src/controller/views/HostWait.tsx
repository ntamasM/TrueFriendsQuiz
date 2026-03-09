import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

export default function HostWait() {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  return (
    <div className="view active" id="view-host-wait">
      <div className="host-wait-text">{t("youAnswered")}</div>
      <div className="host-wait-sub">{t("waitingForGuesses")}</div>
    </div>
  );
}
