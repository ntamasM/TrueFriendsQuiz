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

  const isWinner = state.leaderboardRank === 1;

  return (
    <div className="view active" id="view-leaderboard">
      {isWinner && <div className="lb-winner-crown">👑</div>}
      <div className="lb-rank">#{state.leaderboardRank}</div>
      <div className="lb-rank-text">
        {t("yourRank")} #{state.leaderboardRank} /{" "}
        {state.leaderboardTotalPlayers}
      </div>
      <div className="lb-final-score">
        {state.leaderboardScore} {t("points")}
      </div>

      {/* Per-player stats */}
      <div className="lb-stats">
        <div className="lb-stat">
          🎯 {state.leaderboardCorrectGuesses}/{state.leaderboardTotalRounds}{" "}
          {t("correct")}
        </div>
        {state.leaderboardBestStreak >= 3 && (
          <div className="lb-stat">
            🔥 {uiText?.bestStreak ?? "Best streak"}: {state.leaderboardBestStreak}{" "}
            {uiText?.pointsGuide?.inARow ?? "in a row"}
          </div>
        )}
        {state.leaderboardSpeedBonuses > 0 && (
          <div className="lb-stat">
            ⚡ {uiText?.speedBonuses ?? "Speed bonuses"}: {state.leaderboardSpeedBonuses}x
          </div>
        )}
        {state.leaderboardTimesHost > 0 && (
          <div className="lb-stat">
            👑 {state.leaderboardTimesHost}{" "}
            {state.leaderboardTimesHost === 1
              ? uiText?.hostedRound ?? "round hosted"
              : uiText?.hostedRounds ?? "rounds hosted"}
          </div>
        )}
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
