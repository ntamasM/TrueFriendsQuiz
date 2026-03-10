import { useEffect, useRef, useCallback } from "react";
import type {
  Player,
  Question,
  ControllerToScreenMessage,
} from "../shared/types";
import { loadLanguage, loadQuestions } from "../shared/i18n";
import { SUPPORTED_LANGUAGES } from "../shared/constants";
import type { LanguageCode } from "../shared/constants";
import {
  useScreenState,
  useScreenDispatch,
  type ScreenState,
} from "./ScreenContext";
import {
  shuffleArray,
  replaceNamePlaceholder,
  getRandomQuestions,
  getStreakBonus,
  getHostPointsPerCorrect,
} from "./gameLogic";
import { musicManager } from "./musicManager";

/** Returns the host for a given round. */
function getHost(state: ScreenState): Player {
  return state.players[state.currentRound % state.players.length]!;
}

/** Returns all non-host players for a given round. */
function getGuessers(state: ScreenState): Player[] {
  const hostIdx = state.currentRound % state.players.length;
  return state.players.filter((_, i) => i !== hostIdx);
}

export function useScreenAirConsole() {
  const state = useScreenState();
  const dispatch = useScreenDispatch();

  // Refs to keep latest state available in callbacks without re-registering
  const stateRef = useRef(state);
  stateRef.current = state;

  const acRef = useRef<AirConsole | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lobbyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionsRef = useRef<Question[]>([]);

  // ─── Helpers ───

  const clearGuessTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const broadcastPhase = useCallback(
    (phase: string, extra?: Record<string, unknown>) => {
      acRef.current?.broadcast({
        action: "game_phase",
        phase,
        language: stateRef.current.language,
        ...extra,
      });
    },
    [],
  );

  // ─── Round flow functions ───

  const startRound = useCallback(() => {
    const s = stateRef.current;
    dispatch({ type: "START_ROUND" });

    const host = getHost(s);

    // Pick 4 random questions for the host to choose
    const { questions, updatedUsedIds } = getRandomQuestions(
      questionsRef.current,
      s.usedQuestionIds,
      s.disabledCategories,
      isAnyPlayerPremium(),
      4,
    );

    // If usedIds were reset, we need to update our ref copy
    if (updatedUsedIds !== s.usedQuestionIds) {
      // We'll reset via SELECT_QUESTION which appends the chosen one
    }

    const questionsForHost = questions.map((q) => ({
      id: q.id,
      category: q.category,
      question: replaceNamePlaceholder(q.question, host.nickname),
      answers: q.answers,
    }));

    // Send question options to host
    acRef.current?.message(host.deviceId, {
      action: "pick_question",
      questions: questionsForHost,
      language: s.language,
    });

    // Vibrate host's phone
    acRef.current?.message(host.deviceId, { action: "vibrate", duration: 200 });

    // Other players wait
    const guessers = getGuessers(s);
    for (const p of guessers) {
      acRef.current?.message(p.deviceId, {
        action: "game_phase",
        phase: "waiting",
        message: host.nickname + " is choosing...",
        language: s.language,
      });
    }
  }, [dispatch]);

  const showReveal = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "reveal") return; // prevent double call

    clearGuessTimer();

    const host = getHost(s);
    const correctIdx = s.hostAnswer!;
    const question = s.currentQuestion!;
    const guessers = getGuessers(s);
    const numPlayers = s.players.length;
    const hostPointsPerCorrect = getHostPointsPerCorrect(numPlayers);

    let hostPoints = 0;
    const scoreUpdates: {
      deviceId: number;
      scoreDelta: number;
      correctGuesses: number;
      streak: number;
    }[] = [];

    for (const p of guessers) {
      const guess = s.playerGuesses[p.deviceId];
      const isCorrect = guess === correctIdx;

      const currentStreak = s.streaks[p.deviceId] ?? 0;
      const newStreak = isCorrect ? currentStreak + 1 : 0;
      const streakBonus = getStreakBonus(newStreak);
      const basePoints = isCorrect ? 100 : 0;
      const totalPoints = basePoints + streakBonus;

      if (isCorrect) {
        hostPoints += hostPointsPerCorrect;
      }

      scoreUpdates.push({
        deviceId: p.deviceId,
        scoreDelta: totalPoints,
        correctGuesses: p.correctGuesses + (isCorrect ? 1 : 0),
        streak: newStreak,
      });

      // Send individual result to each guesser
      acRef.current?.message(p.deviceId, {
        action: "show_result",
        correct: isCorrect,
        correctAnswer: question.answers[correctIdx]!,
        points: totalPoints,
        totalScore: p.score + totalPoints,
        streak: newStreak,
        streakBonus,
        language: s.language,
      });
    }

    // Host score update
    scoreUpdates.push({
      deviceId: host.deviceId,
      scoreDelta: hostPoints,
      correctGuesses: host.correctGuesses,
      streak: s.streaks[host.deviceId] ?? 0,
    });

    acRef.current?.message(host.deviceId, {
      action: "show_result",
      correct: null,
      correctAnswer: question.answers[correctIdx]!,
      points: hostPoints,
      totalScore: host.score + hostPoints,
      isHost: true,
      language: s.language,
    });

    dispatch({ type: "SHOW_REVEAL", scoreUpdates });

    // After 5s, advance
    setTimeout(() => {
      dispatch({ type: "ADVANCE_ROUND" });

      const nextRound = s.currentRound + 1;
      if (nextRound >= s.totalRounds) {
        tryShowAd();
        setTimeout(() => {
          dispatch({ type: "SHOW_LEADERBOARD" });
          sendLeaderboard();
          acRef.current?.setActivePlayers(0);
        }, 500);
      } else {
        if (s.roundsSinceLastAd + 1 >= 3) {
          tryShowAd();
        }
        setTimeout(() => startRound(), 300);
      }
    }, 5000);
  }, [dispatch, clearGuessTimer, startRound]);

  const startGuessTimer = useCallback(() => {
    clearGuessTimer();
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      dispatch({ type: "TICK_TIMER" });

      acRef.current?.broadcast({
        action: "timer_update",
        timeLeft: s.guessTimeLeft - 1,
      });

      if (s.guessTimeLeft - 1 <= 0) {
        clearGuessTimer();
        showReveal();
      }
    }, 1000);
  }, [dispatch, clearGuessTimer, showReveal]);

  function isAnyPlayerPremium(): boolean {
    try {
      const ac = acRef.current;
      if (!ac) return false;
      const ids = ac.getControllerDeviceIds();
      for (const id of ids) {
        if (ac.isPremium(id)) return true;
      }
      if (ac.isPremium(0)) return true;
    } catch {
      // premium check not available
    }
    return false;
  }

  function tryShowAd() {
    acRef.current?.showAd();
  }

  function sendLeaderboard() {
    const s = stateRef.current;
    const sorted = s.players.slice().sort((a, b) => b.score - a.score);
    const ranks: number[] = [];
    sorted.forEach((p, idx) => {
      if (idx === 0) ranks.push(1);
      else if (p.score === sorted[idx - 1]!.score) ranks.push(ranks[idx - 1]!);
      else ranks.push(idx + 1);
    });

    sorted.forEach((player, idx) => {
      acRef.current?.message(player.deviceId, {
        action: "game_phase",
        phase: "leaderboard",
        rank: ranks[idx]!,
        totalPlayers: sorted.length,
        score: player.score,
        correctGuesses: player.correctGuesses,
        totalRounds: s.totalRounds - 1,
        language: s.language,
      });

      // Vibrate the winner's phone
      if (ranks[idx] === 1) {
        acRef.current?.message(player.deviceId, {
          action: "vibrate",
          duration: 500,
        });
      }
    });
  }

  // ─── Init AirConsole ───

  useEffect(() => {
    const ac = new AirConsole();
    acRef.current = ac;

    ac.onReady = () => {
      // auto-detect language
      const browserLang = (navigator.language || "en")
        .substring(0, 2)
        .toLowerCase();
      if (
        SUPPORTED_LANGUAGES.includes(browserLang as LanguageCode) &&
        browserLang !== stateRef.current.language
      ) {
        loadLanguage(browserLang as LanguageCode).then(() => {
          dispatch({ type: "SET_LANGUAGE", language: browserLang });
          ac.broadcast({ action: "language_changed", language: browserLang });
        });
      }
    };

    ac.onConnect = (deviceId: number) => {
      const s = stateRef.current;
      if (s.phase === "lobby") {
        debouncedLobbyUpdate();
      } else {
        ac.message(deviceId, {
          action: "game_phase",
          phase: "waiting",
          message: "A game is in progress. Please wait.",
          language: s.language,
        });
      }
    };

    ac.onDisconnect = (deviceId: number) => {
      const s = stateRef.current;
      if (s.phase === "lobby") {
        debouncedLobbyUpdate();
        return;
      }

      const playerIndex = s.players.findIndex((p) => p.deviceId === deviceId);
      if (playerIndex === -1) return;

      const wasHost = getHost(s).deviceId === deviceId;

      dispatch({ type: "REMOVE_PLAYER", deviceId });

      if (s.players.length - 1 < 2) {
        clearGuessTimer();
        dispatch({ type: "RESET_GAME" });
        broadcastPhase("lobby", {
          message: "Not enough players. Returning to lobby.",
        });
        return;
      }

      const newPlayerCount = s.players.length - 1;
      dispatch({
        type: "SET_TOTAL_ROUNDS",
        totalRounds: newPlayerCount * s.roundsPerPlayer,
      });

      if (s.currentRound >= newPlayerCount * s.roundsPerPlayer) {
        clearGuessTimer();
        dispatch({ type: "SHOW_LEADERBOARD" });
        // sendLeaderboard will be called by component effect
        return;
      }

      if (wasHost) {
        clearGuessTimer();
        broadcastPhase("waiting", {
          message: "Host left. Moving to next round...",
        });
        setTimeout(() => startRound(), 2000);
        return;
      }

      // In guessing phase, check if all remaining guessers answered
      if (s.phase === "guessing") {
        const remainingGuessers = getGuessers({
          ...s,
          players: s.players.filter((p) => p.deviceId !== deviceId),
        });
        const allAnswered = remainingGuessers.every(
          (p) => s.playerGuesses[p.deviceId] !== undefined,
        );
        if (allAnswered) {
          clearGuessTimer();
          setTimeout(() => showReveal(), 500);
        }
      }
    };

    ac.onAdShow = () => {
      dispatch({ type: "PAUSE" });
      clearGuessTimer();
      musicManager.pause();
      ac.broadcast({ action: "game_paused" });
    };

    ac.onAdComplete = () => {
      dispatch({ type: "RESUME" });
      const s = stateRef.current;
      if (s.phase === "guessing" && s.guessTimeLeft > 0) {
        startGuessTimer();
      }
      musicManager.resume();
      ac.broadcast({ action: "game_resumed" });
    };

    ac.onPause = () => {
      dispatch({ type: "PAUSE" });
      clearGuessTimer();
      musicManager.pause();
    };

    ac.onResume = () => {
      dispatch({ type: "RESUME" });
      const s = stateRef.current;
      if (s.phase === "guessing" && s.guessTimeLeft > 0) {
        startGuessTimer();
      }
      musicManager.resume();
    };

    ac.onMessage = (from: number, raw: unknown) => {
      const data = raw as ControllerToScreenMessage;
      if (!data || !("action" in data)) return;
      const s = stateRef.current;

      switch (data.action) {
        case "start_game": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          if (s.phase !== "lobby") break;

          const ids = ac.getControllerDeviceIds();
          if (ids.length < 3) break;

          const roundsPerPlayer = Math.max(
            1,
            Math.min(5, data.roundsPerPlayer),
          );
          const answerTime = Math.max(10, Math.min(60, data.answerTime));
          const disabledCats = Array.isArray(data.disabledCategories)
            ? data.disabledCategories
            : [];

          // Build player list
          ac.setActivePlayers(ids.length);
          const players: Player[] = [];
          for (let i = 0; i < ids.length; i++) {
            const deviceId = ac.convertPlayerNumberToDeviceId(i);
            players.push({
              deviceId,
              playerNumber: i,
              nickname: ac.getNickname(deviceId) || `Player ${i + 1}`,
              profilePic: ac.getProfilePicture(deviceId, 64) || "",
              score: 0,
              correctGuesses: 0,
            });
          }

          const shuffled = shuffleArray(players);

          // Load questions then start
          loadQuestions(s.language as LanguageCode).then((qs) => {
            questionsRef.current = qs;
            dispatch({
              type: "START_GAME",
              players: shuffled,
              roundsPerPlayer,
              guessTime: answerTime,
              disabledCategories: disabledCats,
            });
            musicManager.play();
            // startRound is triggered by the phase change → effect
          });
          break;
        }

        case "select_language": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          if (!SUPPORTED_LANGUAGES.includes(data.language as LanguageCode))
            break;
          loadLanguage(data.language as LanguageCode).then(() => {
            dispatch({
              type: "SET_LANGUAGE",
              language: data.language,
            });
            ac.broadcast({
              action: "language_changed",
              language: data.language,
            });
          });
          break;
        }

        case "question_selected": {
          if (s.phase !== "picking") break;
          const host = getHost(s);
          if (from !== host.deviceId) break;

          const question = questionsRef.current.find(
            (q) => q.id === data.questionId,
          );
          if (!question) break;

          dispatch({ type: "SELECT_QUESTION", question });

          const displayQ = replaceNamePlaceholder(
            question.question,
            host.nickname,
          );

          // Send to host to answer
          ac.message(host.deviceId, {
            action: "answer_question",
            question: displayQ,
            answers: question.answers,
            language: s.language,
          });

          // Others wait
          for (const p of getGuessers(s)) {
            ac.message(p.deviceId, {
              action: "game_phase",
              phase: "waiting",
              message: `${host.nickname} is answering...`,
              language: s.language,
            });
          }
          break;
        }

        case "host_answer": {
          if (s.phase !== "answering") break;
          const host = getHost(s);
          if (from !== host.deviceId) break;

          dispatch({ type: "HOST_ANSWER", answerIndex: data.answerId });

          const question = s.currentQuestion!;
          const displayQ = replaceNamePlaceholder(
            question.question,
            host.nickname,
          );

          // Start guess timer
          startGuessTimer();

          // Tell host to wait
          ac.message(host.deviceId, {
            action: "game_phase",
            phase: "host_waiting",
            message: "Waiting for guesses...",
            language: s.language,
          });

          // Send to guessers
          for (const p of getGuessers(s)) {
            ac.message(p.deviceId, {
              action: "guess_question",
              question: displayQ,
              answers: question.answers,
              hostNickname: host.nickname,
              timeLeft: s.guessTime,
              language: s.language,
            });
          }
          break;
        }

        case "player_guess": {
          if (s.phase !== "guessing") break;
          const host = getHost(s);
          if (from === host.deviceId) break;
          if (!s.players.some((p) => p.deviceId === from)) break;
          if (s.playerGuesses[from] !== undefined) break;

          dispatch({
            type: "PLAYER_GUESS",
            deviceId: from,
            answerIndex: data.answerId,
          });

          ac.message(from, { action: "guess_confirmed" });

          // Check if all guessers answered (using the updated guesses)
          const guessers = getGuessers(s);
          const updatedGuesses = { ...s.playerGuesses, [from]: data.answerId };
          const allAnswered = guessers.every(
            (p) => updatedGuesses[p.deviceId] !== undefined,
          );
          if (allAnswered) {
            clearGuessTimer();
            setTimeout(() => showReveal(), 500);
          }
          break;
        }

        case "play_again": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          dispatch({ type: "RESET_GAME" });
          // Re-start
          const ids2 = ac.getControllerDeviceIds();
          if (ids2.length < 3) break;
          ac.setActivePlayers(ids2.length);
          const players2: Player[] = [];
          for (let i = 0; i < ids2.length; i++) {
            const deviceId = ac.convertPlayerNumberToDeviceId(i);
            players2.push({
              deviceId,
              playerNumber: i,
              nickname: ac.getNickname(deviceId) || `Player ${i + 1}`,
              profilePic: ac.getProfilePicture(deviceId, 64) || "",
              score: 0,
              correctGuesses: 0,
            });
          }
          const shuffled2 = shuffleArray(players2);
          dispatch({
            type: "START_GAME",
            players: shuffled2,
            roundsPerPlayer: s.roundsPerPlayer,
            guessTime: s.guessTime,
            disabledCategories: s.disabledCategories,
          });
          musicManager.play();
          break;
        }

        case "back_to_menu": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          clearGuessTimer();
          musicManager.stop();
          dispatch({ type: "RESET_GAME" });
          broadcastPhase("lobby");
          break;
        }

        case "toggle_music": {
          if (from !== ac.getMasterControllerDeviceId()) break;
          dispatch({ type: "TOGGLE_MUSIC" });
          if (data.enabled) {
            musicManager.play();
          } else {
            musicManager.stop();
          }
          break;
        }
      }
    };

    function debouncedLobbyUpdate() {
      if (lobbyDebounceRef.current) clearTimeout(lobbyDebounceRef.current);
      lobbyDebounceRef.current = setTimeout(() => {
        // Lobby update is handled by React re-rendering via state
        // We just force a re-render by dispatching a no-op or
        // the Lobby component reads from AirConsole directly
      }, 300);
    }

    return () => {
      clearGuessTimer();
      if (lobbyDebounceRef.current) clearTimeout(lobbyDebounceRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When phase becomes "picking" and we're in-game, trigger startRound messaging
  useEffect(() => {
    if (
      state.phase === "picking" &&
      state.players.length > 0 &&
      state.currentQuestion === null
    ) {
      // Send pick_question to host, wait messages to guessers
      const ac = acRef.current;
      if (!ac) return;
      const host = getHost(state);
      const guessers = getGuessers(state);

      const { questions } = getRandomQuestions(
        questionsRef.current,
        state.usedQuestionIds,
        state.disabledCategories,
        isAnyPlayerPremium(),
        4,
      );

      const questionsForHost = questions.map((q) => ({
        id: q.id,
        category: q.category,
        question: replaceNamePlaceholder(q.question, host.nickname),
        answers: q.answers,
      }));

      ac.message(host.deviceId, {
        action: "pick_question",
        questions: questionsForHost,
        language: state.language,
      });

      // Vibrate host's phone
      ac.message(host.deviceId, { action: "vibrate", duration: 200 });

      for (const p of guessers) {
        ac.message(p.deviceId, {
          action: "game_phase",
          phase: "waiting",
          message: `${host.nickname} is choosing...`,
          language: state.language,
        });
      }
    }
  }, [state.phase, state.players.length, state.currentRound]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ac: acRef, state };
}
