import { useEffect, useRef } from "react";
import { HelpCircle, X } from "lucide-react";
import ProjectJourneyGuide from "@/components/portal/ProjectJourneyGuide";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequestFinderModalProps {
  open: boolean;
  onClose: () => void;
}

const RequestFinderModal = ({ open, onClose }: RequestFinderModalProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar"