import { ClipboardCheck, ExternalLink, Globe2, Headset, Inbox, ListChecks, Mail, Route } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const { language, toggleLanguage, copy } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const supportRef = use