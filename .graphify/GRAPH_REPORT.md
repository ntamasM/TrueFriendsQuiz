# Graph Report - .  (2026-06-18)

## Corpus Check
- Corpus is ~32.389 words - fits in a single context window. You may not need a graph.

## Summary
- 188 nodes · 405 edges · 20 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output
- Edge kinds: imports: 123 · imports_from: 112 · contains: 101 · references: 30 · conceptually_related_to: 18 · calls: 12 · method: 8 · rationale_for: 1

## God Nodes (most connected - your core abstractions)
1. `LanguageCode` - 20 edges
2. `loadUiText()` - 18 edges
3. `UiText` - 18 edges
4. `useControllerState()` - 13 edges
5. `True Friends Quiz` - 11 edges
6. `MusicManager` - 10 edges
7. `useScreenState()` - 9 edges
8. `loadLanguage()` - 6 edges
9. `True Friends Quiz Logo` - 6 edges
10. `replaceNamePlaceholder()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Controller Language Independence` --conceptually_related_to--> `controller.html (Phone Controller Entry)`  [INFERRED]
  Releases/notes/v2.1.2-release-notes.md → controller.html
- `44px Tap Targets` --conceptually_related_to--> `controller.html (Phone Controller Entry)`  [INFERRED]
  Releases/notes/v2.1.2-release-notes.md → controller.html
- `Background Music` --conceptually_related_to--> `True Friends Quiz`  [INFERRED]
  Releases/notes/v1.2.0-release-notes.md → README.md
- `Dynamic Language Loader` --conceptually_related_to--> `7-Language i18n`  [INFERRED]
  Releases/notes/v1.2.0-release-notes.md → README.md
- `PEGI 12 / AirConsole Compliance` --conceptually_related_to--> `Free & Pro Categories`  [INFERRED]
  Releases/notes/v2.1.2-release-notes.md → README.md

## Hyperedges (group relationships)
- **AirConsole Dual-Entry Runtime (Screen + Controller + API)** — screenhtml_screenentry, controllerhtml_controllerentry, controllerhtml_airconsoleapi [EXTRACTED 0.90]
- **v2.1.2 AirConsole Compliance Pass** — v212_pegi12compliance, v212_controllerlangindependence, v212_taptargets, controllerhtml_loadingspinner [EXTRACTED 0.85]
- **Round Gameplay Flow (Master, Host, Voting, Speed Bonus)** — readme_gamemaster, readme_host, readme_categoryvoting, readme_speedbonus [EXTRACTED 0.85]

## Communities

### Community 0 - "Docs, Deps & Game Design"
Cohesion: 0.10
Nodes (26): App Metrics Analytics Script, app.html (Website Entry), AirConsole API v1.10.0, controller.html (Phone Controller Entry), Inline Loading Spinner, canvas-confetti, React 19, TypeScript (+18 more)

### Community 1 - "Marketing Website Pages"
Cohesion: 0.15
Nodes (2): Page, HeaderProps

### Community 2 - "Controller Answer/Wait Views"
Cohesion: 0.23
Nodes (5): useControllerState(), LanguageCode, UiText, AnswerQuestionProps, WAITING_KEY_MAP

### Community 3 - "Controller State & Lobby"
Cohesion: 0.18
Nodes (8): ControllerAction, ControllerDispatchContext, ControllerState, ControllerStateContext, initialControllerState, useControllerDispatch(), ControllerView, LobbyProps

### Community 4 - "Scoring & Leaderboard Logic"
Cohesion: 0.24
Nodes (7): buildRankGroups(), computeRankedPlayers(), getHostPointsPerCorrect(), getStreakBonus(), RankedPlayer, RankGroup, Question

### Community 5 - "Screen State & Shared Types"
Cohesion: 0.21
Nodes (9): initialScreenState, ScreenAction, ScreenDispatchContext, ScreenStateContext, CategoryDef, ControllerToScreenMessage, PickingSubStep, Player (+1 more)

### Community 6 - "i18n Localization Loading"
Cohesion: 0.27
Nodes (8): detectBrowserLanguage(), isValidLanguage(), loadLanguage(), loadQuestions(), loadUiText(), questionsCache, uiTextCache, SettingsProps

### Community 7 - "Background Music Manager"
Cohesion: 0.31
Nodes (2): MusicManager, TRACKS

### Community 8 - "Controller AirConsole Bootstrap"
Cohesion: 0.22
Nodes (5): PLAYER_COLORS, ControllerProvider(), useControllerAirConsole(), SUPPORTED_LANGUAGES, ScreenToControllerMessage

### Community 9 - "Screen AirConsole Bootstrap"
Cohesion: 0.25
Nodes (3): ScreenProvider(), useScreenState(), useScreenAirConsole()

### Community 10 - "Logo SVG Artwork"
Cohesion: 0.32
Nodes (8): Abstract Vector Glyph Shapes, True Friends Quiz Logo (SVG), Blue Glyph (#39419F), App Branding Identity (SVG), Orange Background (#F7971E), Purple Glyph (#9D3BA2), Red Glyph (#C43725), Rounded Square Badge (1124x1124)

### Community 11 - "Answering & Guessing Phases"
Cohesion: 0.25
Nodes (4): ANSWER_CLASSES, ANSWER_CLASSES, FloatingEmoji, replaceNamePlaceholder()

### Community 12 - "Lobby Phase & Categories"
Cohesion: 0.29
Nodes (5): LobbyProps, CATEGORY_VOTE_GROUPS, CATEGORY_VOTE_LABELS, LANGUAGE_NAMES, QUESTION_CATEGORIES

### Community 13 - "Question Selection & Host Logic"
Cohesion: 0.29
Nodes (5): getQuestionsForGroup(), getRandomQuestions(), shuffleArray(), ScreenState, useScreenDispatch()

### Community 14 - "Logo Branding (PNG)"
Cohesion: 0.38
Nodes (7): Game Branding / Identity, Friendship Party Quiz Theme, Playful Rounded Typography, Quiz Badge / Subtitle, True Friends Quiz Logo, Vibrant Color Palette, Wordmark: True Friends

### Community 15 - "Category Vote View"
Cohesion: 0.33
Nodes (4): CategoryVoteOption, CategoryVoteProps, ICONS, options

### Community 16 - "Guess Question View"
Cohesion: 0.50
Nodes (2): GuessQuestionProps, REACTION_EMOJIS

### Community 17 - "Controller Leaderboard View"
Cohesion: 0.67
Nodes (1): LeaderboardProps

### Community 18 - "Pick Question View"
Cohesion: 0.67
Nodes (1): PickQuestionProps

### Community 19 - "AirConsole Type Defs"
Cohesion: 1.00
Nodes (1): AirConsole

## Knowledge Gaps
- **46 isolated node(s):** `Page`, `HeaderProps`, `PLAYER_COLORS`, `ControllerState`, `initialControllerState` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Marketing Website Pages`** (2 nodes): `Page`, `HeaderProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Background Music Manager`** (2 nodes): `MusicManager`, `TRACKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Guess Question View`** (2 nodes): `GuessQuestionProps`, `REACTION_EMOJIS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Controller Leaderboard View`** (1 nodes): `LeaderboardProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pick Question View`** (1 nodes): `PickQuestionProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AirConsole Type Defs`** (1 nodes): `AirConsole`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MusicManager` connect `Background Music Manager` to `Question Selection & Host Logic`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `LanguageCode` connect `Controller Answer/Wait Views` to `Controller AirConsole Bootstrap`, `Category Vote View`, `Guess Question View`, `Controller Leaderboard View`, `Controller State & Lobby`, `Pick Question View`, `i18n Localization Loading`, `Answering & Guessing Phases`, `Scoring & Leaderboard Logic`, `Lobby Phase & Categories`, `Screen AirConsole Bootstrap`, `Question Selection & Host Logic`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `loadUiText()` connect `i18n Localization Loading` to `Controller Answer/Wait Views`, `Category Vote View`, `Guess Question View`, `Controller Leaderboard View`, `Controller State & Lobby`, `Pick Question View`, `Answering & Guessing Phases`, `Scoring & Leaderboard Logic`, `Lobby Phase & Categories`, `Screen AirConsole Bootstrap`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `Page`, `HeaderProps`, `PLAYER_COLORS` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Docs, Deps & Game Design` be split into smaller, more focused modules?**
  _Cohesion score 0.09846153846153846 - nodes in this community are weakly interconnected._