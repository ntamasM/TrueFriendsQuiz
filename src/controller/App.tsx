import { ControllerProvider, useControllerState } from "./ControllerContext";
import { useControllerAirConsole } from "./useControllerAirConsole";
import Lobby from "./views/Lobby";
import Settings from "./views/Settings";
import CategoryVote from "./views/CategoryVote";
import PickQuestion from "./views/PickQuestion";
import AnswerQuestion from "./views/AnswerQuestion";
import GuessQuestion from "./views/GuessQuestion";
import Waiting from "./views/Waiting";
import HostWait from "./views/HostWait";
import Result from "./views/Result";
import Leaderboard from "./views/Leaderboard";

const PLAYER_COLORS = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];

function ControllerInner() {
  const ac = useControllerAirConsole();
  const state = useControllerState();
  const playerColor = PLAYER_COLORS[state.playerIndex % PLAYER_COLORS.length];

  let content;
  switch (state.view) {
    case "lobby":
      content = <Lobby ac={ac} />;
      break;
    case "settings":
      content = <Settings ac={ac} />;
      break;
    case "category-vote":
      content = <CategoryVote ac={ac} />;
      break;
    case "pick":
      content = <PickQuestion ac={ac} />;
      break;
    case "answer":
      content = <AnswerQuestion ac={ac} />;
      break;
    case "guess":
      content = <GuessQuestion ac={ac} />;
      break;
    case "waiting":
      content = <Waiting />;
      break;
    case "host-wait":
      content = <HostWait />;
      break;
    case "result":
      content = <Result />;
      break;
    case "leaderboard":
      content = <Leaderboard ac={ac} />;
      break;
  }

  return <div data-player-color={playerColor}>{content}</div>;
}

export default function ControllerApp() {
  return (
    <ControllerProvider>
      <ControllerInner />
    </ControllerProvider>
  );
}
