import { useEffect, useState } from "react";
import type { UiText } from "../../shared/types";
import { loadUiText } from "../../shared/i18n";
import type { LanguageCode } from "../../shared/constants";
import { LANGUAGE_NAMES } from "../../shared/constants";
import { useScreenState } from "../ScreenContext";

interface LobbyProps {
  ac: React.RefObject<AirConsole | null>;
}

export default function Lobby({ ac }: LobbyProps) {
  const state = useScreenState();
  const [players, setPlayers] = useState<
    { deviceId: number; nickname: string; profilePic: string }[]
  >([]);
  const [uiText, setUiText] = useState<UiText | null>(null);

  // Load UI text when language changes
  useEffect(() => {
    loadUiText(state.language as LanguageCode).then(setUiText);
  }, [state.language]);

  // Refresh player list periodically and on mount
  useEffect(() => {
    function refresh() {
      const a = ac.current;
      if (!a) return;
      const ids = a.getControllerDeviceIds();
      setPlayers(
        ids.map((id) => ({
          deviceId: id,
          nickname: a.getNickname(id) || `Player ${id}`,
          profilePic: a.getProfilePicture(id, 64) || "",
        })),
      );
    }

    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [ac]);

  const t = (key: keyof UiText) => (uiText ? (uiText[key] as string) : key);

  const masterDeviceId = ac.current?.getMasterControllerDeviceId();
  const masterName = masterDeviceId
    ? ac.current?.getNickname(masterDeviceId) || "Player"
    : "...";

  return (
    <div className="phase active" id="lobby">
      <img
        src="/Assets/Logo/Logo.svg"
        alt="True Friends Quiz"
        className="game-logo"
      />
      <div className="game-title">True Friends Quiz</div>

      <div className="player-list-container">
        <div className="player-list-title">{t("players")}</div>
        <div className="player-list">
          {players.map((p) => (
            <div key={p.deviceId} className="player-card">
              {p.profilePic && (
                <img
                  className="player-avatar"
                  src={p.profilePic}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className="player-name">{p.nickname}</span>
            </div>
          ))}
        </div>
        <div className="player-count-info">
          {players.length} {t("players")}
          {players.length < 3 ? ` — ${t("minPlayers")}` : ""}
        </div>
      </div>

      <div className="lobby-info">
        <div className="lobby-info-waiting">
          {t("waitingForMasterToStart").replace("{name}", masterName)}
        </div>
        <div className="lobby-info-lang">
          {t("currentLanguage")}:{" "}
          {LANGUAGE_NAMES[state.language as LanguageCode]}
        </div>
      </div>
    </div>
  );
}
