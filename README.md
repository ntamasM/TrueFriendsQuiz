# True Friends Quiz

A multiplayer party quiz game built for [AirConsole](https://www.airconsole.com/) where players test how well they know each other.

## How It Works

1. Players join the game using their phones as controllers.
2. The **game master** (first player to join) configures settings — language, rounds per player, and answer time.
3. Each round, one player becomes the **host**. They pick a question and answer it privately.
4. All other players **guess** what the host answered.
5. Correct guesses earn points. The player with the most points wins!

## Features

- **7 Languages**: English, Greek, Spanish, French, German, Turkish, Arabic
- **200 Questions per language** — covering favorites, personality, hypotheticals, and more
- **Configurable settings** — rounds per player (1–5), answer time (10s–60s)
- **Category toggles** — enable or disable question categories per game
- **Game master controls** — settings and game start managed from the master controller
- **Music toggle** — background music on/off from settings
- **Leaderboard & scoring** with podium display

## Project Structure

```
├── screen.html              # TV/main screen (game logic & display)
├── controller.html          # Phone controller (player input)
├── css/
│   ├── screen.css           # Screen styles
│   └── controller.css       # Controller styles
├── js/
│   ├── screen.js            # Screen game logic
│   └── controller.js        # Controller logic
├── languages/
│   ├── loader.js            # Dynamic language loader
│   ├── en/                  # English
│   │   ├── questions.js     # Question bank (200 questions)
│   │   └── ui-text.js       # UI text translations
│   ├── el/                  # Greek
│   ├── es/                  # Spanish
│   ├── fr/                  # French
│   ├── de/                  # German
│   ├── tr/                  # Turkish
│   └── ar/                  # Arabic
├── Assets/                  # Logo & music files
├── app/                     # Website pages (not part of the game zip)
│   ├── index.html           # How to Play landing page
│   ├── about.html           # About page
│   ├── css/shared.css       # Shared website styles
│   └── js/components.js     # Nav & footer components
├── nginx.conf               # Nginx config for deployment
└── Dockerfile               # Docker container setup
```

## Deployment

The project is split into **game files** (root) and **app/website files** (`app/`).

- **Game zip** (for AirConsole): Include only root-level game files (`screen.html`, `controller.html`, `css/`, `js/`, `languages/`, `Assets/`). Exclude `app/`, `nginx.conf`, `Dockerfile`, `Releases/`, `README.md`, `LICENSE`.
- **Website** (Coolify/Docker): The Dockerfile + nginx.conf serve `app/index.html` at `/` and `app/about.html` at `/about.html`, while game files remain at their original paths.

## Development

### Prerequisites

- A local HTTP server (e.g., Python's `http.server`)
- [ngrok](https://ngrok.com/) for tunneling (required for AirConsole testing)

### Running Locally

1. Start a local server:

   ```bash
   python -m http.server 8080
   ```

2. Start ngrok tunnel:

   ```bash
   ngrok http 8080
   ```

3. Open the AirConsole simulator at `https://www.airconsole.com/simulator/` and enter your ngrok URL.

## Tech Stack

- **AirConsole API** v1.10.0
- Vanilla JavaScript, HTML, CSS
- Nginx (Alpine) via Docker
- No build tools or frameworks

## ☕ Support the Project

If this project has been helpful or fun, consider supporting its development!

[![Support Me](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-yellow?logo=buy-me-a-coffee)](https://ntamadakis.gr/support-me)

- ⭐ **Star** this repository on GitHub
- 🐛 **Report bugs** or suggest features via [Issues](../../issues)
- 💬 **Spread the word** to friends who love party games

## License

This project is open source and available under the [MIT License](LICENSE).
