import { ScreenProvider, useScreenState } from "./ScreenContext";
import { useScreenAirConsole } from "./useScreenAirConsole";
import Lobby from "./phases/Lobby";
import Picking from "./phases/Picking";
import Answering from "./phases/Answering";
import Guessing from "./phases/Guessing";
import Reveal from "./phases/Reveal";
import Leaderboard from "./phases/Leaderboard";

function ScreenInner() {
  const { ac } = useScreenAirConsole();
  const state = useScreenState();

  switch (state.phase) {
    case "lobby":
      return <Lobby ac={ac} />;
    case "picking":
      return <Picking />;
    case "answering":
      return <Answering />;
    case "guessing":
      return <Guessing />;
    case "reveal":
      return <Reveal />;
    case "leaderboard":
      return <Leaderboard />;
  }
}

export default function ScreenApp() {
  return (
    <ScreenProvider>
      <ScreenInner />
    </ScreenProvider>
  );
}
