import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ModoProvider } from "./context/ModoProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ModoProvider>
        <App />
      </ModoProvider>
    </BrowserRouter>
  </StrictMode>,
);
