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

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const handleSelect = useCallback(
    (category: CategoryVoteOption) => {
      if (category === "spicy" && !state.isPremium) return;
      ac.current?.message(AirConsole.SCREEN, {
        action: "category_selected",
        category,
      });
    },
    [ac, state.isPremium],
  );

  const cv = uiText?.categoryVote;

  return (
    <div className="view active" id="view-category-vote">
      <div className="category-vote-title">
        {cv?.title ?? "Choose a Category"}
      </div>
      <div className="category-vote-options">
        {options.map((key) => {
          const locked = key === "spicy" && !state.isPremium;
          return (
            <div
              key={key}
              className={`category-vote-btn${locked ? " locked" : ""}`}
              onPointerDown={() => handleSelect(key)}
            >
              <span className="cat-icon">
                {locked ? "🔒" : ICONS[key]}
              </span>
              {cv?.[key] ?? key}
              {locked && (
                <span className="cat-hero-badge">AirConsole Hero</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
