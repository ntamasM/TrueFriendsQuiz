import { useEffect, useRef } from "react";
import type { ScreenToControllerMessage } from "../shared/types";
import { loadLanguage } from "../shared/i18n";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../shared/constants";
import { useControllerState, useControllerDispatch } from "./ControllerContext";

export function useControllerAirConsole() {
  const state = useControllerState();
  const dispatch = useControllerDispatch();
  const stateRef = useRef(state);
  stateRef.current = state;

  const acRef = useRef<AirConsole | null>(null);

  useEffect(() => {
    const ac = new AirConsole();
    acRef.current = ac;

    const updatePlayerIndex = () => {
      const myId = ac.getDeviceId();
      const ids = ac.getControllerDeviceIds();
      const idx = ids.indexOf(myId);
      dispatch({ type: "SET_PLAYER_INDEX", playerIndex: idx === -1 ? 0 : idx });
    };

    ac.onReady = () => {
      const deviceId = ac.getDeviceId();
      const nickname = ac.getNickname(deviceId) || "Player";
      dispatch({ type: "SET_DEVICE_INFO", deviceId, nickname });

      const masterId = ac.getMasterControllerDeviceId();
      dispatch({ type: "SET_MASTER", isMaster: deviceId === masterId });
      updatePlayerIndex();

      // Auto-detect language
      const browserLang = (navigator.language || "en")
        .substring(0, 2)
        .toLowerCase();
      if (
        SUPPORTED_LANGUAGES.includes(browserLang as LanguageCode) &&
        browserLang !== stateRef.current.language
      ) {
        loadLanguage(browserLang as LanguageCode).then(() => {
          dispatch({ type: "SET_LANGUAGE", language: browserLang });
        });
      }
    };

    ac.onConnect = () => {
      const masterId = ac.getMasterControllerDeviceId();
      dispatch({
        type: "SET_MASTER",
        isMaster: ac.getDeviceId() === masterId,
      });
      updatePlayerIndex();
    };

    ac.onDisconnect = () => {
      const masterId = ac.getMasterControllerDeviceId();
      dispatch({
        type: "SET_MASTER",
        isMaster: ac.getDeviceId() === masterId,
      });
      updatePlayerIndex();
    };

    ac.onAdShow = () => dispatch({ type: "SET_PAUSED", paused: true });
    ac.onAdComplete = () => dispatch({ type: "SET_PAUSED", paused: false });
    ac.onPause = () => dispatch({ type: "SET_PAUSED", paused: true });
    ac.onResume = () => dispatch({ type: "SET_PAUSED", paused: false });

    ac.onMessage = (_from: number, raw: unknown) => {
      const data = raw as ScreenToControllerMessage;
      if (!data || !("action" in data)) return;

      const process = () => {
        switch (data.action) {
          case "game_phase":
            switch (data.phase) {
              case "lobby":
                dispatch({ type: "SET_VIEW", view: "lobby" });
                break;
              case "waiting":
                dispatch({
                  type: "SET_WAITING",
                  message: data.message ?? "",
                  waitingKey: data.waitingKey,
                  hostNickname: data.hostNickname,
                });
                break;
              case "host_waiting":
                dispatch({ type: "SET_VIEW", view: "host-wait" });
                break;
              case "leaderboard":
                dispatch({
                  type: "SET_LEADERBOARD",
                  rank: data.rank!,
                  totalPlayers: data.totalPlayers!,
                  score: data.score!,
                  correctGuesses: data.correctGuesses!,
                  totalRounds: data.totalRounds!,
                  bestStreak: data.bestStreak ?? 0,
                  speedBonuses: data.speedBonuses ?? 0,
                  timesHost: data.timesHost ?? 0,
                });
                break;
            }
            break;

          case "pick_category":
            dispatch({
              type: "SET_CATEGORY_VOTE",
              isPremium: data.isPremium,
              hostNickname: data.hostNickname,
            });
            break;

          case "pick_category_result":
            dispatch({
              type: "SET_CATEGORY_VOTE_RESULT",
              isPremium: data.isPremium,
              votes: data.votes,
            });
            break;

          case "pick_question":
            dispatch({
              type: "SET_PICK_QUESTIONS",
              questions: data.questions,
            });
            break;

          case "answer_question":
            dispatch({
              type: "SET_ANSWER_QUESTION",
              question: data.question,
              answers: data.answers,
            });
            break;

          case "guess_question":
            dispatch({
              type: "SET_GUESS_QUESTION",
              question: data.question,
              answers: data.answers,
              hostNickname: data.hostNickname,
              timeLeft: data.timeLeft,
            });
            break;

          case "guess_confirmed":
            dispatch({ type: "SET_HAS_GUESSED" });
            break;

          case "show_result":
            dispatch({
              type: "SET_RESULT",
              isHost: !!data.isHost,
              correct: data.correct,
              correctAnswer: data.correctAnswer,
              points: data.points,
              totalScore: data.totalScore,
              streak: data.streak,
              streakBonus: data.streakBonus,
              speedBonus: data.speedBonus,
            });
            break;

          case "timer_update":
            dispatch({
              type: "UPDATE_TIMER",
              timeLeft: data.timeLeft,
            });
            break;

          case "game_paused":
            dispatch({ type: "SET_PAUSED", paused: true });
            break;

          case "game_resumed":
            dispatch({ type: "SET_PAUSED", paused: false });
            break;

        }
      };

      process();
    };

    return () => {
      // AirConsole doesn't have a destroy method
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return acRef;
}
