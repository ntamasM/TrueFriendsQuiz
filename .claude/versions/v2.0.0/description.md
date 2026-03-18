# True Friends Quiz — v2.0.0

**Status:** Current / Released
**Date Snapshot:** March 2026
**Type:** Full React rewrite (migration from vanilla JS v1.x)

---

## Overview

v2.0.0 is a complete architectural rewrite of True Friends Quiz, migrating from vanilla HTML/CSS/JS to a **React + TypeScript** stack with Vite as the build tool. The core game concept remains the same: a multiplayer social quiz where players answer questions about the current "host" player and others try to guess their answers.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (build tool & dev server)
- **AirConsole API v1.10.0**
- **canvas-confetti** (visual effects on Leaderboard)
- **pnpm** (package manager)

---

## Architecture

### Dual Entry Points

- **`src/screen/`** — TV/monitor display (game logic hub)
- **`src/controller/`** — Phone controller (player input/display)

### Screen Phases (React components)

| Phase       | Component         | Description                                                              |
| ----------- | ----------------- | ------------------------------------------------------------------------ |
| Lobby       | `Lobby.tsx`       | Player waiting room, game master settings, language selection            |
| Picking     | `Picking.tsx`     | Host selects 1 of 4 questions on their phone; screen shows waiting state |
| Answering   | `Answering.tsx`   | Host privately answers the chosen question                               |
| Guessing    | `Guessing.tsx`    | All other players guess the host's answer with a countdown timer         |
| Reveal      | `Reveal.tsx`      | Correct answer revealed, scores updated, per-player results shown        |
| Leaderboard | `Leaderboard.tsx` | Final standings with podium, confetti + fireworks on mount               |

### Shared Modules (`src/shared/`)

- **`types.ts`** — Shared TypeScript interfaces (GameState, Player, Question, etc.)
- **`constants.ts`** — Game constants (min players, timer defaults, etc.)
- **`styles/`** — Shared CSS (`screen.css`, `controller.css`)
- **`hooks/`** — Custom React hooks
- **`i18n/`** — Internationalization system with locale files
- **`components/`** — Shared UI components

### Context & State

- **`ScreenContext.tsx`** — React context for game state (screen side)
- **`ControllerContext.tsx`** — React context for controller state
- **`gameLogic.ts`** — Core game logic (phase transitions, scoring)
- **`useScreenAirConsole.ts`** / **`useControllerAirConsole.ts`** — AirConsole integration hooks
- **`musicManager.ts`** — Background music control (shuffle, pause/resume)

---

## Features

### Game Mechanics

- **Minimum 3 players**, recommended 3–8
- **Host rotation** — each player is the host exactly once per game
- **4 candidate questions** sent privately to the host's phone to pick from
- **Configurable answer time** (10s–60s)
- **Configurable rounds per player** (1–5)
- **Point scoring** — correct guesses earn points

### Question Bank

- **200+ questions per language**
- **7 languages**: English, Greek, Spanish, French, German, Turkish, Arabic
- **Multiple categories**: Favorites, Personality & Habits, Would You Rather, Deep & Personal, Fun & Random, Experiences & Dreams, Deep & Spicy
- **Category toggles** — game master can enable/disable categories before starting
- **`{name}` interpolation** — question text replaces `{name}` with the host's nickname at runtime
- Questions are shown with **category badges** in the UI

### UI & Visual Feedback

- **Confetti + fireworks** on Leaderboard component mount (via canvas-confetti)
- **Vibration feedback** on host actions and winner reveal (mobile haptics)
- **Category badges** displayed on question cards
- **Podium display** for top 3 players on final leaderboard
- **Player avatars** from AirConsole profile pictures

### Settings (Game Master)

- Language selector
- Rounds per player slider
- Answer time slider
- Music toggle (on/off)
- Category enable/disable toggles

### Music

- Background music with shuffle playback
- Auto-advancement between tracks
- Pause/resume support
- Toggle from settings panel

---

## File Structure (src/)

```
src/
├── screen/
│   ├── App.tsx               # Screen app root
│   ├── ScreenContext.tsx     # Game state context
│   ├── gameLogic.ts          # Core game logic
│   ├── main.tsx              # Screen entry point
│   ├── musicManager.ts       # Music management
│   ├── useScreenAirConsole.ts# AirConsole hook (screen)
│   └── phases/
│       ├── Lobby.tsx
│       ├── Picking.tsx
│       ├── Answering.tsx
│       ├── Guessing.tsx
│       ├── Reveal.tsx
│       └── Leaderboard.tsx
├── controller/
│   ├── App.tsx               # Controller app root
│   ├── ControllerContext.tsx # Controller state context
│   ├── main.tsx              # Controller entry point
│   ├── useControllerAirConsole.ts
│   └── views/                # Controller view components per phase
└── shared/
    ├── types.ts
    ├── constants.ts
    ├── airconsole.d.ts
    ├── styles/
    │   ├── screen.css
    │   └── controller.css
    ├── hooks/
    ├── i18n/
    │   └── locales/
    └── components/
```

---

## Known Limitations / Areas for Improvement

- Visual polish is functional but not highly refined (as noted in AirConsole review)
- No in-game feedback on progression beyond point totals
- No player agency over question categories during gameplay (only pre-game toggles)
- Competition/achievement feel could be stronger
- No category voting or selection mechanic mid-game

---

## AirConsole Senior Producer Feedback (Received March 2026)

> "Overall, we think the core idea works well. It's a fun concept, especially when played with friends, and it creates some great social moments."
>
> Suggestions:
>
> 1. Visuals could benefit from additional polish to make the game feel more refined and engaging.
> 2. The overall experience could feel a bit more "gamey" — stronger feedback, progression, or playful elements that enhance competition/achievement.
> 3. Let players choose or influence the category of questions, giving them more control over the experience.

This feedback drives the **v2.1.0-beta** plan.
