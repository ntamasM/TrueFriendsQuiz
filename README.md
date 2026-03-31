# True Friends Quiz

A multiplayer party quiz game built for [AirConsole](https://www.airconsole.com/) where players test how well they know each other.

## How It Works

1. Players join the game using their phones as controllers.
2. The **game master** (first player to join) configures settings — language, rounds per player, and answer time.
3. Each round, one player becomes the **host**. They vote on a category group, pick a question, and answer it privately.
4. All other players **guess** what the host answered.
5. Correct guesses earn points. The first player to guess correctly gets a **speed bonus**. The player with the most points wins!

## Features

- **7 Languages**: English, Greek, Spanish, French, German, Turkish, Arabic
- **480+ Questions per language** across 20 categories — favorites, personality, hypotheticals, deep personal, spicy, and more
- **Category voting** — the host votes on a category group (Fun, Deep, Dilemma, Spicy) before picking a question
- **Free & Pro categories** — 9 free categories + 11 Pro (Hero) categories for AirConsole Hero subscribers
- **Configurable settings** — rounds per player (1–5), answer time (10s–60s)
- **Category toggles** — enable or disable question categories per game
- **Game master controls** — settings and game start managed from the master controller
- **Music toggle** — background music on/off from settings
- **Speed bonus** — first correct guesser earns +20 bonus points
- **Streak tracking** — consecutive correct guesses are tracked with streak indicators
- **Animated phase transitions** — smooth transitions between game phases
- **Timer urgency effects** — visual and audio cues as the timer runs low
- **Confetti & celebrations** — confetti effects on the leaderboard
- **Emoji reactions** — players can send emoji reactions during the game
- **Per-player stats** — detailed stats shown at the end (streaks, speed bonuses, accuracy)
- **Trophy crown** — the leading player gets a crown indicator
- **Hot seat glow** — visual highlight on the current host
- **Mini leaderboard** — score summary shown after each reveal phase
- **Controller color themes** — personalized color themes on each player's phone
- **Vibration feedback** — haptic feedback on mobile controllers for key actions
- **Leaderboard & scoring** with podium display and score pop-ups

## Project Structure

```
├── screen.html                # TV/main screen entry point
├── controller.html            # Phone controller entry point
├── app.html                   # Website (How to Play / About) entry point
├── src/
│   ├── screen/                # Screen (TV) — game logic & display
│   │   ├── ScreenContext.tsx  # Screen state & AirConsole messaging
│   │   ├── gameLogic.ts       # Core game state machine
│   │   └── phases/            # Phase components
│   │       ├── Lobby.tsx
│   │       ├── Picking.tsx    # Category vote + question pick
│   │       ├── Answering.tsx
│   │       ├── Guessing.tsx
│   │       ├── Reveal.tsx
│   │       └── Leaderboard.tsx
│   ├── controller/            # Controller (phone) — player input
│   │   ├── ControllerContext.tsx
│   │   └── views/             # View components
│   │       ├── Lobby.tsx
│   │       ├── Settings.tsx
│   │       ├── CategoryVote.tsx
│   │       ├── PickQuestion.tsx
│   │       ├── AnswerQuestion.tsx
│   │       ├── GuessQuestion.tsx
│   │       ├── HostWait.tsx
│   │       ├── Waiting.tsx
│   │       ├── Result.tsx
│   │       └── Leaderboard.tsx
│   ├── shared/                # Shared code
│   │   ├── types.ts           # Game state & message types
│   │   ├── constants.ts       # Categories, languages, vote groups
│   │   ├── styles/            # Shared CSS
│   │   └── i18n/
│   │       └── locales/       # 7 language packs (en, el, es, fr, de, tr, ar)
│   └── app/                   # Website pages
│       ├── App.tsx            # Router (How to Play / About)
│       └── pages/
│           └── AboutPage.tsx
├── public/                    # Static assets (logo, music)
├── vite.config.ts             # Vite build config (multi-page)
├── nginx.conf                 # Nginx config for deployment
└── Dockerfile                 # Docker container setup
```

## Deployment

The project is split into **game files** and **website files**, all built with Vite.

- **Game zip** (for AirConsole): Run `pnpm zip` to build and package only the game files (`screen.html`, `controller.html`, and bundled assets).
- **Website** (Coolify/Docker): The Dockerfile + nginx.conf serve the built `app.html` and game files.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) package manager
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) or [ngrok](https://ngrok.com/) for AirConsole testing

### Running Locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the dev server:

   ```bash
   pnpm dev
   ```

3. Start a tunnel (e.g., Cloudflare):

   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

4. Open the AirConsole simulator at `https://www.airconsole.com/simulator/` and enter your tunnel URL.

### Building

```bash
pnpm build
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tool & dev server
- **AirConsole API** v1.10.0
- **canvas-confetti** — celebration effects
- **pnpm** — package manager
- Nginx (Alpine) via Docker

## ☕ Support the Project

If this project has been helpful or fun, consider supporting its development!

[![Support Me](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-yellow?logo=buy-me-a-coffee)](https://ntamadakis.gr/support-me)

- ⭐ **Star** this repository on GitHub
- 🐛 **Report bugs** or suggest features via [Issues](../../issues)
- 💬 **Spread the word** to friends who love party games

## License

This project is open source and available under the [MIT License](LICENSE).
