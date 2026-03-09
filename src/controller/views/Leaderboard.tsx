import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface LeaderboardProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function Leaderboard({ ac }: LeaderboardProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handlePlayAgain = useCallback(() => {
    ac.current?.message(AirConsole.SCREEN, { action: "play_again" });
  }, [ac]);

  const handleBackToMenu = useCallback(() => {
    ac.current?.message(AirConsole.SCREEN, { action: "back_to_menu" });
  }, [ac]);

  return (
    <div className="view active" id="view-leaderboard">
      <div className="lb-rank">#{state.leaderboardRank}</div>
      <div className="lb-rank-text">
        {t("yourRank")} #{state.leaderboardRank} /{" "}
        {state.leaderboardTotalPlayers}
      </div>
      <div className="lb-final-score">
        {state.leaderboardScore} {t("points")}
      </div>
      <div className="lb-stat">
        {state.leaderboardCorrectGuesses}/{state.leaderboardTotalRounds}{" "}
        {t("correct")}
      </div>

      {state.isMaster && (
        <>
          <button
            className="ctrl-btn ctrl-play-again"
            onPointerDown={handlePlayAgain}
          >
            {t("playAgain")}
          </button>
          <button
            className="ctrl-btn ctrl-menu"
            onPointerDown={handleBackToMenu}
          >
            {t("backToMenu")}
          </button>
        </>
      )}
    </div>
  );
}
