import http from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";

const PORT = Number(process.env.TD_AI_PORT || 8084);
const BASE_URL = (process.env.TD_AI_BASE_URL || "https://llms.elm.sa").replace(/\/+$/, "");
const API_KEY = process.env.TD_AI_API_KEY || "";
const MODELS_PATH = process.env.TD_AI_MODELS_PATH || "/v1/models";
const CHAT_PATH = process.env.TD_AI_CHAT_PATH || "/v1/chat/completions";
const ALLOWED_ORIGIN = process.env.TD_AI_ALLOWED_ORIGIN || "*";
const FIXED_MODEL = "gpt-oss-120b";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");

const KNOWLEDGE_FILES = [
  "src/data/requestRows1.ts",
  "src/data/requestRows2.ts",
  "src/data/requestRows3.ts",
  "src/data/requestRows4.ts",
  "src/data/portalCategories.ts",
  "src/data/portalSubcategories.ts",
  "src/data/requestSubcategories.ts",
  "src/data/departmentAssignments.ts",
  "src/components/portal/ProjectJourneyChecklist.tsx",
  "src/pages/ProjectJourneyPage.tsx",
  "src/pages/TpmDirectoryPage.tsx",
];

const DEPARTMENT_ASSIGNMENTS_FILE = resolve(
  REPO_ROOT,
  "src/data/departmentAssignments.ts",
);

const parseDepartmentAssignments = () => {
  try {
    const source = readFileSync(DEPARTMENT_ASSIGNMENTS_FILE, "utf8");
    const matches = [...source.matchAll(
      /\{\s*department:\s*"([^"]+)",\s*tpms:\s*\[([^\]]*)\],\s*serviceCount:\s*(\d+)\s*\}/g,
    )];

    return matches.map((match) => ({
      department: match[1],
      tpms: [...match[2].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
      serviceCount: Number(match[3]),
    }));
  } catch (error) {
    console.warn(
      "Department assignments could not be loaded.",
      error?.message || error,
    );
    return [];
  }
};

const departmentAssignments = parseDepartmentAssignments();

const tpmDirectoryContext = departmentAssignments.length
  ? departmentAssignments
      .map(
        (item) =>
          `Department: ${item.department} | TPM: ${item.tpms.join(", ")} | Services: ${item.serviceCount}`,
      )
      .join("\n")
  : "TPM directory data is unavailable.";

const knowledgeChunks = KNOWLEDGE_FILES.flatMap((relativePath) => {
  try {
    const text = readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
    const cleaned = text.replace(/\r/g, "");
    const chunks = [];

    for (let index = 0; index < cleaned.length; index += 1800) {
      chunks.push({
        source: relativePath,
        text: cleaned.slice(index, index + 2200),
      });
    }

    return chunks;
  } catch (error) {
    console.warn(`AI knowledge file could not be loaded: ${relativePath}`, error?.message || error);
    return [];
  }
});

const tokenizeForKnowledge = (value = "") =>
  normalizeIntentText(value)
    .replace(/[^a-z0-9\u0600-\u06ff/]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const retrieveWebsiteKnowledge = (query) => {
  const tokens = Array.from(new Set(tokenizeForKnowledge(query)));
  if (tokens.length === 0) return [];

  return knowledgeChunks
    .map((chunk) => {
      const haystack = normalizeIntentText(chunk.text);
      let score = 0;

      for (const token of tokens) {
        if (haystack.includes(token)) score += token.length >= 5 ? 3 : 1;
      }

      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

const normalizeIntentText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();

const json = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(body);
};

const readJson = async (req) => {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error("Request body is too large.");
  }
  return raw ? JSON.parse(raw) : {};
};

const upstream = async (path, init = {}) => {
  if (!API_KEY) throw new Error("TD_AI_API_KEY is not configured on the server.");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      payload?.error ||
      `Upstream returned HTTP ${response.status}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return payload;
};

const parseModels = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.models)
        ? payload.models
        : [];

  return list
    .map((item) => {
      if (typeof item === "string") return { id: item, label: item };
      const id = item?.id || item?.name || item?.model;
      if (!id) return null;
      return {
        id: String(id),
        label: String(item?.display_name || item?.label || id),
      };
    })
    .filter(Boolean);
};

const extractAssistantText = (payload) =>
  payload?.choices?.[0]?.message?.content ||
  payload?.choices?.[0]?.text ||
  payload?.output_text ||
  payload?.response ||
  "";

const parseAiResult = (text) => {
  if (typeof text !== "string") return { answer: "", recommendations: [] };

  const cleaned = text
    .trim()
    .replace(/^\`\`\`json\s*/i, "")
    .replace(/\`\`\`$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      answer: String(parsed.answer || parsed.summary || ""),
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.slice(0, 5)
        : [],
    };
  } catch {
    return { answer: cleaned, recommendations: [] };
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    return res.end();
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      return json(res, 200, {
        ok: true,
        configured: Boolean(API_KEY),
        provider: BASE_URL,
        model: FIXED_MODEL,
        knowledgeChunks: knowledgeChunks.length,
      });
    }

    if (req.method === "GET" && url.pathname === "/models") {
      return json(res, 200, {
        models: [{ id: FIXED_MODEL, label: FIXED_MODEL }],
        fixed: true,
      });
    }

    if (req.method === "POST" && url.pathname === "/chat") {
      const body = await readJson(req);
      const query = String(body.query || "").trim();
      const model = FIXED_MODEL;
      const hasArabic = /[\u0600-\u06ff]/.test(query);
      const language = hasArabic || body.language === "ar" ? "Arabic" : "English";
      const catalog = Array.isArray(body.catalog) ? body.catalog.slice(0, 150) : [];

      if (!query) return json(res, 400, { error: "Query is required." });

      const catalogText = catalog
        .map(
          (item, index) =>
            `${index + 1}. ${String(item.title || "").slice(0, 180)}
Description: ${String(item.description || "").slice(0, 260)}
Category: ${String(item.category || "").slice(0, 100)}
URL: ${String(item.url || "").slice(0, 500)}`,
        )
        .join("\n\n");

      const retrievedKnowledge = retrieveWebsiteKnowledge(query);
      const websiteKnowledgeText = retrievedKnowledge
        .map(
          (chunk, index) =>
            `[Website source ${index + 1}: ${chunk.source}]\n${chunk.text}`,
        )
        .join("\n\n");

      const systemPrompt = `You are the Technology Center AI assistant inside an internal service portal.
Answer in ${language} and match the user's tone. Understand Saudi Arabic, informal Arabic, English, Arabizi, abbreviations, typos, and non-technical wording.

Your job is to reason over the portal data below, not rely on memorized phrase rules.
Use the portal data as the source of truth. Never invent a request, owner, department, URL, process, or fact that is not supported by the provided data.

When a user asks for a request:
- infer the actual technical need from natural language;
- compare it against the request catalog;
- recommend the smallest number of matching requests, preferably one when one request clearly fits;
- explain briefly why.

When a user asks about TPM ownership or departments:
- use the full TPM directory below;
- names may be written in Arabic, English, or as an approximate transliteration;
- infer the closest matching person from the directory only when the match is reasonably clear;
- list the departments/services assigned to that person from the directory;
- if multiple people could match, ask one short clarification question instead of guessing.

When a user asks how the portal/process works:
- use the retrieved website knowledge and explain it clearly.
If the answer is not present in the provided portal data, say that clearly instead of making up an answer.

Return ONLY valid JSON in this exact shape:
{"answer":"helpful answer","recommendations":[{"title":"exact catalog title","reason":"short reason","url":"exact catalog URL"}]}

FULL TPM DIRECTORY:
${tpmDirectoryContext}

RELEVANT WEBSITE KNOWLEDGE:
${websiteKnowledgeText || "No extra website chunks matched this query."}

REQUEST CATALOG:
${catalogText}`;

      let payload;

      try {
        payload = await upstream(CHAT_PATH, {
          method: "POST",
          body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: query },
            ],
          }),
        });
      } catch (primaryError) {
        console.warn("Primary grounded AI request failed; retrying with compact context.", primaryError?.message || primaryError);

        const compactCatalog = catalog
          .map(
            (item, index) =>
              `${index + 1}. ${String(item.title || "").slice(0, 160)} | ${String(item.description || "").slice(0, 140)} | ${String(item.url || "").slice(0, 360)}`,
          )
          .join("\n");

        const compactPrompt = `You are the Technology Center AI assistant.
Answer in ${language}. Understand Saudi Arabic, informal Arabic, English, approximate name transliterations, and non-technical wording.
Reason from the provided portal data only. Do not invent information.
For request questions, choose the most precise request from the catalog.
For TPM/department questions, use the directory and infer Arabic/English transliterations only when reasonably clear.
Return ONLY valid JSON:
{"answer":"helpful answer","recommendations":[{"title":"exact catalog title","reason":"short reason","url":"exact catalog URL"}]}

TPM DIRECTORY:
${tpmDirectoryContext}

CATALOG:
${compactCatalog}`;

        payload = await upstream(CHAT_PATH, {
          method: "POST",
          body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
              { role: "system", content: compactPrompt },
              { role: "user", content: query },
            ],
          }),
        });
      }

      const text = extractAssistantText(payload);
      const result = parseAiResult(text);
      return json(res, 200, result);
    }

    return json(res, 404, { error: "Not found." });
  } catch (error) {
    console.error(new Date().toISOString(), error);
    return json(res, 502, {
      error: error instanceof Error ? error.message : "AI provider request failed.",
    });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Technology Delivery AI gateway listening on port ${PORT}`);
  console.log(`Provider: ${BASE_URL}`);
  console.log(`API key configured: ${API_KEY ? "yes" : "no"}`);
  console.log(`Fixed model: ${FIXED_MODEL}`);
  console.log(`Website knowledge chunks: ${knowledgeChunks.length}`);
});
