import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";
import { computeRankedPlayers, buildRankGroups } from "../gameLogic";

export default function Leaderboard() {
  const state = useScreenState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const ranked = computeRankedPlayers(state.players);
  const rankGroups = buildRankGroups(ranked);
  const podiumGroups = rankGroups.slice(0, 3);

  // Podium display order: 2nd, 1st, 3rd
  const podiumOrder = [1, 0, 2];

  const placeLabels = (uiText?.place ?? ["1st", "2nd", "3rd"]) as string[];

  // Count players shown on podium
  const podiumPlayerCount = podiumGroups.reduce(
    (sum, g) => sum + g.players.length,
    0,
  );

  const numPlayers = state.players.length;
  const perCorrect = Math.floor((100 / numPlayers) * 2);
  const pg = uiText?.pointsGuide;
  const inARow = pg?.inARow ?? "in a row";
  const streakData = [
    [`3 ${inARow}`, "+50"],
    [`4 ${inARow}`, "+75"],
    [`5 ${inARow}`, "+100"],
    [`6 ${inARow}`, "+125"],
    [`7 ${inARow}`, "+150"],
    [`8+ ${inARow}`, "+175"],
  ];

  return (
    <div className="phase active" id="leaderboard">
      <div className="leaderboard-title">{t("gameOver")}</div>
      <div className="leaderboard-subtitle">{t("finalScores")}</div>

      <div className="leaderboard-body">
        {/* Points Guide */}
        <div className="points-guide">
          <div className="points-guide-title">
            ⭐ {pg?.title ?? "How Points Work"}
          </div>

          <div className="points-guide-section">
            <div className="points-guide-section-title">
              🎯 {pg?.guesser ?? "Guesser"}
            </div>
            <div className="points-guide-row">
              <span>{pg?.correctGuess ?? "Correct guess"}</span>
              <span>+100</span>
            </div>
          </div>

          <div className="points-guide-section">
            <div className="points-guide-section-title">
              👑 {pg?.host ?? "Host"}
            </div>
            <div className="points-guide-row">
              <span>{pg?.perCorrectGuesser ?? "Per correct guesser"}</span>
              <span>+{perCorrect}</span>
            </div>
          </div>

          <div className="points-guide-section">
            <div className="points-guide-section-title">
              🔥 {pg?.streakBonus ?? "Streak Bonus"}
            </div>
            {streakData.map(([label, pts], i) => (
              <div key={i} className="points-guide-row">
                <span>{label}</span>
                <span>{pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Podium */}
        <div className="podium">
          {podiumOrder.map((orderIdx) => {
            if (orderIdx >= podiumGroups.length) return null;
            const group = podiumGroups[orderIdx]!;
            const isSolo = group.players.length === 1;

            return (
              <div
                key={group.rank}
                className={`podium-place podium-rank-${group.rank}${
                  !isSolo ? " podium-group" : ""
                }`}
              >
                {isSolo && (
                  <img
                    className="podium-avatar"
                    src={group.players[0]!.profilePic}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                {group.players.map((p) => (
                  <div key={p.deviceId} className="podium-name">
                    {p.nickname}
                  </div>
                ))}

                {isSolo && (
                  <div className="podium-score">
                    {group.score} {t("points")}
                  </div>
                )}

                <div className={`podium-bar podium-bar-rank-${group.rank}`}>
                  {placeLabels[group.rank - 1] ?? `#${group.rank}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Remaining players */}
        <div className="leaderboard-list">
          {ranked.slice(podiumPlayerCount).map((player) => (
            <div key={player.deviceId} className="leaderboard-row">
              <div className="leaderboard-rank">#{player.rank}</div>
              <img
                className="leaderboard-row-avatar"
                src={player.profilePic}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="leaderboard-row-name">{player.nickname}</div>
              <div className="leaderboard-row-score">
                {player.score} {t("points")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
