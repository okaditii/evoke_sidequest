import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AppStateProvider } from "./state/AppState";
import "./styles/theme.css";

const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(fonts);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>,
);
