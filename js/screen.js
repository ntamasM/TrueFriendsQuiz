/**
 * True Friends Quiz — Screen Logic
 * All game logic is managed here. Controllers are "dumb" I/O devices.
 */

// =========================
// Game State
// =========================
var gameState = {
  phase: "lobby", // lobby | picking | answering | guessing | reveal | leaderboard
  language: "en",
  players: [], // { deviceId, playerNumber, nickname, profilePic, score, correctGuesses }
  currentRound: 0,
  totalRounds: 0,
  roundsPerPlayer: 1,
  currentQuestion: null,
  hostAnswer: null,
  playerGuesses: {},
  usedQuestionIds: [],
  guessTimer: null,
  guessTimeLeft: 20,
  GUESS_TIME: 20, // seconds for guessing phase
  isPaused: false, // track pause state for ads and AirConsole pause
  roundsSinceLastAd: 0, // track rounds for ad frequency
  musicEnabled: true, // background music on by default
};

var airconsole;
var lobbyUpdateTimer = null;

// =========================
// Background Music Manager
// =========================
var bgMusic = {
  tracks: [
    "Assets/music/Compressed/BackgroundMusic1.ogg",
    "Assets/music/Compressed/BackgroundMusic2.ogg",
    "Assets/music/Compressed/BackgroundMusic3.ogg",
  ],
  audio: null,
  currentTrack: -1,

  /** Pick a random track different from the current one */
  _nextTrack: function () {
    var next;
    do {
      next = Math.floor(Math.random() * this.tracks.length);
    } while (next === this.currentTrack && this.tracks.length > 1);
    return next;
  },

  /** Start streaming background music (lazy — creates <audio> on first call) */
  play: function () {
    if (!gameState.musicEnabled) return;
    this.currentTrack = this._nextTrack();
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = false;
      this.audio.volume = 0.35;
      var self = this;
      // When a track ends, play the next one
      this.audio.addEventListener("ended", function () {
        self.currentTrack = self._nextTrack();
        self.audio.src = self.tracks[self.currentTrack];
        self.audio.play().catch(function () {});
      });
    }
    this.audio.src = this.tracks[this.currentTrack];
    this.audio.play().catch(function () {});
  },

  /** Stop music and release the source */
  stop: function () {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.removeAttribute("src");
    }
  },

  /** Pause music (for ads / AirConsole pause) */
  pause: function () {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  },

  /** Resume music after pause */
  resume: function () {
    if (gameState.musicEnabled && this.audio && this.audio.src) {
      this.audio.play().catch(function () {});
    }
  },

  /** Toggle music on/off */
  toggle: function (enabled) {
    gameState.musicEnabled = enabled;
    if (enabled) {
      // If we're in-game, start playing
      if (gameState.phase !== "lobby") {
        this.play();
      }
    } else {
      this.stop();
    }
  },
};

// =========================
// Initialization
// =========================
function initScreen() {
  airconsole = new AirConsole();

  airconsole.onReady = function (code) {
    console.log("AirConsole ready. Code:", code);
    // Auto-detect language from screen browser
    autoDetectScreenLanguage();
    updateLobbyPlayers();
  };

  airconsole.onConnect = function (device_id) {
    console.log("Device connected:", device_id);
    if (gameState.phase === "lobby") {
      debouncedUpdateLobbyPlayers();
    } else {
      // Game is in progress — inform the new controller
      handleMidGameConnect(device_id);
    }
  };

  airconsole.onDisconnect = function (device_id) {
    console.log("Device disconnected:", device_id);
    if (gameState.phase === "lobby") {
      debouncedUpdateLobbyPlayers();
    } else {
      // Game is in progress — handle player leaving
      handleMidGameDisconnect(device_id);
    }
  };

  airconsole.onDeviceProfileChange = function (device_id) {
    console.log("Device profile changed:", device_id);
    if (gameState.phase === "lobby") {
      debouncedUpdateLobbyPlayers();
    }
  };

  // ---- Ad Break Handlers ----
  airconsole.onAdShow = function () {
    console.log("Ad is showing — pausing game");
    pauseGame();
  };

  airconsole.onAdComplete = function (ad_was_shown) {
    console.log("Ad complete. Was shown:", ad_was_shown);
    resumeGame();
  };

  // ---- Pause / Resume (AirConsole lifecycle) ----
  airconsole.onPause = function () {
    console.log("Game paused by AirConsole");
    pauseGame();
  };

  airconsole.onResume = function () {
    console.log("Game resumed by AirConsole");
    resumeGame();
  };

  airconsole.onMessage = function (from, data) {
    if (!data || !data.action) return;
    console.log("Message from", from, ":", data);

    switch (data.action) {
      case "start_game":
        // Only master controller can start the game
        if (from !== airconsole.getMasterControllerDeviceId()) break;
        if (data.roundsPerPlayer) {
          gameState.roundsPerPlayer = Math.max(
            1,
            Math.min(5, data.roundsPerPlayer),
          );
        }
        if (data.answerTime) {
          gameState.GUESS_TIME = Math.max(10, Math.min(60, data.answerTime));
          gameState.guessTimeLeft = gameState.GUESS_TIME;
        }
        handleStartGame();
        break;
      case "select_language":
        // Only master controller can change language
        if (from === airconsole.getMasterControllerDeviceId()) {
          handleLanguageSelect(data.language);
        }
        break;
      case "question_selected":
        handleQuestionSelected(from, data.questionId);
        break;
      case "host_answer":
        handleHostAnswer(from, data.answerId);
        break;
      case "player_guess":
        handlePlayerGuess(from, data.answerId);
        break;
      case "play_again":
        // Only master controller can trigger this
        if (from === airconsole.getMasterControllerDeviceId()) {
          handlePlayAgain();
        }
        break;
      case "back_to_menu":
        // Only master controller can trigger this
        if (from === airconsole.getMasterControllerDeviceId()) {
          handleBackToMenu();
        }
        break;
      case "toggle_music":
        // Only master controller can toggle music
        if (from === airconsole.getMasterControllerDeviceId()) {
          bgMusic.toggle(!!data.enabled);
        }
        break;
    }
  };
}

// =========================
// Helpers
// =========================
function t(key) {
  return UI_TEXT[gameState.language][key] || key;
}

function showPhase(phaseId) {
  document.querySelectorAll(".phase").forEach(function (el) {
    el.classList.remove("active");
  });
  document.getElementById(phaseId).classList.add("active");
}

function getHostPlayer() {
  var playerIndex = gameState.currentRound % gameState.players.length;
  return gameState.players[playerIndex];
}

function getGuesserPlayers() {
  var playerIndex = gameState.currentRound % gameState.players.length;
  return gameState.players.filter(function (p, i) {
    return i !== playerIndex;
  });
}

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function replaceNamePlaceholder(text, name) {
  return text.replace(/\{name\}/g, name);
}

// =========================
// Lobby
// =========================
function updateLobbyPlayers() {
  var ids = airconsole.getControllerDeviceIds();
  var listEl = document.getElementById("player-list");
  var countEl = document.getElementById("player-count-info");

  listEl.innerHTML = "";
  ids.forEach(function (id) {
    var nickname = airconsole.getNickname(id) || "Player " + id;
    var pic = airconsole.getProfilePicture(id, 64);

    var card = document.createElement("div");
    card.className = "player-card";

    var avatar = document.createElement("img");
    avatar.className = "player-avatar";
    avatar.src = pic || "";
    avatar.onerror = function () {
      this.style.display = "none";
    };

    var nameEl = document.createElement("span");
    nameEl.className = "player-name";
    nameEl.textContent = nickname;

    card.appendChild(avatar);
    card.appendChild(nameEl);
    listEl.appendChild(card);
  });

  var count = ids.length;
  countEl.textContent =
    count + " " + t("players") + (count < 3 ? " — " + t("minPlayers") : "");

  // Update info text
  updateLobbyInfo();
}

// Debounced version to prevent message flood when many devices connect at once
function debouncedUpdateLobbyPlayers() {
  clearTimeout(lobbyUpdateTimer);
  lobbyUpdateTimer = setTimeout(function () {
    if (gameState.phase === "lobby") {
      updateLobbyPlayers();
    }
  }, 300);
}

function broadcastPhase(phase, extraData) {
  var data = {
    action: "game_phase",
    phase: phase,
    language: gameState.language,
  };
  if (extraData) {
    for (var key in extraData) {
      data[key] = extraData[key];
    }
  }
  airconsole.broadcast(data);
}

// =========================
// Language Select
// =========================
var SUPPORTED_LANGUAGES = ["en", "el", "es", "fr", "de", "tr", "ar"];

var LANGUAGE_NAMES = {
  en: "🇬🇧 English",
  el: "🇬🇷 Ελληνικά",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  de: "🇩🇪 Deutsch",
  tr: "🇹🇷 Türkçe",
  ar: "🇸🇦 العربية",
};

function updateLobbyInfo() {
  var infoEl = document.getElementById("lobby-info");
  if (!infoEl) return;

  var masterDeviceId = airconsole.getMasterControllerDeviceId();
  var masterName = masterDeviceId
    ? airconsole.getNickname(masterDeviceId) || "Player"
    : "...";

  var waitingText = t("waitingForMasterToStart").replace("{name}", masterName);
  var langText =
    t("currentLanguage") + ": " + LANGUAGE_NAMES[gameState.language];

  infoEl.innerHTML =
    '<div class="lobby-info-waiting">' +
    waitingText +
    "</div>" +
    '<div class="lobby-info-lang">' +
    langText +
    "</div>";
}

function handleLanguageSelect(lang) {
  if (SUPPORTED_LANGUAGES.indexOf(lang) === -1) return;

  // Load language files on demand, then apply
  loadLanguage(lang, function () {
    gameState.language = lang;

    // Re-render lobby text
    document.getElementById("player-list-title").textContent = t("players");
    updateLobbyPlayers();
    updateLobbyInfo();

    // Broadcast language to controllers
    airconsole.broadcast({ action: "language_changed", language: lang });
  });
}

// =========================
// Start Game
// =========================
function handleStartGame() {
  if (gameState.phase !== "lobby") return;
  var ids = airconsole.getControllerDeviceIds();
  if (ids.length < 3) return;

  // Set active players
  airconsole.setActivePlayers(ids.length);

  // Build player list
  gameState.players = [];
  for (var i = 0; i < ids.length; i++) {
    var deviceId = airconsole.convertPlayerNumberToDeviceId(i);
    gameState.players.push({
      deviceId: deviceId,
      playerNumber: i,
      nickname: airconsole.getNickname(deviceId) || "Player " + (i + 1),
      profilePic: airconsole.getProfilePicture(deviceId, 64) || "",
      score: 0,
      correctGuesses: 0,
    });
  }

  // Shuffle player order for rounds
  gameState.players = shuffleArray(gameState.players);
  gameState.totalRounds = gameState.players.length * gameState.roundsPerPlayer;
  gameState.currentRound = 0;
  gameState.usedQuestionIds = [];

  // Start background music when game begins
  bgMusic.play();

  startRound();
}

// =========================
// Round Flow
// =========================
function startRound() {
  gameState.phase = "picking";
  gameState.currentQuestion = null;
  gameState.hostAnswer = null;
  gameState.playerGuesses = {};

  var host = getHostPlayer();

  // Show picking phase on screen
  showPhase("picking");
  var roundInfo = document.getElementById("picking-round-info");
  roundInfo.textContent =
    t("round") +
    " " +
    (gameState.currentRound + 1) +
    " " +
    t("of") +
    " " +
    gameState.totalRounds;

  var hostAvatar = document.getElementById("picking-host-avatar");
  hostAvatar.src = host.profilePic;
  hostAvatar.onerror = function () {
    this.style.display = "none";
  };

  var hostName = document.getElementById("picking-host-name");
  hostName.textContent = host.nickname;

  var hostStatus = document.getElementById("picking-host-status");
  hostStatus.textContent = t("choosingQuestion");

  // Pick 4 random questions for the host to choose from
  var questions = getRandomQuestions(4);
  var questionsForHost = questions.map(function (q) {
    return {
      id: q.id,
      question: replaceNamePlaceholder(q.question, host.nickname),
      answers: q.answers,
    };
  });

  // Send questions only to host controller
  airconsole.message(host.deviceId, {
    action: "pick_question",
    questions: questionsForHost,
    language: gameState.language,
  });

  // Tell other players to wait
  getGuesserPlayers().forEach(function (p) {
    airconsole.message(p.deviceId, {
      action: "game_phase",
      phase: "waiting",
      message: host.nickname + " " + t("waitingForHost"),
      language: gameState.language,
    });
  });
}

function getRandomQuestions(count) {
  var langQuestions = QUESTIONS[gameState.language] || QUESTIONS["en"];

  // Include Hero-exclusive questions if any player in the session is premium
  var heroKey = gameState.language + "_hero";
  var heroQuestions = QUESTIONS[heroKey] || QUESTIONS["en_hero"] || [];
  if (isAnyPlayerPremium() && heroQuestions.length > 0) {
    langQuestions = langQuestions.concat(heroQuestions);
  }

  var available = langQuestions.filter(function (q) {
    return gameState.usedQuestionIds.indexOf(q.id) === -1;
  });

  // If not enough, reset used
  if (available.length < count) {
    gameState.usedQuestionIds = [];
    available = langQuestions.slice();
  }

  var shuffled = shuffleArray(available);
  return shuffled.slice(0, count);
}

// =========================
// Premium / Hero Check
// =========================
function isAnyPlayerPremium() {
  try {
    var ids = airconsole.getControllerDeviceIds();
    for (var i = 0; i < ids.length; i++) {
      if (airconsole.isPremium(ids[i])) {
        return true;
      }
    }
    // Also check if the screen device is premium
    if (airconsole.isPremium(0)) {
      return true;
    }
  } catch (e) {
    console.log("Premium check not available:", e);
  }
  return false;
}

// =========================
// Question Selected (by host)
// =========================
function handleQuestionSelected(from, questionId) {
  if (gameState.phase !== "picking") return;
  var host = getHostPlayer();
  if (from !== host.deviceId) return;

  // Find the full question
  var langQuestions = QUESTIONS[gameState.language] || QUESTIONS["en"];
  var question = null;
  for (var i = 0; i < langQuestions.length; i++) {
    if (langQuestions[i].id === questionId) {
      question = langQuestions[i];
      break;
    }
  }
  if (!question) return;

  gameState.currentQuestion = question;
  gameState.usedQuestionIds.push(questionId);
  gameState.phase = "answering";

  var displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );

  // Show answering phase on screen
  showPhase("answering");
  document.getElementById("answering-round-info").textContent =
    t("round") +
    " " +
    (gameState.currentRound + 1) +
    " " +
    t("of") +
    " " +
    gameState.totalRounds;

  var hostAvatar2 = document.getElementById("answering-host-avatar");
  hostAvatar2.src = host.profilePic;
  hostAvatar2.onerror = function () {
    this.style.display = "none";
  };

  document.getElementById("answering-host-name").textContent = host.nickname;
  document.getElementById("answering-host-status").textContent =
    t("waitingForAnswer");
  document.getElementById("answering-question-text").textContent =
    displayQuestion;

  // Show answer options on screen
  var answersContainer = document.getElementById("answering-answers");
  answersContainer.innerHTML = "";
  var classes = ["answer-a", "answer-b", "answer-c", "answer-d"];
  question.answers.forEach(function (ans, idx) {
    var card = document.createElement("div");
    card.className = "answer-card " + classes[idx];
    card.textContent = ans;
    answersContainer.appendChild(card);
  });

  // Send question to host's controller to answer
  airconsole.message(host.deviceId, {
    action: "answer_question",
    question: displayQuestion,
    answers: question.answers,
    language: gameState.language,
  });

  // Keep other players waiting
  getGuesserPlayers().forEach(function (p) {
    airconsole.message(p.deviceId, {
      action: "game_phase",
      phase: "waiting",
      message: host.nickname + " " + t("waitingForAnswer"),
      language: gameState.language,
    });
  });
}

// =========================
// Host Answer
// =========================
function handleHostAnswer(from, answerId) {
  if (gameState.phase !== "answering") return;
  var host = getHostPlayer();
  if (from !== host.deviceId) return;

  gameState.hostAnswer = answerId;
  gameState.phase = "guessing";

  var question = gameState.currentQuestion;
  var displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );

  // Show guessing phase on screen
  showPhase("guessing");
  document.getElementById("guessing-question-text").textContent =
    displayQuestion;

  var answersContainer = document.getElementById("guessing-answers");
  answersContainer.innerHTML = "";
  var classes = ["answer-a", "answer-b", "answer-c", "answer-d"];
  question.answers.forEach(function (ans, idx) {
    var card = document.createElement("div");
    card.className = "answer-card " + classes[idx];
    card.textContent = ans;
    answersContainer.appendChild(card);
  });

  // Build player status indicators
  var statusContainer = document.getElementById("guessing-players-status");
  statusContainer.innerHTML = "";
  getGuesserPlayers().forEach(function (p) {
    var dot = document.createElement("div");
    dot.className = "player-status-dot";
    dot.id = "status-" + p.deviceId;
    dot.innerHTML = '<span class="dot"></span><span>' + p.nickname + "</span>";
    statusContainer.appendChild(dot);
  });

  // Start timer
  gameState.guessTimeLeft = gameState.GUESS_TIME;
  updateTimerDisplay();
  startGuessTimer();

  // Tell host to wait
  airconsole.message(host.deviceId, {
    action: "game_phase",
    phase: "host_waiting",
    message: t("waitingForGuesses"),
    language: gameState.language,
  });

  // Send question to guesser controllers
  getGuesserPlayers().forEach(function (p) {
    airconsole.message(p.deviceId, {
      action: "guess_question",
      question: displayQuestion,
      answers: question.answers,
      hostNickname: host.nickname,
      timeLeft: gameState.GUESS_TIME,
      language: gameState.language,
    });
  });
}

function startGuessTimer() {
  clearInterval(gameState.guessTimer);
  gameState.guessTimer = setInterval(function () {
    gameState.guessTimeLeft--;
    updateTimerDisplay();

    // Broadcast timer to controllers
    airconsole.broadcast({
      action: "timer_update",
      timeLeft: gameState.guessTimeLeft,
    });

    if (gameState.guessTimeLeft <= 0) {
      clearInterval(gameState.guessTimer);
      showReveal();
    }
  }, 1000);
}

function updateTimerDisplay() {
  var timerFill = document.getElementById("timer-fill");
  var timerText = document.getElementById("timer-text");
  var pct = (gameState.guessTimeLeft / gameState.GUESS_TIME) * 100;
  timerFill.style.width = pct + "%";
  timerText.textContent = gameState.guessTimeLeft + t("seconds");
}

// =========================
// Player Guess
// =========================
function handlePlayerGuess(from, answerId) {
  if (gameState.phase !== "guessing") return;
  var host = getHostPlayer();
  if (from === host.deviceId) return; // Host can't guess

  // Check player is in the game
  var isPlayer = false;
  for (var i = 0; i < gameState.players.length; i++) {
    if (gameState.players[i].deviceId === from) {
      isPlayer = true;
      break;
    }
  }
  if (!isPlayer) return;

  // Don't allow re-guessing
  if (gameState.playerGuesses[from] !== undefined) return;

  gameState.playerGuesses[from] = answerId;

  // Update status indicator
  var statusDot = document.getElementById("status-" + from);
  if (statusDot) {
    statusDot.classList.add("answered");
  }

  // Confirm to the player
  airconsole.message(from, { action: "guess_confirmed" });

  // Check if all guessers have answered
  var guessers = getGuesserPlayers();
  var allAnswered = guessers.every(function (p) {
    return gameState.playerGuesses[p.deviceId] !== undefined;
  });

  if (allAnswered) {
    clearInterval(gameState.guessTimer);
    // Small delay for dramatic effect
    setTimeout(function () {
      showReveal();
    }, 500);
  }
}

// =========================
// Reveal
// =========================
function showReveal() {
  if (gameState.phase === "reveal") return; // Prevent double call
  gameState.phase = "reveal";

  var host = getHostPlayer();
  var question = gameState.currentQuestion;
  var correctIdx = gameState.hostAnswer;
  var displayQuestion = replaceNamePlaceholder(
    question.question,
    host.nickname,
  );

  showPhase("reveal");
  document.getElementById("reveal-question-text").textContent = displayQuestion;

  // Show answers with correct/wrong highlighting
  var answersContainer = document.getElementById("reveal-answers");
  answersContainer.innerHTML = "";

  question.answers.forEach(function (ans, idx) {
    var card = document.createElement("div");
    card.className = "reveal-answer";
    if (idx === correctIdx) {
      card.classList.add("correct-answer");
    } else {
      card.classList.add("wrong-answer");
    }

    var textSpan = document.createElement("div");
    textSpan.textContent = ans;
    card.appendChild(textSpan);

    // Show player avatars who picked this answer
    var avatarsDiv = document.createElement("div");
    avatarsDiv.className = "guess-avatars";

    getGuesserPlayers().forEach(function (p) {
      if (gameState.playerGuesses[p.deviceId] === idx) {
        var img = document.createElement("img");
        img.className = "guess-avatar";
        img.src = p.profilePic;
        img.title = p.nickname;
        img.onerror = function () {
          this.style.display = "none";
        };
        avatarsDiv.appendChild(img);
      }
    });

    card.appendChild(avatarsDiv);
    answersContainer.appendChild(card);
  });

  // Calculate scores
  var scoreChangesEl = document.getElementById("score-changes");
  scoreChangesEl.innerHTML = "";

  getGuesserPlayers().forEach(function (p) {
    var guess = gameState.playerGuesses[p.deviceId];
    var isCorrect = guess === correctIdx;
    var points = isCorrect ? 100 : 0;

    if (isCorrect) {
      p.score += points;
      p.correctGuesses++;
    }

    var changeDiv = document.createElement("div");
    changeDiv.className =
      "score-change " + (isCorrect ? "got-correct" : "got-wrong");

    var avatar = document.createElement("img");
    avatar.className = "score-change-avatar";
    avatar.src = p.profilePic;
    avatar.onerror = function () {
      this.style.display = "none";
    };

    var text = document.createElement("span");
    text.textContent = p.nickname + ": " + (isCorrect ? "+100" : "0");

    changeDiv.appendChild(avatar);
    changeDiv.appendChild(text);
    scoreChangesEl.appendChild(changeDiv);

    // Send result to each controller
    airconsole.message(p.deviceId, {
      action: "show_result",
      correct: isCorrect,
      correctAnswer: question.answers[correctIdx],
      points: points,
      totalScore: p.score,
      language: gameState.language,
    });
  });

  // Also tell the host
  airconsole.message(host.deviceId, {
    action: "show_result",
    correct: null, // host doesn't guess
    correctAnswer: question.answers[correctIdx],
    points: 0,
    totalScore: host.score,
    isHost: true,
    language: gameState.language,
  });

  // After 5 seconds, go to next round or leaderboard
  setTimeout(function () {
    gameState.currentRound++;
    gameState.roundsSinceLastAd++;

    if (gameState.currentRound >= gameState.totalRounds) {
      // Show ad before final leaderboard
      tryShowAd();
      // Small delay to let ad system process, then show leaderboard
      setTimeout(function () {
        showLeaderboard();
      }, 500);
    } else {
      // Show ad every 3 rounds (AirConsole will throttle if too frequent)
      if (gameState.roundsSinceLastAd >= 3) {
        tryShowAd();
      }
      // Start next round after a brief delay for ad
      setTimeout(function () {
        startRound();
      }, 300);
    }
  }, 5000);
}

// =========================
// Leaderboard
// =========================
function showLeaderboard() {
  gameState.phase = "leaderboard";
  showPhase("leaderboard");

  // Sort by score descending
  var sorted = gameState.players.slice().sort(function (a, b) {
    return b.score - a.score;
  });

  // Podium (top 3)
  var podium = document.getElementById("podium");
  podium.innerHTML = "";

  // Order for podium display: 2nd, 1st, 3rd
  var podiumOrder = [1, 0, 2];
  var placeLabels = t("place");

  podiumOrder.forEach(function (rankIdx) {
    if (rankIdx >= sorted.length) return;
    var player = sorted[rankIdx];

    var placeDiv = document.createElement("div");
    placeDiv.className = "podium-place";

    var avatar = document.createElement("img");
    avatar.className = "podium-avatar";
    avatar.src = player.profilePic;
    avatar.onerror = function () {
      this.style.display = "none";
    };

    var name = document.createElement("div");
    name.className = "podium-name";
    name.textContent = player.nickname;

    var score = document.createElement("div");
    score.className = "podium-score";
    score.textContent = player.score + " " + t("points");

    var bar = document.createElement("div");
    bar.className = "podium-bar";
    bar.textContent = placeLabels[rankIdx] || rankIdx + 1;

    placeDiv.appendChild(avatar);
    placeDiv.appendChild(name);
    placeDiv.appendChild(score);
    placeDiv.appendChild(bar);
    podium.appendChild(placeDiv);
  });

  // Full list (skip top 3 since they're already on the podium)
  var listEl = document.getElementById("leaderboard-list");
  listEl.innerHTML = "";

  sorted.forEach(function (player, idx) {
    if (idx < 3) return;
    var row = document.createElement("div");
    row.className = "leaderboard-row";

    var rank = document.createElement("div");
    rank.className = "leaderboard-rank";
    rank.textContent = "#" + (idx + 1);

    var avatar = document.createElement("img");
    avatar.className = "leaderboard-row-avatar";
    avatar.src = player.profilePic;
    avatar.onerror = function () {
      this.style.display = "none";
    };

    var nameEl = document.createElement("div");
    nameEl.className = "leaderboard-row-name";
    nameEl.textContent = player.nickname;

    var scoreEl = document.createElement("div");
    scoreEl.className = "leaderboard-row-score";
    scoreEl.textContent = player.score + " " + t("points");

    row.appendChild(rank);
    row.appendChild(avatar);
    row.appendChild(nameEl);
    row.appendChild(scoreEl);
    listEl.appendChild(row);
  });

  // Update leaderboard title text
  document.getElementById("leaderboard-title").textContent = t("gameOver");
  document.getElementById("leaderboard-subtitle").textContent =
    t("finalScores");
  document.getElementById("lb-play-again").textContent = t("playAgain");
  document.getElementById("lb-back-menu").textContent = t("backToMenu");

  // Send leaderboard to controllers
  sorted.forEach(function (player, idx) {
    airconsole.message(player.deviceId, {
      action: "game_phase",
      phase: "leaderboard",
      rank: idx + 1,
      totalPlayers: sorted.length,
      score: player.score,
      correctGuesses: player.correctGuesses,
      totalRounds: gameState.totalRounds - 1, // they play totalRounds - 1 as guesser
      language: gameState.language,
    });
  });

  // Set active players to 0 to allow new joiners
  airconsole.setActivePlayers(0);
}

// =========================
// Play Again / Back to Menu
// =========================
function handlePlayAgain() {
  resetGame();
  handleStartGame();
}

function handleBackToMenu() {
  bgMusic.stop();
  resetGame();
  showPhase("lobby");
  updateLobbyPlayers();
  broadcastPhase("lobby");
}

function resetGame() {
  clearInterval(gameState.guessTimer);
  gameState.phase = "lobby";
  gameState.players = [];
  gameState.currentRound = 0;
  gameState.totalRounds = 0;
  gameState.currentQuestion = null;
  gameState.hostAnswer = null;
  gameState.playerGuesses = {};
  gameState.usedQuestionIds = [];
  gameState.roundsSinceLastAd = 0;
  gameState.isPaused = false;
}

// Screen buttons for leaderboard — only master controller can use these
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("lb-play-again")
    .addEventListener("click", function () {
      // Only allow if triggered from screen (master oversight)
      handlePlayAgain();
    });
  document
    .getElementById("lb-back-menu")
    .addEventListener("click", function () {
      handleBackToMenu();
    });
});

// =========================
// Pause / Resume
// =========================
function pauseGame() {
  if (gameState.isPaused) return;
  gameState.isPaused = true;
  // Pause the guess timer if running
  if (gameState.guessTimer) {
    clearInterval(gameState.guessTimer);
  }
  // Pause background music
  bgMusic.pause();
  // Broadcast pause to all controllers
  airconsole.broadcast({ action: "game_paused" });
}

function resumeGame() {
  if (!gameState.isPaused) return;
  gameState.isPaused = false;
  // Resume the guess timer if we're in the guessing phase
  if (gameState.phase === "guessing" && gameState.guessTimeLeft > 0) {
    startGuessTimer();
  }
  // Resume background music
  bgMusic.resume();
  // Broadcast resume to all controllers
  airconsole.broadcast({ action: "game_resumed" });
}

// =========================
// Ad Breaks
// =========================
function tryShowAd() {
  // Call showAd — AirConsole decides whether to actually show one
  gameState.roundsSinceLastAd = 0;
  airconsole.showAd();
}

// =========================
// Mid-Game Connect
// =========================
function handleMidGameConnect(device_id) {
  // Inform the new controller that a game is in progress
  airconsole.message(device_id, {
    action: "game_phase",
    phase: "waiting",
    message:
      t("gameInProgress") ||
      "A game is in progress. Please wait for the next round.",
    language: gameState.language,
  });
}

// =========================
// Mid-Game Disconnect
// =========================
function handleMidGameDisconnect(device_id) {
  // Find if this player is in the active game
  var playerIndex = -1;
  for (var i = 0; i < gameState.players.length; i++) {
    if (gameState.players[i].deviceId === device_id) {
      playerIndex = i;
      break;
    }
  }

  if (playerIndex === -1) return; // not an active player

  var disconnectedPlayer = gameState.players[playerIndex];
  var wasHost = getHostPlayer().deviceId === device_id;

  // Remove the player from the game
  gameState.players.splice(playerIndex, 1);

  // If fewer than 2 players remain, end the game
  if (gameState.players.length < 2) {
    clearInterval(gameState.guessTimer);
    // Not enough players — go back to lobby
    resetGame();
    showPhase("lobby");
    updateLobbyPlayers();
    airconsole.broadcast({
      action: "game_phase",
      phase: "lobby",
      message:
        t("notEnoughPlayers") || "Not enough players. Returning to lobby.",
      language: gameState.language,
    });
    return;
  }

  // Adjust totalRounds based on new player count
  gameState.totalRounds = gameState.players.length * gameState.roundsPerPlayer;

  // If currentRound exceeds new totalRounds, go to leaderboard
  if (gameState.currentRound >= gameState.totalRounds) {
    clearInterval(gameState.guessTimer);
    showLeaderboard();
    return;
  }

  // If the disconnected player was the current host, skip to next round
  if (wasHost) {
    clearInterval(gameState.guessTimer);
    // Notify everyone
    airconsole.broadcast({
      action: "game_phase",
      phase: "waiting",
      message:
        disconnectedPlayer.nickname +
        " " +
        (t("playerLeft") || "left the game. Moving to next round..."),
      language: gameState.language,
    });
    setTimeout(function () {
      startRound();
    }, 2000);
    return;
  }

  // If in guessing phase, remove the player's guess expectation and check if all remaining guessers answered
  if (gameState.phase === "guessing") {
    delete gameState.playerGuesses[device_id];
    var guessers = getGuesserPlayers();
    var allAnswered = guessers.every(function (p) {
      return gameState.playerGuesses[p.deviceId] !== undefined;
    });

    if (allAnswered) {
      clearInterval(gameState.guessTimer);
      setTimeout(function () {
        showReveal();
      }, 500);
    }
  }
}

// =========================
// Auto-Detect Screen Language
// =========================
function autoDetectScreenLanguage() {
  var browserLang = (navigator.language || navigator.userLanguage || "en")
    .substring(0, 2)
    .toLowerCase();
  if (
    SUPPORTED_LANGUAGES.indexOf(browserLang) !== -1 &&
    browserLang !== gameState.language
  ) {
    // Load the detected language then apply
    loadLanguage(browserLang, function () {
      gameState.language = browserLang;
      document.getElementById("player-list-title").textContent = t("players");
      updateLobbyPlayers();
      updateLobbyInfo();
      // Notify all connected controllers
      airconsole.broadcast({
        action: "language_changed",
        language: browserLang,
      });
    });
  }
}

// =========================
// Boot
// =========================
document.addEventListener("DOMContentLoaded", initScreen);
