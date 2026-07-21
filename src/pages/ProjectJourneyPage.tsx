import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, ListChecks, Rocket, ServerCog } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ProjectJourneyChecklist from "@/components/portal/ProjectJourneyChecklist";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeProjectJourney } from "@/utils/projectJourneyLocalization";
import "@/styles/project-jour