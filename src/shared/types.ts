// ─── Game Phases & Views ───

export type ScreenPhase =
  | "lobby"
  | "picking"
  | "answering"
  | "guessing"
  | "reveal"
  | "leaderboard";

export type PickingSubStep = "category_vote" | "question_pick";

export type ControllerView =
  | "lobby"
  | "settings"
  | "category-vote"
  | "pick"
  | "answer"
  | "guess"
  | "waiting"
  | "host-wait"
  | "result"
  | "leaderboard";

export type CategoryVoteOption = "fun" | "deep" | "dilemma" | "spicy";

// ─── Data Models ───

export interface Player {
  deviceId: number;
  playerNumber: number;
  nickname: string;
  profilePic: string;
  score: number;
  correctGuesses: number;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  answers: string[];
}

export interface CategoryDef {
  key: string;
  hero: boolean;
}

// ─── Screen → Controller Messages ───

export type ScreenToControllerMessage =
  | {
      action: "game_phase";
      phase: "lobby" | "waiting" | "host_waiting" | "leaderboard";
      language: string;
      message?: string;
      waitingKey?: string;
      hostNickname?: string;
      // leaderboard extras
      rank?: number;
      totalPlayers?: number;
      score?: number;
      correctGuesses?: number;
      totalRounds?: number;
      bestStreak?: number;
      speedBonuses?: number;
      timesHost?: number;
    }
  | {
      action: "language_changed";
      language: string;
    }
  | {
      action: "pick_question";
      questions: {
        id: number;
        category: string;
        question: string;
        answers: string[];
      }[];
      language: string;
    }
  | {
      action: "answer_question";
      question: string;
      answers: string[];
      language: string;
    }
  | {
      action: "guess_question";
      question: string;
      answers: string[];
      hostNickname: string;
      timeLeft: number;
      language: string;
    }
  | { action: "guess_confirmed" }
  | {
      action: "show_result";
      correct: boolean | null;
      correctAnswer: string;
      points: number;
      totalScore: number;
      isHost?: boolean;
      streak?: number;
      streakBonus?: number;
      speedBonus?: number;
      language: string;
    }
  | {
      action: "timer_update";
      timeLeft: number;
    }
  | { action: "game_paused" }
  | { action: "game_resumed" }
  | { action: "vibrate"; duration: number }
  | {
      action: "pick_category";
      language: string;
    }
  | {
      action: "emoji_broadcast";
      emoji: string;
      nickname: string;
      x: number;
    };

// ─── Controller → Screen Messages ───

export type ControllerToScreenMessage =
  | {
      action: "start_game";
      roundsPerPlayer: number;
      answerTime: number;
      disabledCategories: string[];
    }
  | { action: "select_language"; language: string }
  | { action: "question_selected"; questionId: number }
  | { action: "host_answer"; answerId: number }
  | { action: "player_guess"; answerId: number }
  | { action: "play_again" }
  | { action: "back_to_menu" }
  | { action: "toggle_music"; enabled: boolean }
  | { action: "category_selected"; category: CategoryVoteOption }
  | { action: "emoji_reaction"; emoji: string };

// ─── UI Text Shape ───

export interface UiText {
  gameTitle: string;
  selectLanguage: string;
  startGame: string;
  waitingForPlayers: string;
  minPlayers: string;
  players: string;
  round: string;
  of: string;
  choosingQuestion: string;
  pickQuestion: string;
  waitingForHost: string;
  answerQuestion: string;
  waitingForAnswer: string;
  guessAnswer: string;
  answered: string;
  waitingForGuesses: string;
  youAnswered: string;
  timeLeft: string;
  seconds: string;
  reveal: string;
  correct: string;
  wrong: string;
  theAnswerWas: string;
  points: string;
  nextRound: string;
  gameOver: string;
  finalScores: string;
  playAgain: string;
  backToMenu: string;
  yourRank: string;
  welcome: string;
  waitingToStart: string;
  youAreHost: string;
  hasAnswered: string;
  everyoneAnswered: string;
  place: string[];
  score: string;
  player: string;
  host: string;
  settings: string;
  rounds: string;
  roundsPerPlayer: string;
  back: string;
  answerTime: string;
  waitingForMasterToStart: string;
  currentLanguage: string;
  gameInProgress: string;
  notEnoughPlayers: string;
  playerLeft: string;
  heroQuestions: string;
  music: string;
  musicOn: string;
  musicOff: string;
  categorySettings: string;
  allCategoriesDisabled: string;
  categories: Record<string, string>;
  pointsGuide: {
    title: string;
    guesser: string;
    correctGuess: string;
    firstToGuess: string;
    host: string;
    perCorrectGuesser: string;
    streakBonus: string;
    inARow: string;
  };
  categoryVote: {
    title: string;
    fun: string;
    deep: string;
    dilemma: string;
    spicy: string;
  };
  choosingCategory: string;
  speedBonus: string;
  bestStreak: string;
  speedBonuses: string;
  hostedRounds: string;
  hostedRound: string;
}
