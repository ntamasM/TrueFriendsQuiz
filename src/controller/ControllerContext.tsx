import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { ControllerView } from "../shared/types";

// ─── State ───

export interface ControllerState {
  view: ControllerView;
  language: string;
  isMaster: boolean;
  myDeviceId: number;
  nickname: string;
  roundsPerPlayer: number;
  answerTime: number;
  musicEnabled: boolean;
  disabledCategories: string[];
  isPaused: boolean;
  // Phase-specific data (set when the view changes)
  waitingMessage: string;
  waitingKey: string;
  waitingHostNickname: string;
  pickQuestions: {
    id: number;
    category: string;
    question: string;
    answers: string[];
  }[];
  answerQuestion: string;
  answerOptions: string[];
  guessQuestion: string;
  guessOptions: string[];
  guessHostNickname: string;
  guessTimeLeft: number;
  hasGuessed: boolean;
  // Result data
  resultIsHost: boolean;
  resultCorrect: boolean | null;
  resultCorrectAnswer: string;
  resultPoints: number;
  resultTotalScore: number;
  resultStreak: number;
  resultStreakBonus: number;
  resultSpeedBonus: number;
  // Leaderboard data
  leaderboardRank: number;
  leaderboardTotalPlayers: number;
  leaderboardScore: number;
  leaderboardCorrectGuesses: number;
  leaderboardTotalRounds: number;
  leaderboardBestStreak: number;
  leaderboardSpeedBonuses: number;
  leaderboardTimesHost: number;
}

export const initialControllerState: ControllerState = {
  view: "lobby",
  language: "en",
  isMaster: false,
  myDeviceId: 0,
  nickname: "Player",
  roundsPerPlayer: 1,
  answerTime: 20,
  musicEnabled: true,
  disabledCategories: [],
  isPaused: false,
  waitingMessage: "",
  waitingKey: "",
  waitingHostNickname: "",
  pickQuestions: [],
  answerQuestion: "",
  answerOptions: [],
  guessQuestion: "",
  guessOptions: [],
  guessHostNickname: "",
  guessTimeLeft: 20,
  hasGuessed: false,
  resultIsHost: false,
  resultCorrect: null,
  resultCorrectAnswer: "",
  resultPoints: 0,
  resultTotalScore: 0,
  resultStreak: 0,
  resultStreakBonus: 0,
  resultSpeedBonus: 0,
  leaderboardRank: 0,
  leaderboardTotalPlayers: 0,
  leaderboardScore: 0,
  leaderboardCorrectGuesses: 0,
  leaderboardTotalRounds: 0,
  leaderboardBestStreak: 0,
  leaderboardSpeedBonuses: 0,
  leaderboardTimesHost: 0,
};

// ─── Actions ───

export type ControllerAction =
  | { type: "SET_DEVICE_INFO"; deviceId: number; nickname: string }
  | { type: "SET_MASTER"; isMaster: boolean }
  | { type: "SET_LANGUAGE"; language: string }
  | { type: "SET_VIEW"; view: ControllerView }
  | {
      type: "SET_WAITING";
      message: string;
      waitingKey?: string;
      hostNickname?: string;
    }
  | {
      type: "SET_PICK_QUESTIONS";
      questions: {
        id: number;
        category: string;
        question: string;
        answers: string[];
      }[];
    }
  | { type: "SET_ANSWER_QUESTION"; question: string; answers: string[] }
  | {
      type: "SET_GUESS_QUESTION";
      question: string;
      answers: string[];
      hostNickname: string;
      timeLeft: number;
    }
  | { type: "SET_HAS_GUESSED" }
  | { type: "UPDATE_TIMER"; timeLeft: number }
  | {
      type: "SET_RESULT";
      isHost: boolean;
      correct: boolean | null;
      correctAnswer: string;
      points: number;
      totalScore: number;
      streak?: number;
      streakBonus?: number;
      speedBonus?: number;
    }
  | {
      type: "SET_LEADERBOARD";
      rank: number;
      totalPlayers: number;
      score: number;
      correctGuesses: number;
      totalRounds: number;
      bestStreak: number;
      speedBonuses: number;
      timesHost: number;
    }
  | { type: "SET_PAUSED"; paused: boolean }
  | { type: "SET_ROUNDS_PER_PLAYER"; value: number }
  | { type: "SET_ANSWER_TIME"; value: number }
  | { type: "TOGGLE_MUSIC" }
  | { type: "TOGGLE_CATEGORY"; key: string; totalCategories: number };

// ─── Reducer ───

export function controllerReducer(
  state: ControllerState,
  action: ControllerAction,
): ControllerState {
  switch (action.type) {
    case "SET_DEVICE_INFO":
      return {
        ...state,
        myDeviceId: action.deviceId,
        nickname: action.nickname,
      };

    case "SET_MASTER":
      return { ...state, isMaster: action.isMaster };

    case "SET_LANGUAGE":
      return { ...state, language: action.language };

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "SET_WAITING":
      return {
        ...state,
        view: "waiting",
        waitingMessage: action.message,
        waitingKey: action.waitingKey ?? "",
        waitingHostNickname: action.hostNickname ?? "",
      };

    case "SET_PICK_QUESTIONS":
      return {
        ...state,
        view: "pick",
        pickQuestions: action.questions,
      };

    case "SET_ANSWER_QUESTION":
      return {
        ...state,
        view: "answer",
        answerQuestion: action.question,
        answerOptions: action.answers,
      };

    case "SET_GUESS_QUESTION":
      return {
        ...state,
        view: "guess",
        guessQuestion: action.question,
        guessOptions: action.answers,
        guessHostNickname: action.hostNickname,
        guessTimeLeft: action.timeLeft,
        hasGuessed: false,
      };

    case "SET_HAS_GUESSED":
      return { ...state, hasGuessed: true };

    case "UPDATE_TIMER":
      return { ...state, guessTimeLeft: action.timeLeft };

    case "SET_RESULT":
      return {
        ...state,
        view: "result",
        resultIsHost: action.isHost,
        resultCorrect: action.correct,
        resultCorrectAnswer: action.correctAnswer,
        resultPoints: action.points,
        resultTotalScore: action.totalScore,
        resultStreak: action.streak ?? 0,
        resultStreakBonus: action.streakBonus ?? 0,
        resultSpeedBonus: action.speedBonus ?? 0,
      };

    case "SET_LEADERBOARD":
      return {
        ...state,
        view: "leaderboard",
        leaderboardRank: action.rank,
        leaderboardTotalPlayers: action.totalPlayers,
        leaderboardScore: action.score,
        leaderboardCorrectGuesses: action.correctGuesses,
        leaderboardTotalRounds: action.totalRounds,
        leaderboardBestStreak: action.bestStreak,
        leaderboardSpeedBonuses: action.speedBonuses,
        leaderboardTimesHost: action.timesHost,
      };

    case "SET_PAUSED":
      return { ...state, isPaused: action.paused };

    case "SET_ROUNDS_PER_PLAYER":
      return { ...state, roundsPerPlayer: action.value };

    case "SET_ANSWER_TIME":
      return { ...state, answerTime: action.value };

    case "TOGGLE_MUSIC":
      return { ...state, musicEnabled: !state.musicEnabled };

    case "TOGGLE_CATEGORY": {
      const idx = state.disabledCategories.indexOf(action.key);
      if (idx === -1) {
        // Trying to disable — ensure at least 1 remains
        const enabledCount =
          action.totalCategories - state.disabledCategories.length;
        if (enabledCount <= 1) return state;
        return {
          ...state,
          disabledCategories: [...state.disabledCategories, action.key],
        };
      }
      return {
        ...state,
        disabledCategories: state.disabledCategories.filter(
          (k) => k !== action.key,
        ),
      };
    }

    default:
      return state;
  }
}

// ─── Context ───

const ControllerStateContext = createContext<ControllerState>(
  initialControllerState,
);
const ControllerDispatchContext = createContext<Dispatch<ControllerAction>>(
  () => {},
);

export function ControllerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    controllerReducer,
    initialControllerState,
  );
  return (
    <ControllerStateContext.Provider value={state}>
      <ControllerDispatchContext.Provider value={dispatch}>
        {children}
      </ControllerDispatchContext.Provider>
    </ControllerStateContext.Provider>
  );
}

export function useControllerState() {
  return useContext(ControllerStateContext);
}

export function useControllerDispatch() {
  return useContext(ControllerDispatchContext);
}
