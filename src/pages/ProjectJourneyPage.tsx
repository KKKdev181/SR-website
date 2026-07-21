import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, ListChecks, Rocket, ServerCog } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProjectJourney } from "@/utils/projectJourneyLocalization";
import "@/styles/project-journey-page.css";
import "@/styles/project-journey-language.css";

const stages = [
  { id: "prep-1", en: "Preparation", ar: "التحضير", icon: ListChecks },
  { id: "devqa-1", en: "Dev/QA", ar: "Dev/QA", icon: ServerCog },
  { id: "staging-prod-1", en: "Staging & Production", ar: "Staging وProduction",