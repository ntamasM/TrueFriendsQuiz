import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText, loadLanguage } from "../../shared/i18n";
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
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

  const handleVotingToggle = useCallback(() => {
    dispatch({ type: "TOGGLE_VOTING" });
  }, [dispatch]);

  const handleSpeedBonusToggle = useCallback(() => {
    dispatch({ type: "TOGGLE_SPEED_BONUS" });
  }, [dispatch]);

  return (
    <div className="view active" id="view-settings">
      <div className="settings-title">⚙️ {t("settings")}</div>

      {/* Language */}
      <div className="settings-section">
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

      {/* Settings group */}
      <div className="settings-group">
        {/* Rounds */}
        <div className="settings-row">
          <span className="settings-row-label">{t("roundsPerPlayer")}</span>
          <div className="settings-row-input">
            <button className="rounds-btn" onPointerDown={handleRoundsMinus}>
              −
            </button>
            <span className="rounds-value">{state.roundsPerPlayer}</span>
            <button className="rounds-btn" onPointerDown={handleRoundsPlus}>
              +
            </button>
          </div>
        </div>

        {/* Answer Time */}
        <div className="settings-row">
          <span className="settings-row-label">{t("answerTime")}</span>
          <div className="settings-row-input">
            <button className="rounds-btn" onPointerDown={handleTimeMinus}>
              −
            </button>
            <span className="rounds-value">{state.answerTime}s</span>
            <button className="rounds-btn" onPointerDown={handleTimePlus}>
              +
            </button>
          </div>
        </div>

        {/* Music */}
        <div className="settings-row">
          <span className="settings-row-label">{t("music")}</span>
          <button
            className={`settings-toggle ${state.musicEnabled ? "on" : "off"}`}
            onPointerDown={handleMusicToggle}
          >
            {state.musicEnabled ? t("musicOn") : t("musicOff")}
          </button>
        </div>

        {/* Voting */}
        <div className="settings-row">
          <span className="settings-row-label">{t("voting")}</span>
          <button
            className={`settings-toggle ${state.votingEnabled ? "on" : "off"}`}
            onPointerDown={handleVotingToggle}
          >
            {state.votingEnabled ? t("musicOn") : t("musicOff")}
          </button>
        </div>

        {/* Speed Bonus */}
        <div className="settings-row">
          <span className="settings-row-label">{t("speedBonusSetting")}</span>
          <button
            className={`settings-toggle ${state.speedBonusEnabled ? "on" : "off"}`}
            onPointerDown={handleSpeedBonusToggle}
          >
            {state.speedBonusEnabled ? t("musicOn") : t("musicOff")}
          </button>
        </div>
      </div>

      {/* Back */}
      <button className="ctrl-settings-back-btn" onPointerDown={handleBack}>
        ← {t("back")}
      </button>
    </div>
  );
}
