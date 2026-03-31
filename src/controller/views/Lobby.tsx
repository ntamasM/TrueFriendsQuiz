import { useEffect, useState, useCallback } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import {
  useControllerState,
  useControllerDispatch,
} from "../ControllerContext";

interface LobbyProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function Lobby({ ac }: LobbyProps) {
  const state = useControllerState();
  const dispatch = useControllerDispatch();
  const [uiText, setUiText] = useState<UiText | null>(null);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  useEffect(() => {
    function refresh() {
      const a = ac.current;
      if (!a) return;
      setPlayerCount(a.getControllerDeviceIds().length);

      const masterId = a.getMasterControllerDeviceId();
      const isMaster = a.getDeviceId() === masterId;
      if (isMaster !== state.isMaster) {
        dispatch({ type: "SET_MASTER", isMaster });
      }
    }
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [ac, state.isMaster, dispatch]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const handleStart = useCallback(() => {
    ac.current?.message(AirConsole.SCREEN, {
      action: "start_game",
      roundsPerPlayer: state.roundsPerPlayer,
      answerTime: state.answerTime,
      votingEnabled: state.votingEnabled,
      speedBonusEnabled: state.speedBonusEnabled,
    });
  }, [ac, state.roundsPerPlayer, state.answerTime, state.votingEnabled, state.speedBonusEnabled]);

  const handleSettings = useCallback(() => {
    dispatch({ type: "SET_VIEW", view: "settings" });
  }, [dispatch]);

  return (
    <div className="view active" id="view-lobby">
      <div className="lobby-welcome" id="lobby-welcome">
        {t("welcome")},
      </div>
      <div className="lobby-nickname" id="lobby-nickname">
        {state.nickname}
      </div>
      <div className="lobby-waiting" id="lobby-waiting">
        {t("waitingToStart")}
      </div>

      {state.isMaster && (
        <>
          <button
            className="ctrl-btn ctrl-start-btn"
            disabled={playerCount < 3}
            onPointerDown={handleStart}
          >
            {t("startGame")}
          </button>
          <button
            className="ctrl-btn ctrl-settings-btn"
            onPointerDown={handleSettings}
          >
            ⚙️ {t("settings")}
          </button>
        </>
      )}
    </div>
  );
}
