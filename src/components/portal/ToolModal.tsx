import { useEffect, useRef } from "react";
import { HelpCircle, Layers3, WandSparkles, X } from "lucide-react";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import CatalogRequestFinder from "@/components/portal/CatalogRequestFinder";
import GuidedWizard from "@/components/portal/GuidedWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/standalone-tools.css";
import "@/styles/tool-localization.css";
import "@/styles/project-journey-redesign.css";
import "@/styles/tool-modal.css";
import "@/styles/checklist-modal-layout.css";

export type PortalTool = "