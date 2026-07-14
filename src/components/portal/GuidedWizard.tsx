import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import RequestCard from "./RequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ServiceRequest } from "@/data/requests";

const steps = [
  {
    question: "What do you