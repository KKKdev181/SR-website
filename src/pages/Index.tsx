import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/portal/Header";
import RequestCard from "@/components/portal/RequestCard";
import EmptyState from "@/components/portal/EmptyState";
import Footer from "@/components/portal/Footer";
import Tool