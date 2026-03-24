import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";
import {
  replaceNamePlaceholder,
  getStreakBonus,
  getHostPointsPerCorrect,
  SPEED_BONUS,
  computeRankedPlayers,
} from "../gameLogic";

export default function Reveal() {
  const state = useScreenState();
  const [uiText, setUiText] = useState<UiText | null>(null);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const host = state.players[state.currentRound % state.players.length];
  const question = state.currentQuestion;
  const correctIdx = state.hostAnswer;
  if (!host || !question || correctIdx === null) return null;

  const displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );

  const guessers = state.players.filter(
    (_, i) => i !== state.currentRound % state.players.length,
  );

  // Mini leaderboard — top 3 current standings
  const ranked = computeRankedPlayers(state.players);
  const top3 = ranked.slice(0, 3);

  return (
    <div className="phase active" id="reveal">
      <div className="reveal-question">{displayQuestion}</div>

      <div className="reveal-answers">
        {question.answers.map((ans, idx) => (
          <div
            key={idx}
            className={`reveal-answer ${
              idx === correctIdx ? "correct-answer" : "wrong-answer"
            }`}
          >
            <div>{ans}</div>
            <div className="guess-avatars">
              {guessers
                .filter((p) => state.playerGuesses[p.deviceId] === idx)
                .map((p) => (
                  <img
                    key={p.deviceId}
                    className="guess-avatar"
                    src={p.profilePic}
                    title={p.nickname}
                    alt={p.nickname}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="score-changes">
        {guessers.map((p) => {
          const guess = state.playerGuesses[p.deviceId];
          const isCorrect = guess === correctIdx;
          const streak = state.streaks[p.deviceId] ?? 0;
          const streakBonus = getStreakBonus(streak);
          const isFirstGuesser = state.firstGuesser === p.deviceId;
          const speedBonus = isCorrect && isFirstGuesser ? SPEED_BONUS : 0;
          const basePoints = isCorrect ? 100 : 0;

          const parts: string[] = [];
          if (isCorrect) {
            parts.push(`+${basePoints}`);
            if (speedBonus > 0) parts.push(`+${speedBonus} ⚡`);
            if (streakBonus > 0) parts.push(`+${streakBonus} 🔥x${streak}`);
          } else {
            parts.push("0");
          }

          return (
            <div
              key={p.deviceId}
              className={`score-change ${isCorrect ? "got-correct" : "got-wrong"}`}
            >
              <img
                className="score-change-avatar"
                src={p.profilePic}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span>
                {p.nickname}: {parts.join(" ")}
              </span>
            </div>
          );
        })}

        {/* Host score change */}
        {(() => {
          const hostPtsPerCorrect = getHostPointsPerCorrect(
            state.players.length,
          );
          const correctCount = guessers.filter(
            (p) => state.playerGuesses[p.deviceId] === correctIdx,
          ).length;
          const hostPoints = hostPtsPerCorrect * correctCount;

          if (hostPoints <= 0) return null;
          return (
            <div className="score-change got-correct">
              <img
                className="score-change-avatar"
                src={host.profilePic}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span>
                {host.nickname} ({t("host")}): +{hostPoints}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Mini leaderboard */}
      <div className="mini-leaderboard">
        {top3.map((p) => (
          <div key={p.deviceId} className="mini-lb-entry">
            <span className="mini-lb-rank">#{p.rank}</span>
            <img
              className="mini-lb-avatar"
              src={p.profilePic}
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span>{p.nickname}</span>
            <span className="mini-lb-score">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
