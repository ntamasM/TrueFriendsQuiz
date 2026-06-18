---
type: "query"
date: "2026-06-18T11:48:18.509Z"
question: "Why does MusicManager connect Background Music Manager to Question Selection & Host Logic?"
contributor: "graphify"
source_nodes: ["MusicManager", "useScreenAirConsole.ts"]
---

# Q: Why does MusicManager connect Background Music Manager to Question Selection & Host Logic?

## Answer

MusicManager (community 7) has exactly one cross-community edge: useScreenAirConsole.ts (community 13) imports it. The AST recorded the edge direction backwards - the real dependency is useScreenAirConsole -> musicManager. useScreenAirConsole.ts is the central AirConsole game orchestrator and calls musicManager at lifecycle/game-flow events: onAdShow/onPause => pause, onAdComplete/onResume => resume, start_game => play, back_to_menu => stop, toggle_music => play/stop. Music is not coupled to question-selection logic per se; both just live inside the same orchestrator file, which is the true hub. The bridge is an artifact of MusicManager being a self-contained leaf cluster whose single tether to the app is that orchestrator.

## Source Nodes

- MusicManager
- useScreenAirConsole.ts