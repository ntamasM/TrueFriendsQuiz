import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type {
  Player,
  Question,
  ScreenPhase,
  PickingSubStep,
} from "../shared/types";

// ─── State ───

export interface ScreenState {
  phase: ScreenPhase;
  language: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  roundsPerPlayer: number;
  guessTime: number;
  pickingSubStep: PickingSubStep;
  currentQuestion: Question | null;
  hostAnswer: number | null;
  playerGuesses: Record<number, number>; // deviceId → answerIndex
  usedQuestionIds: number[];
  guessTimeLeft: number;
  isPaused: boolean;
  musicEnabled: boolean;
  disabledCategories: string[];
  streaks: Record<number, number>; // deviceId → consecutive correct count
  firstGuesser: number | null; // deviceId of first player to guess
  bestStreaks: Record<number, number>; // deviceId → best streak achieved
  speedBonusCount: Record<number, number>; // deviceId → times got speed bonus
  roundsSinceLastAd: number;
}

export const initialScreenState: ScreenState = {
  phase: "lobby",
  language: "en",
  players: [],
  currentRound: 0,
  totalRounds: 0,
  roundsPerPlayer: 1,
  guessTime: 20,
  pickingSubStep: "category_vote",
  currentQuestion: null,
  hostAnswer: null,
  playerGuesses: {},
  usedQuestionIds: [],
  guessTimeLeft: 20,
  isPaused: false,
  musicEnabled: true,
  disabledCategories: [],
  streaks: {},
  firstGuesser: null,
  bestStreaks: {},
  speedBonusCount: {},
  roundsSinceLastAd: 0,
};

// ─── Actions ───

export type ScreenAction =
  | { type: "SET_LANGUAGE"; language: string }
  | {
      type: "START_GAME";
      players: Player[];
      roundsPerPlayer: number;
      guessTime: number;
      disabledCategories: string[];
    }
  | { type: "START_ROUND" }
  | { type: "SELECT_QUESTION"; question: Question }
  | { type: "HOST_ANSWER"; answerIndex: number }
  | { type: "PLAYER_GUESS"; deviceId: number; answerIndex: number }
  | { type: "TICK_TIMER" }
  | {
      type: "SHOW_REVEAL";
      scoreUpdates: {
        deviceId: number;
        scoreDelta: number;
        correctGuesses: number;
        streak: number;
        speedBonus?: number;
      }[];
    }
  | { type: "ADVANCE_ROUND" }
  | { type: "SHOW_LEADERBOARD" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "TOGGLE_MUSIC" }
  | { type: "RESET_GAME" }
  | { type: "REMOVE_PLAYER"; deviceId: number }
  | { type: "SET_TOTAL_ROUNDS"; totalRounds: number }
  | { type: "CATEGORY_SELECTED" };

// ─── Reducer ───

export function screenReducer(
  state: ScreenState,
  action: ScreenAction,
): ScreenState {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.language };

    case "START_GAME":
      return {
        ...state,
        phase: "picking",
        pickingSubStep: "category_vote",
        players: action.players,
        roundsPerPlayer: action.roundsPerPlayer,
        guessTime: action.guessTime,
        guessTimeLeft: action.guessTime,
        totalRounds: action.players.length * action.roundsPerPlayer,
        currentRound: 0,
        usedQuestionIds: [],
        disabledCategories: action.disabledCategories,
        streaks: {},
        firstGuesser: null,
        bestStreaks: {},
        speedBonusCount: {},
        roundsSinceLastAd: 0,
        currentQuestion: null,
        hostAnswer: null,
        playerGuesses: {},
      };

    case "START_ROUND":
      return {
        ...state,
        phase: "picking",
        pickingSubStep: "category_vote",
        currentQuestion: null,
        hostAnswer: null,
        playerGuesses: {},
        firstGuesser: null,
      };

    case "CATEGORY_SELECTED":
      return {
        ...state,
        pickingSubStep: "question_pick",
      };

    case "SELECT_QUESTION":
      return {
        ...state,
        phase: "answering",
        currentQuestion: action.question,
        usedQuestionIds: [...state.usedQuestionIds, action.question.id],
      };

    case "HOST_ANSWER":
      return {
        ...state,
        phase: "guessing",
        hostAnswer: action.answerIndex,
        guessTimeLeft: state.guessTime,
        firstGuesser: null,
      };

    case "PLAYER_GUESS":
      if (state.playerGuesses[action.deviceId] !== undefined) return state;
      return {
        ...state,
        playerGuesses: {
          ...state.playerGuesses,
          [action.deviceId]: action.answerIndex,
        },
        firstGuesser:
          state.firstGuesser === null ? action.deviceId : state.firstGuesser,
      };

    case "TICK_TIMER":
      return { ...state, guessTimeLeft: Math.max(0, state.guessTimeLeft - 1) };

    case "SHOW_REVEAL": {
      const updatedPlayers = state.players.map((p) => {
        const update = action.scoreUpdates.find(
          (u) => u.deviceId === p.deviceId,
        );
        if (!update) return p;
        return {
          ...p,
          score: p.score + update.scoreDelta,
          correctGuesses: update.correctGuesses,
        };
      });
      const updatedStreaks = { ...state.streaks };
      const updatedBestStreaks = { ...state.bestStreaks };
      const updatedSpeedBonusCount = { ...state.speedBonusCount };
      for (const u of action.scoreUpdates) {
        updatedStreaks[u.deviceId] = u.streak;
        if (u.streak > (updatedBestStreaks[u.deviceId] ?? 0)) {
          updatedBestStreaks[u.deviceId] = u.streak;
        }
        if (u.speedBonus && u.speedBonus > 0) {
          updatedSpeedBonusCount[u.deviceId] =
            (updatedSpeedBonusCount[u.deviceId] ?? 0) + 1;
        }
      }
      return {
        ...state,
        phase: "reveal",
        players: updatedPlayers,
        streaks: updatedStreaks,
        bestStreaks: updatedBestStreaks,
        speedBonusCount: updatedSpeedBonusCount,
      };
    }

    case "ADVANCE_ROUND":
      return {
        ...state,
        currentRound: state.currentRound + 1,
        roundsSinceLastAd: state.roundsSinceLastAd + 1,
      };

    case "SHOW_LEADERBOARD":
      return { ...state, phase: "leaderboard" };

    case "PAUSE":
      return { ...state, isPaused: true };

    case "RESUME":
      return { ...state, isPaused: false };

    case "TOGGLE_MUSIC":
      return { ...state, musicEnabled: !state.musicEnabled };

    case "RESET_GAME":
      return {
        ...initialScreenState,
        language: state.language,
        musicEnabled: state.musicEnabled,
      };

    case "REMOVE_PLAYER":
      return {
        ...state,
        players: state.players.filter((p) => p.deviceId !== action.deviceId),
        playerGuesses: Object.fromEntries(
          Object.entries(state.playerGuesses).filter(
            ([id]) => Number(id) !== action.deviceId,
          ),
        ),
      };

    case "SET_TOTAL_ROUNDS":
      return { ...state, totalRounds: action.totalRounds };

    default:
      return state;
  }
}

// ─── Context ───

const ScreenStateContext = createContext<ScreenState>(initialScreenState);
const ScreenDispatchContext = createContext<Dispatch<ScreenAction>>(() => {});

export function ScreenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(screenReducer, initialScreenState);
  return (
    <ScreenStateContext.Provider value={state}>
      <ScreenDispatchContext.Provider value={dispatch}>
        {children}
      </ScreenDispatchContext.Provider>
    </ScreenStateContext.Provider>
  );
}

export function useScreenState() {
  return useContext(ScreenStateContext);
}

export function useScreenDispatch() {
  return useContext(ScreenDispatchContext);
}
