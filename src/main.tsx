import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/project-journey-roadmap.css";
import "./i18n/legacyToolLocalization";
import "./utils/projectJourneyScrollSpy";

createRoot(document.getElementById("root")!).render(<App />);
