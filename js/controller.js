/**
 * True Friends Quiz — Controller Logic
 * This runs on each player's smartphone.
 */

var airconsole;
var myDeviceId;
var currentLanguage = "en";
var isMaster = false;
var roundsPerPlayer = 1;
var answerTime = 20;
var isPaused = false;
var musicEnabled = true;

// =========================
// Initialization
// =========================
function initController() {
  airconsole = new AirConsole();

  airconsole.onReady = function (code) {
    myDeviceId = airconsole.getDeviceId();
    console.log("Controller ready. Device ID:", myDeviceId);
    // Auto-detect phone language
    autoDetectControllerLanguage();
    showView("view-lobby");
    updateLobbyView();
  };

  airconsole.onConnect = function (device_id) {
    updateLobbyView();
  };

  airconsole.onDisconnect = function (device_id) {
    updateLobbyView();
  };

  // ---- Ad Break Handlers ----
  airconsole.onAdShow = function () {
    console.log("Controller: Ad showing — pausing");
    isPaused = true;
  };

  airconsole.onAdComplete = function (ad_was_shown) {
    console.log("Controller: Ad complete");
    isPaused = false;
  };

  // ---- Pause / Resume (AirConsole lifecycle) ----
  airconsole.onPause = function () {
    console.log("Controller: Paused");
    isPaused = true;
  };

  airconsole.onResume = function () {
    console.log("Controller: Resumed");
    isPaused = false;
  };

  airconsole.onMessage = function (from, data) {
    if (!data || !data.action) return;
    console.log("Controller got message:", data);

    // If the message carries a language, ensure it's loaded before processing
    var msgLang = data.language || null;

    function processMessage() {
      // Update language if provided
      if (msgLang) {
        currentLanguage = msgLang;
      }

      switch (data.action) {
        case "game_phase":
          handlePhaseChange(data);
          break;
        case "language_changed":
          currentLanguage = data.language;
          updateLobbyView();
          break;
        case "pick_question":
          showPickQuestion(data.questions);
          break;
        case "answer_question":
          showAnswerQuestion(data.question, data.answers);
          break;
        case "guess_question":
          showGuessQuestion(
            data.question,
            data.answers,
            data.hostNickname,
            data.timeLeft,
          );
          break;
        case "guess_confirmed":
          // Freeze the guess view
          disableGuessButtons();
          break;
        case "show_result":
          showResult(data);
          break;
        case "timer_update":
          updateGuessTimer(data.timeLeft);
          break;
        case "game_paused":
          isPaused = true;
          break;
        case "game_resumed":
          isPaused = false;
          break;
      }
    }

    // Load language on demand if needed, then process
    if (msgLang && typeof loadLanguage === "function") {
      loadLanguage(msgLang, processMessage);
    } else {
      processMessage();
    }
  };
}

// =========================
// Helpers
// =========================
function t(key) {
  return UI_TEXT[currentLanguage][key] || key;
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(function (el) {
    el.classList.remove("active");
  });
  document.getElementById(viewId).classList.add("active");
}

function addTouchHandler(element, handler) {
  // Use both touch and click for simulator compatibility
  element.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      handler(e);
    },
    { passive: false },
  );
  element.addEventListener("click", handler);
}

// =========================
// Lobby View
// =========================
function updateLobbyView() {
  var nickname = airconsole.getNickname(myDeviceId) || "Player";
  document.getElementById("lobby-nickname").textContent = nickname;
  document.getElementById("lobby-welcome").textContent = t("welcome") + ",";
  document.getElementById("lobby-waiting").textContent = t("waitingToStart");

  // Show start button and settings button only for master controller
  var masterDeviceId = airconsole.getMasterControllerDeviceId();
  isMaster = myDeviceId === masterDeviceId;
  var startBtn = document.getElementById("ctrl-start-btn");
  var settingsBtn = document.getElementById("ctrl-settings-btn");
  var playerCount = airconsole.getControllerDeviceIds().length;

  if (isMaster) {
    startBtn.classList.remove("hidden");
    startBtn.textContent = t("startGame");
    startBtn.disabled = playerCount < 3;
    settingsBtn.classList.remove("hidden");
    settingsBtn.textContent = "⚙️ " + t("settings");
  } else {
    startBtn.classList.add("hidden");
    settingsBtn.classList.add("hidden");
  }
}

// =========================
// Settings View
// =========================
function showSettings() {
  showView("view-settings");
  document.getElementById("settings-title").textContent = "⚙️ " + t("settings");
  document.getElementById("settings-lang-label").textContent =
    t("selectLanguage");
  document.getElementById("settings-rounds-label").textContent =
    t("roundsPerPlayer");
  document.getElementById("settings-back-btn").textContent = "← " + t("back");
  document.getElementById("settings-time-label").textContent = t("answerTime");
  document.getElementById("rounds-value").textContent = roundsPerPlayer;
  document.getElementById("time-value").textContent = answerTime + "s";
  document.getElementById("settings-music-label").textContent = t("music");
  updateMusicToggleButton();
  updateSettingsLangSelect();
}

function updateMusicToggleButton() {
  var btn = document.getElementById("music-toggle");
  if (musicEnabled) {
    btn.textContent = "🔊 " + t("musicOn");
    btn.className = "music-toggle-btn on";
  } else {
    btn.textContent = "🔇 " + t("musicOff");
    btn.className = "music-toggle-btn off";
  }
}

function updateSettingsLangSelect() {
  var sel = document.getElementById("settings-lang-select");
  if (sel) sel.value = currentLanguage;
}

// Start button, settings button & settings controls
document.addEventListener("DOMContentLoaded", function () {
  var startBtn = document.getElementById("ctrl-start-btn");
  addTouchHandler(startBtn, function () {
    if (!startBtn.disabled) {
      airconsole.message(AirConsole.SCREEN, {
        action: "start_game",
        roundsPerPlayer: roundsPerPlayer,
        answerTime: answerTime,
      });
      startBtn.disabled = true;
    }
  });

  // Settings button (master only) — open settings
  var settingsBtn = document.getElementById("ctrl-settings-btn");
  addTouchHandler(settingsBtn, function () {
    showSettings();
  });

  // Back button in settings — return to lobby
  var backBtn = document.getElementById("settings-back-btn");
  addTouchHandler(backBtn, function () {
    showView("view-lobby");
    updateLobbyView();
  });

  // Language select in settings
  var langSelect = document.getElementById("settings-lang-select");
  langSelect.addEventListener("change", function () {
    var lang = langSelect.value;
    if (lang === currentLanguage) return;
    currentLanguage = lang;
    // Tell the screen to change language
    airconsole.message(AirConsole.SCREEN, {
      action: "select_language",
      language: lang,
    });
    // Re-render settings text in new language
    showSettings();
  });

  // Rounds +/- buttons
  var roundsMinus = document.getElementById("rounds-minus");
  var roundsPlus = document.getElementById("rounds-plus");

  addTouchHandler(roundsMinus, function () {
    if (roundsPerPlayer > 1) {
      roundsPerPlayer--;
      document.getElementById("rounds-value").textContent = roundsPerPlayer;
    }
  });

  addTouchHandler(roundsPlus, function () {
    if (roundsPerPlayer < 5) {
      roundsPerPlayer++;
      document.getElementById("rounds-value").textContent = roundsPerPlayer;
    }
  });

  // Answer time +/- buttons
  var timeMinus = document.getElementById("time-minus");
  var timePlus = document.getElementById("time-plus");

  addTouchHandler(timeMinus, function () {
    if (answerTime > 10) {
      answerTime -= 5;
      document.getElementById("time-value").textContent = answerTime + "s";
    }
  });

  addTouchHandler(timePlus, function () {
    if (answerTime < 60) {
      answerTime += 5;
      document.getElementById("time-value").textContent = answerTime + "s";
    }
  });

  // Music toggle button
  var musicToggle = document.getElementById("music-toggle");
  addTouchHandler(musicToggle, function () {
    musicEnabled = !musicEnabled;
    updateMusicToggleButton();
    airconsole.message(AirConsole.SCREEN, {
      action: "toggle_music",
      enabled: musicEnabled,
    });
  });
});

// =========================
// Phase Change Handler
// =========================
function handlePhaseChange(data) {
  switch (data.phase) {
    case "lobby":
      showView("view-lobby");
      updateLobbyView();
      break;
    case "waiting":
      showWaiting(data.message || t("waitingToStart"));
      break;
    case "host_waiting":
      showHostWaiting(data.message);
      break;
    case "leaderboard":
      showLeaderboard(data);
      break;
  }
}

// =========================
// Waiting View
// =========================
function showWaiting(message) {
  showView("view-waiting");
  document.getElementById("waiting-message").textContent = message;
}

// =========================
// Host Waiting View (during guess phase)
// =========================
function showHostWaiting(message) {
  showView("view-host-wait");
  document.getElementById("host-wait-text").textContent = t("youAnswered");
  document.getElementById("host-wait-sub").textContent =
    message || t("waitingForGuesses");
}

// =========================
// Pick Question View
// =========================
function showPickQuestion(questions) {
  showView("view-pick");
  document.getElementById("pick-title").textContent = t("pickQuestion");

  var container = document.getElementById("question-options");
  container.innerHTML = "";

  questions.forEach(function (q) {
    var option = document.createElement("div");
    option.className = "question-option";
    option.textContent = q.question;

    addTouchHandler(option, function () {
      // Visual feedback
      container.querySelectorAll(".question-option").forEach(function (el) {
        el.classList.remove("selected");
      });
      option.classList.add("selected");

      // Send selection to screen
      airconsole.message(AirConsole.SCREEN, {
        action: "question_selected",
        questionId: q.id,
      });

      // Disable further picks and show visual feedback while
      // the screen processes the selection (the screen will send
      // the next view — answer_question — immediately).
      container.querySelectorAll(".question-option").forEach(function (el) {
        el.style.pointerEvents = "none";
        el.style.opacity = "0.6";
      });
    });

    container.appendChild(option);
  });
}

// =========================
// Answer Question View (Host)
// =========================
function showAnswerQuestion(question, answers) {
  showView("view-answer");
  document.getElementById("answer-title").textContent = t("answerQuestion");
  document.getElementById("answer-question-text").textContent = question;

  var container = document.getElementById("answer-options");
  container.innerHTML = "";

  var hasAnswered = false;

  answers.forEach(function (ans, idx) {
    var option = document.createElement("div");
    option.className = "answer-option";
    option.textContent = ans;

    addTouchHandler(option, function () {
      if (hasAnswered) return;
      hasAnswered = true;

      // Visual feedback
      container.querySelectorAll(".answer-option").forEach(function (el) {
        el.classList.remove("selected");
      });
      option.classList.add("selected");

      // Send answer to screen
      airconsole.message(AirConsole.SCREEN, {
        action: "host_answer",
        answerId: idx,
      });
    });

    container.appendChild(option);
  });
}

// =========================
// Guess Question View (Other players)
// =========================
var guessTimerInterval = null;

function showGuessQuestion(question, answers, hostNickname, timeLeft) {
  showView("view-guess");
  document.getElementById("guess-title").textContent =
    t("guessAnswer") + " " + hostNickname + " " + t("answered");
  document.getElementById("guess-question-text").textContent = question;

  // Timer
  var timerEl = document.getElementById("guess-timer");
  timerEl.textContent = timeLeft + t("seconds");

  var container = document.getElementById("guess-options");
  container.innerHTML = "";

  var hasGuessed = false;

  answers.forEach(function (ans, idx) {
    var option = document.createElement("div");
    option.className = "guess-option";
    option.textContent = ans;

    addTouchHandler(option, function () {
      if (hasGuessed) return;
      hasGuessed = true;

      // Visual feedback
      container.querySelectorAll(".guess-option").forEach(function (el) {
        el.classList.remove("selected");
      });
      option.classList.add("selected");

      // Send guess to screen
      airconsole.message(AirConsole.SCREEN, {
        action: "player_guess",
        answerId: idx,
      });
    });

    container.appendChild(option);
  });
}

function updateGuessTimer(timeLeft) {
  var timerEl = document.getElementById("guess-timer");
  if (timerEl) {
    timerEl.textContent = timeLeft + t("seconds");
  }
}

function disableGuessButtons() {
  document.querySelectorAll(".guess-option").forEach(function (el) {
    el.style.pointerEvents = "none";
    el.style.opacity = "0.7";
  });
}

// =========================
// Result View
// =========================
function showResult(data) {
  showView("view-result");

  var iconEl = document.getElementById("result-icon");
  var textEl = document.getElementById("result-text");
  var answerEl = document.getElementById("result-answer");
  var scoreEl = document.getElementById("result-score");

  if (data.isHost) {
    iconEl.textContent = "👑";
    textEl.textContent = t("youAreHost");
    textEl.className = "result-text";
    answerEl.textContent = t("theAnswerWas") + ": " + data.correctAnswer;
  } else if (data.correct) {
    iconEl.textContent = "🎉";
    textEl.textContent = t("correct");
    textEl.className = "result-text correct";
    answerEl.textContent = "+" + data.points + " " + t("points");
  } else {
    iconEl.textContent = "😢";
    textEl.textContent = t("wrong");
    textEl.className = "result-text wrong";
    answerEl.textContent = t("theAnswerWas") + ": " + data.correctAnswer;
  }

  scoreEl.textContent = t("score") + ": " + data.totalScore + " " + t("points");
}

// =========================
// Leaderboard View
// =========================
function showLeaderboard(data) {
  showView("view-leaderboard");

  document.getElementById("lb-rank").textContent = "#" + data.rank;
  document.getElementById("lb-rank-text").textContent =
    t("yourRank") + " #" + data.rank + " / " + data.totalPlayers;
  document.getElementById("lb-final-score").textContent =
    data.score + " " + t("points");
  document.getElementById("lb-stat").textContent =
    data.correctGuesses + "/" + data.totalRounds + " " + t("correct");

  // Play Again / Menu buttons only for master
  var playAgainBtn = document.getElementById("ctrl-play-again");
  var menuBtn = document.getElementById("ctrl-menu");

  playAgainBtn.textContent = t("playAgain");
  menuBtn.textContent = t("backToMenu");

  if (isMaster || myDeviceId === airconsole.getMasterControllerDeviceId()) {
    playAgainBtn.classList.remove("hidden");
    menuBtn.classList.remove("hidden");
  } else {
    playAgainBtn.classList.add("hidden");
    menuBtn.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var playAgainBtn = document.getElementById("ctrl-play-again");
  var menuBtn = document.getElementById("ctrl-menu");

  addTouchHandler(playAgainBtn, function () {
    airconsole.message(AirConsole.SCREEN, { action: "play_again" });
  });

  addTouchHandler(menuBtn, function () {
    airconsole.message(AirConsole.SCREEN, { action: "back_to_menu" });
  });
});

// =========================
// Auto-Detect Controller Language
// =========================
function autoDetectControllerLanguage() {
  var phoneLang = (navigator.language || navigator.userLanguage || "en")
    .substring(0, 2)
    .toLowerCase();
  var supported = ["en", "el", "es", "fr", "de", "tr", "ar"];
  if (supported.indexOf(phoneLang) !== -1 && phoneLang !== currentLanguage) {
    if (typeof loadLanguage === "function") {
      loadLanguage(phoneLang, function () {
        currentLanguage = phoneLang;
        updateLobbyView();
      });
    }
  }
}

// =========================
// Boot
// =========================
document.addEventListener("DOMContentLoaded", initController);
