import { useEffect, useState, useCallback } from "react";
import type { UiText, CategoryVoteOption } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { useControllerState } from "../ControllerContext";

interface CategoryVoteProps {
  ac: React.RefObject<AirConsole | null>;
}

const ICONS: Record<CategoryVoteOption, string> = {
  fun: "😂",
  deep: "💭",
  dilemma: "🤔",
  spicy: "🔥",
};

const options: CategoryVoteOption[] = ["fun", "deep", "dilemma", "spicy"];

export default function CategoryVote({ ac }: CategoryVoteProps) {
  const state = useControllerState();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Reset local UI when entering a new category vote round
  useEffect(() => {
    setHasVoted(false);
    setLockoutRemaining(
      state.categoryVoteIsHost
        ? Math.ceil(state.categoryVoteLockoutMs / 1000)
        : 0,
    );
  }, [state.categoryVoteIsHost, state.categoryVoteLockoutMs]);

  // Tick host countdown every second
  useEffect(() => {
    if (!state.categoryVoteIsHost) return;
    if (lockoutRemaining <= 0) return;
    const id = window.setTimeout(() => {
      setLockoutRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [state.categoryVoteIsHost, lockoutRemaining]);

  const handleVote = useCallback(
    (category: CategoryVoteOption) => {
      if (category === "spicy" && !state.isPremium) return;
      if (hasVoted) return;
      setHasVoted(true);
      ac.current?.message(AirConsole.SCREEN, {
        action: "category_vote",
        category,
      });
    },
    [ac, state.isPremium, hasVoted],
  );

  const handleSelect = useCallback(
    (category: CategoryVoteOption) => {
      if (category === "spicy" && !state.isPremium) return;
      if (lockoutRemaining > 0) return;
      ac.current?.message(AirConsole.SCREEN, {
        action: "category_selected",
        category,
      });
    },
    [ac, state.isPremium, lockoutRemaining],
  );

  const cv = uiText?.categoryVote;
  const isHost = state.categoryVoteIsHost;
  const tally = state.categoryVoteResults ?? {};
  const locked = isHost && lockoutRemaining > 0;

  return (
    <div className="view active" id="view-category-vote">
      <div className="category-vote-title">
        {isHost
          ? cv?.title ?? "Choose a Category"
          : (cv?.voteTitle ?? "Vote a category for {name}").replace(
              "{name}",
              state.categoryVoteHostNickname,
            )}
      </div>
      {isHost && (
        <div className="category-vote-subtitle">
          {locked
            ? (cv?.pickIn ?? "Pick in {n}s…").replace("{n}", String(lockoutRemaining))
            : cv?.subtitle ?? "Players voted — pick the final category!"}
        </div>
      )}
      <div className="category-vote-options">
        {options.map((key) => {
          const premLocked = key === "spicy" && !state.isPremium;
          const votes = tally[key] ?? 0;
          const disabled = premLocked || locked || (!isHost && hasVoted);

          return (
            <div
              key={key}
              className={`category-vote-btn${premLocked ? " locked" : ""}`}
              style={{
                opacity: disabled && !premLocked ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
              }}
              onPointerDown={() =>
                isHost ? handleSelect(key) : handleVote(key)
              }
            >
              <span className="cat-icon">
                {premLocked ? "🔒" : ICONS[key]}
              </span>
              {cv?.[key] ?? key}
              {isHost && votes > 0 && (
                <span className="cat-vote-count">
                  {votes} {votes === 1 ? (cv?.vote ?? "vote") : (cv?.votes ?? "votes")}
                </span>
              )}
              {premLocked && (
                <span className="cat-hero-badge">AirConsole Hero</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
