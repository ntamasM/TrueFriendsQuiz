import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ScreenApp from "./App";
import "../shared/styles/screen.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreenApp />
  </StrictMode>,
);
