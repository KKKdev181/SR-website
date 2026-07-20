import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Cloud,
  Database,
  GitBranch,
  KeyRound,
  Network,
  RotateCcw,
  SearchCheck,
  Settings,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { requests } from "@/data/requests";
import {
  matchRequests,
  type RequestArea,