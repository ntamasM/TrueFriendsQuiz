# True Friends Quiz — Game Description

## Overview

**True Friends Quiz** is a multiplayer party quiz game built on the **AirConsole** platform. Players use their smartphones as controllers while the shared TV/monitor acts as the main game screen. The goal is to test how well friends know each other by answering personal questions about the current "host" player each round.

---

## AirConsole Platform Fundamentals

### Architecture

- **Screen** (`screen.html`): The main game display shown on TV/computer (device_id = 0, constant `AirConsole.SCREEN`).
- **Controller** (`controller.html`): Each player's smartphone interface. Controllers get dynamic device_ids (never hardcode them).
- **Communication**: Screen ↔ Controllers communicate via `airconsole.message(device_id, data)` and `airconsole.broadcast(data)`. Incoming messages are received in `airconsole.onMessage(from, data)`.
- **API Version**: `https://www.airconsole.com/api/airconsole-1.10.0.js` (include in both screen.html and controller.html).

### Key API Concepts

- **`setActivePlayers(max_players)`**: Called by the screen to assign player numbers (0-based, consecutive). Use `convertPlayerNumberToDeviceId(n)` and `convertDeviceIdToPlayerNumber(id)` to map between player numbers and device IDs.
- **`getNickname(device_id)`**: Get player display names.
- **`getProfilePicture(device_id)`**: Get player avatars.
- **Custom Device States**: Use `setCustomDeviceState(data)` to store per-device state readable by all devices. Useful for controlling which "view" each controller displays.
- **`onConnect(device_id)` / `onDisconnect(device_id)`**: Handle players joining/leaving dynamically.
- **`onReady(code)`**: Fired when AirConsole is initialized. The `code` is the join code.
- **`getControllerDeviceIds()`**: Returns all currently connected controller device IDs.

### Testing

- Use the AirConsole Simulator: `http://http.airconsole.com/simulator/#debug:http://YOUR_IP:PORT/`
- The simulator loads `screen.html` and `controller.html` from the root URL.
- For HTTPS testing, use ngrok or Cloudflare tunnels.

### Best Practices

- Use `<div>` with `touchstart`/`touchend` events on controllers (not `click`).
- Use `setActivePlayers()` at the start of each round.
- Show real player nicknames via `getNickname()` instead of "Player 1".
- Indicate on each controller which player they are (color, avatar).
- Handle player join/leave gracefully during gameplay.
- Preload images/assets early.

---

## Game Concept

### Core Idea

A social quiz game where friends answer questions **about each other**. Each round, one player is the **"host"** (the one being asked about). The host picks a question from a set of options, answers it privately, and then all other players try to guess the host's answer. Points are awarded for correct guesses.

### Player Count

- **Minimum**: 3 players (1 host + at least 2 guessers)
- **Recommended**: 3–8 players

---

## Game Flow

### Phase 1: Lobby / Language Selection (Screen)

**Screen displays:**

- Game title/logo: "True Friends Quiz"
- Language selection buttons (e.g., English, Greek, etc.)
- List of connected players (nicknames + avatars, updated live via `onConnect`/`onDisconnect`)
- "Start Game" button (enabled only when minimum players are connected)
- The AirConsole join code prominently displayed

**Controller displays:**

- "Welcome, [nickname]!" message
- Waiting status
- The master controller (first connected player) can trigger "Start Game" from their phone

**Logic:**

- Language selection sets the language for all questions and UI text.
- When "Start Game" is pressed, the screen calls `setActivePlayers()` to lock in the current players and assign player numbers.
- The game determines the round order: each player will be the host exactly once.

---

### Phase 2: Question Selection (Host Picks)

**How it works:**

- The game rotates through players. Each player gets one turn as the **host**.
- When it's a player's turn to be the host, the game presents **4 candidate questions** to the host's controller.
- The host **selects 1 question** out of the 4 that they want to play for this round.

**CRITICAL DESIGN RULE:** The questions are **about the host player**. The game does NOT display the question to the host on the main screen until after they've chosen. The host picks a question they find interesting and are comfortable answering. The other players will then try to guess the host's answer.

**Screen displays:**

- "[Host Nickname] is choosing a question..."
- Host's profile picture / avatar
- A timer (optional, to prevent stalling)
- Round counter (e.g., "Round 2/5")

**Host's Controller displays:**

- "Pick a question for this round!"
- 4 question cards to choose from (tap to select)
- Each question is phrased in the form: "What is [Host's name]'s favorite...?" or "What would [Host's name] do if...?"

**Other Players' Controllers display:**

- "Waiting for [Host Nickname] to pick a question..."

**Logic:**

- The screen sends 4 randomly selected questions (from the question bank, filtered by language) to the host's controller via `airconsole.message(hostDeviceId, { action: 'pick_question', questions: [...] })`.
- The host taps one question. The controller sends the choice back to the screen: `airconsole.message(AirConsole.SCREEN, { action: 'question_selected', questionId: X })`.

---

### Phase 3: Host Answers Privately

**Screen displays:**

- The selected question text (e.g., "What is Maria's biggest fear?")
- "Waiting for [Host Nickname] to answer..."
- Shows 4 possible answer options (A, B, C, D)

**Host's Controller displays:**

- The question text
- 4 answer options (A, B, C, D) as tappable buttons
- "Choose your answer!" prompt
- The host selects the TRUE answer about themselves

**Other Players' Controllers display:**

- "Waiting for [Host Nickname] to answer..."

**Logic:**

- The screen sends the question with its 4 answer options to the host's controller.
- The host selects their answer. This is sent back to the screen and stored but NOT revealed yet.
- `airconsole.message(AirConsole.SCREEN, { action: 'host_answer', answerId: Y })`

---

### Phase 4: Other Players Guess

**Screen displays:**

- The question text (e.g., "What is Maria's biggest fear?")
- 4 answer options (A, B, C, D) displayed prominently
- A countdown timer (e.g., 15–30 seconds)
- Indicators showing which players have answered and which haven't

**Host's Controller displays:**

- "You answered! Wait for your friends to guess..."
- (Optionally show which friends have submitted their guesses)

**Other Players' Controllers display:**

- The question text
- 4 answer options as tappable buttons
- "What do you think [Host Nickname] answered?"
- Timer countdown

**Logic:**

- The screen broadcasts the question and answers to all non-host controllers.
- Each player taps their guess. Sent to screen: `airconsole.message(AirConsole.SCREEN, { action: 'player_guess', answerId: Z })`
- When all players have answered OR timer runs out, proceed to reveal.

---

### Phase 5: Reveal & Scoring

**Screen displays:**

- The question text
- All 4 answer options, with the CORRECT answer (host's choice) highlighted
- Each player's guess shown (who picked what)
- Points awarded animation:
  - **Correct guess**: +100 points (or scaled by speed)
  - **Wrong guess**: 0 points
- Updated scoreboard/leaderboard sidebar
- "Next Round" transition after a few seconds

**All Controllers display:**

- "Correct! +100 points" or "Wrong! The answer was [X]"
- Their current score

**Logic:**

- Compare each player's guess against the host's stored answer.
- Update the score object.
- After the reveal animation, move to the next round (next host).

---

### Phase 6: Next Round

- Rotate to the next player as host.
- Go back to **Phase 2** for the new host.
- Repeat until all players have been the host once.

---

### Phase 7: Final Leaderboard

**Screen displays:**

- "Game Over!" title
- Final leaderboard with all players ranked by score
- Player nicknames, profile pictures, and scores
- Podium animation for top 3 (1st, 2nd, 3rd place)
- "Play Again" button
- "Back to Menu" button

**All Controllers display:**

- Their final rank and score
- "You finished #X!"
- Fun stat (e.g., "You got 4/5 correct!")

**Logic:**

- Sort players by score descending.
- Master controller can trigger "Play Again" (resets scores, reshuffles question pool) or "Back to Menu" (returns to Phase 1).

---

## Question Bank Structure

Questions are stored in a JSON structure, organized by language and category.

```json
{
  "en": {
    "categories": {
      "favorites": [
        {
          "id": 1,
          "question": "What is {name}'s favorite color?",
          "answers": ["Red", "Blue", "Green", "Yellow"]
        },
        {
          "id": 2,
          "question": "What is {name}'s favorite food?",
          "answers": ["Pizza", "Sushi", "Burger", "Pasta"]
        }
      ],
      "personality": [
        {
          "id": 50,
          "question": "What would {name} do if they won the lottery?",
          "answers": ["Travel the world", "Buy a house", "Invest it all", "Throw a huge party"]
        }
      ],
      "wouldYouRather": [...],
      "memories": [...]
    }
  },
  "el": {
    "categories": {
      "favorites": [...],
      ...
    }
  }
}
```

- `{name}` is replaced at runtime with the host player's nickname.
- Each question has exactly 4 answer options.
- Questions are randomized per game session; no repeats within a session.

---

## Data Model

### Game State (managed by Screen)

```javascript
gameState = {
  phase:
    "lobby" | "picking" | "answering" | "guessing" | "reveal" | "leaderboard",
  language: "en",
  players: [
    {
      deviceId: 3,
      playerNumber: 0,
      nickname: "Maria",
      score: 0,
      profilePic: "...",
    },
    // ...
  ],
  currentRound: 0, // Index of the current host in the players array
  totalRounds: 4, // Equal to number of players
  currentQuestion: null, // The selected question object for this round
  hostAnswer: null, // The host's chosen answer
  playerGuesses: {}, // { deviceId: answerId, ... }
  usedQuestionIds: [], // Track used questions to avoid repeats
  roundTimer: null, // Timer reference
};
```

### Messages Protocol

| Direction                    | Action              | Data                                             |
| ---------------------------- | ------------------- | ------------------------------------------------ |
| Screen → Host Controller     | `pick_question`     | `{ questions: [{id, question, answers}, ...] }`  |
| Host Controller → Screen     | `question_selected` | `{ questionId: number }`                         |
| Screen → Host Controller     | `answer_question`   | `{ question, answers }`                          |
| Host Controller → Screen     | `host_answer`       | `{ answerId: number }`                           |
| Screen → Guesser Controllers | `guess_question`    | `{ question, answers, hostNickname }`            |
| Guesser Controller → Screen  | `player_guess`      | `{ answerId: number }`                           |
| Screen → All Controllers     | `show_result`       | `{ correct, correctAnswer, points, totalScore }` |
| Screen → All Controllers     | `game_phase`        | `{ phase: string, ... }`                         |
| Controller → Screen          | `start_game`        | `{}`                                             |
| Controller → Screen          | `play_again`        | `{}`                                             |

---

## File Structure

```
TrueFriendsQuiz/
├── screen.html              # Main game screen (TV/monitor)
├── controller.html          # Phone controller interface
├── css/
│   ├── screen.css           # Screen styles
│   └── controller.css       # Controller styles
├── js/
│   ├── screen.js            # Screen game logic
│   ├── controller.js        # Controller game logic
│   └── questions.js         # Question bank data
├── assets/
│   ├── images/              # Logos, backgrounds, icons
│   └── sounds/              # Sound effects (optional)
└── .claude/
    └── game-description.md  # This file
```

---

## Technical Notes

1. **All game logic runs on the Screen** — controllers are "dumb" input/display devices.
2. **Never hardcode device IDs** — always use `setActivePlayers()` and player numbers.
3. **Use Custom Device States** to control which "view" each controller shows (e.g., `setCustomDeviceState({ view: 'waiting' })` on the screen to tell controllers what to display).
4. **Handle disconnections** — if a player disconnects mid-round, skip them or handle gracefully.
5. **Timer management** — use `setTimeout`/`setInterval` on the screen for round timers; sync display via messages.
6. **The host NEVER sees the question on the main screen before picking** — the 4 candidate questions are sent privately to the host's controller only.
7. **Player silencing** — call `setActivePlayers(N)` at round start and `setActivePlayers(0)` at round end to manage late joiners.
