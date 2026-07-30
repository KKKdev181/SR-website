import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/project-journey-roadmap.css";
import "./styles/project-journey-overrides.css";
import "./i18n/legacyToolLocalization";
import "./utils/projectJourneyScrollSpy";
import "./utils/jiraIframe";

createRoot(document.getElementById("root")!).render(<App />);
