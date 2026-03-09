import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText, loadLanguage } from "../../shared/i18n";
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  QUESTION_CATEGORIES,
  type LanguageCode,
} from "../../shared/constants";
import {
  useControllerState,
  useControllerDispatch,
} from "../ControllerContext";

interface SettingsProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function Settings({ ac }: SettingsProps) {
  const state = useControllerState();
  const dispatch = useControllerDispatch();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [catWarning, setCatWarning] = useState(false);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handleBack = useCallback(() => {
    dispatch({ type: "SET_VIEW", view: "lobby" });
  }, [dispatch]);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lang = e.target.value;
      if (lang === state.language) return;
      loadLanguage(lang as LanguageCode).then(() => {
        dispatch({ type: "SET_LANGUAGE", language: lang });
        ac.current?.message(AirConsole.SCREEN, {
          action: "select_language",
          language: lang,
        });
      });
    },
    [ac, state.language, dispatch],
  );

  const handleRoundsMinus = useCallback(() => {
    if (state.roundsPerPlayer > 1) {
      dispatch({
        type: "SET_ROUNDS_PER_PLAYER",
        value: state.roundsPerPlayer - 1,
      });
    }
  }, [state.roundsPerPlayer, dispatch]);

  const handleRoundsPlus = useCallback(() => {
    if (state.roundsPerPlayer < 5) {
      dispatch({
        type: "SET_ROUNDS_PER_PLAYER",
        value: state.roundsPerPlayer + 1,
      });
    }
  }, [state.roundsPerPlayer, dispatch]);

  const handleTimeMinus = useCallback(() => {
    if (state.answerTime > 10) {
      dispatch({ type: "SET_ANSWER_TIME", value: state.answerTime - 5 });
    }
  }, [state.answerTime, dispatch]);

  const handleTimePlus = useCallback(() => {
    if (state.answerTime < 60) {
      dispatch({ type: "SET_ANSWER_TIME", value: state.answerTime + 5 });
    }
  }, [state.answerTime, dispatch]);

  const handleMusicToggle = useCallback(() => {
    dispatch({ type: "TOGGLE_MUSIC" });
    ac.current?.message(AirConsole.SCREEN, {
      action: "toggle_music",
      enabled: !state.musicEnabled,
    });
  }, [ac, state.musicEnabled, dispatch]);

  const handleCategoryToggle = useCallback(
    (key: string) => {
      setCatWarning(false);
      const enabledCount =
        QUESTION_CATEGORIES.length - state.disabledCategories.length;
      const isCurrentlyEnabled = !state.disabledCategories.includes(key);

      if (isCurrentlyEnabled && enabledCount <= 1) {
        setCatWarning(true);
        return;
      }

      dispatch({
        type: "TOGGLE_CATEGORY",
        key,
        totalCategories: QUESTION_CATEGORIES.length,
      });
    },
    [state.disabledCategories, dispatch],
  );

  const catNames = uiText?.categories ?? {};

  return (
    <div className="view active" id="view-settings">
      <div className="settings-title">⚙️ {t("settings")}</div>

      {/* Language */}
      <div className="settings-row">
        <label className="settings-label">{t("selectLanguage")}</label>
        <select
          className="settings-lang-select"
          value={state.language}
          onChange={handleLanguageChange}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_NAMES[lang]}
            </option>
          ))}
        </select>
      </div>

      {/* Rounds per player */}
      <div className="settings-row">
        <label className="settings-label">{t("roundsPerPlayer")}</label>
        <div className="stepper">
          <button className="stepper-btn" onPointerDown={handleRoundsMinus}>
            −
          </button>
          <span className="stepper-value">{state.roundsPerPlayer}</span>
          <button className="stepper-btn" onPointerDown={handleRoundsPlus}>
            +
          </button>
        </div>
      </div>

      {/* Answer time */}
      <div className="settings-row">
        <label className="settings-label">{t("answerTime")}</label>
        <div className="stepper">
          <button className="stepper-btn" onPointerDown={handleTimeMinus}>
            −
          </button>
          <span className="stepper-value">{state.answerTime}s</span>
          <button className="stepper-btn" onPointerDown={handleTimePlus}>
            +
          </button>
        </div>
      </div>

      {/* Music */}
      <div className="settings-row">
        <label className="settings-label">{t("music")}</label>
        <button
          className={`music-toggle-btn ${state.musicEnabled ? "on" : "off"}`}
          onPointerDown={handleMusicToggle}
        >
          {state.musicEnabled ? `🔊 ${t("musicOn")}` : `🔇 ${t("musicOff")}`}
        </button>
      </div>

      {/* Category toggles */}
      <div className="settings-row">
        <label className="settings-label">{t("categorySettings")}</label>
      </div>
      <div className="category-toggles">
        {QUESTION_CATEGORIES.map((cat) => {
          const isEnabled = !state.disabledCategories.includes(cat.key);
          const displayName = catNames[cat.key] ?? cat.key;
          return (
            <button
              key={cat.key}
              className={`cat-toggle-btn ${isEnabled ? "on" : "off"}`}
              onPointerDown={() => handleCategoryToggle(cat.key)}
            >
              {isEnabled ? "✅ " : "❌ "}
              {displayName}
              {cat.hero ? " 👑" : ""}
            </button>
          );
        })}
      </div>
      {catWarning && (
        <div className="cat-warning">{t("allCategoriesDisabled")}</div>
      )}

      {/* Back */}
      <button className="ctrl-btn settings-back-btn" onPointerDown={handleBack}>
        ← {t("back")}
      </button>
    </div>
  );
}
