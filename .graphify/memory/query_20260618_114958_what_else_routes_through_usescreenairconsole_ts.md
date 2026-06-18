---
type: "query"
date: "2026-06-18T11:49:58.955Z"
question: "What else routes through useScreenAirConsole.ts - is it doing too much?"
contributor: "graphify"
source_nodes: ["useScreenAirConsole.ts", "onMessage", "getHost()", "getGuessers()"]
---

# Q: What else routes through useScreenAirConsole.ts - is it doing too much?

## Answer

useScreenAirConsole.ts is an 831-line god-file that fans out to 11 of 22 graph communities. It imports from: Screen AirConsole Bootstrap (comm 9), Screen State and Shared Types (comm 5), Scoring and Leaderboard Logic (comm 4: getStreakBonus, getHostPointsPerCorrect), i18n Localization (comm 6: loadLanguage, loadQuestions), Lobby/Categories constants (comm 12), Controller Bootstrap (comm 8: SUPPORTED_LANGUAGES), comm 2 (LanguageCode), Category Vote View (comm 15), Answering/Guessing (comm 11: replaceNamePlaceholder), Background Music (comm 7), plus its own question/host helpers (comm 13). It holds 8 AirConsole lifecycle handlers (onReady, onConnect, onDisconnect, onAdShow, onAdComplete, onPause, onResume, onMessage) and an 11-case onMessage switch (start_game, select_language, question_selected, host_answer, player_guess, play_again, back_to_menu, toggle_music, category_vote, category_selected, emoji_reaction). It mixes connection lifecycle, i18n loading, full game state machine, question selection, scoring, ad/pause handling, music control, and message routing. The clustering split its helpers (getHost/getGuessers in comm 13) from the hook itself (comm 9), which is why community labels are fuzzy. It is the structural single point of coupling for the screen side.

## Source Nodes

- useScreenAirConsole.ts
- onMessage
- getHost()
- getGuessers()