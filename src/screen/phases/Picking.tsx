import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";

export default function Picking() {
  const state = useScreenState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const host = state.players[state.currentRound % state.players.length];
  if (!host) return null;

  const subStep = state.pickingSubStep;

  let statusText: string;
  if (subStep === "category_vote") {
    statusText = t("playersVoting");
  } else if (subStep === "category_vote_result") {
    statusText = `${host.nickname} ${t("choosingCategory")}`;
  } else {
    statusText = t("choosingQuestion");
  }

  return (
    <div className="phase active" id="picking">
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
          <div className="host-status waiting-dots">{statusText}</div>
        </div>
      </div>
    </div>
  );
}
