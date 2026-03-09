import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ControllerApp from "./App";
import "../shared/styles/controller.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ControllerApp />
  </StrictMode>,
);
