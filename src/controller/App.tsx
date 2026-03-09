import { ControllerProvider, useControllerState } from "./ControllerContext";
import { useControllerAirConsole } from "./useControllerAirConsole";
import Lobby from "./views/Lobby";
import Settings from "./views/Settings";
import PickQuestion from "./views/PickQuestion";
import AnswerQuestion from "./views/AnswerQuestion";
import GuessQuestion from "./views/GuessQuestion";
import Waiting from "./views/Waiting";
import HostWait from "./views/HostWait";
import Result from "./views/Result";
import Leaderboard from "./views/Leaderboard";

function ControllerInner() {
  const ac = useControllerAirConsole();
  const state = useControllerState();

  switch (state.view) {
    case "lobby":
      return <Lobby ac={ac} />;
    case "settings":
      return <Settings ac={ac} />;
    case "pick":
      return <PickQuestion ac={ac} />;
    case "answer":
      return <AnswerQuestion ac={ac} />;
    case "guess":
      return <GuessQuestion ac={ac} />;
    case "waiting":
      return <Waiting />;
    case "host-wait":
      return <HostWait />;
    case "result":
      return <Result />;
    case "leaderboard":
      return <Leaderboard ac={ac} />;
  }
}

export default function ControllerApp() {
  return (
    <ControllerProvider>
      <ControllerInner />
    </ControllerProvider>
  );
}
