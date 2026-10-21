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
const FIXED_MODEL = "gpt-oss:120b";

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

const findCatalogItem = (catalog, title) =>
  catalog.find((item) => String(item?.title || "").trim() === title);

const getDeterministicRecommendation = (query, catalog) => {
  const text = normalizeIntentText(query);

  const devQaSignals = [
    "dev/qa",
    "dev qa",
    "development",
    "qa",
    "تطوير",
    "اختبار",
  ];

  const serverConnectionSignals = [
    "connection between servers",
    "connect between servers",
    "connect two servers",
    "server to server",
    "server-to-server",
    "communication between servers",
    "open port between servers",
    "firewall between servers",
    "i want connection between servers",
    "ابي اتصال بين سيرفرين",
    "ابغى اتصال بين سيرفرين",
    "ابي اربط سيرفرين",
    "ابغى اربط سيرفرين",
    "ربط بين سيرفرين",
    "تواصل بين سيرفرين",
    "فتح بورت بين سيرفرين",
    "سيرفر يتصل بسيرفر",
    "سيرفر يكلم سيرفر",
  ];

  const isServerConnection = serverConnectionSignals.some((signal) => text.includes(signal));

  const genericServerSignals = [
    "i want server",
    "i need server",
    "need a server",
    "need server",
    "new server",
    "add server",
    "ابي سيرفر",
    "ابغى سيرفر",
    "احتاج سيرفر",
    "محتاج سيرفر",
    "سيرفر جديد",
    "اضيف سيرفر",
    "ابي اضيف سيرفر",
    "ابغى اضيف سيرفر",
  ];

  const isGenericServerRequest = genericServerSignals.some((signal) => text.includes(signal));

  if (isGenericServerRequest && !isServerConnection) {
    const drSignals = [" dr", "dr ", "disaster recovery", "تعافي", "دي ار"];
    const isDr = drSignals.some((signal) => ` ${text} `.includes(signal));

    const targetTitle = isDr
      ? "Create New DR Servers for Project/Service"
      : "Scale Up: Add New Server";

    const item = findCatalogItem(catalog, targetTitle);
    if (item) {
      return {
        answer: isDr
          ? "This is the request for provisioning a new server in the DR environment."
          : "This is the request used when you need to add a new server to an existing project or service.",
        recommendations: [
          {
            title: item.title,
            reason: isDr
              ? "Use it when the required server is for Disaster Recovery."
              : "Use it when you need a new server added to your current environment.",
            url: item.url,
          },
        ],
        matchedByRule: true,
      };
    }
  }

  if (!isServerConnection) return null;

  const isDevQa = devQaSignals.some((signal) => text.includes(signal));
  const targetTitle = isDevQa
    ? "Network & Security Access Request (Security Access Network Requests (Dev/QA))"
    : "Access Provisioning: Communication Provisioning for Staging & Production";

  const item = findCatalogItem(catalog, targetTitle);
  if (!item) return null;

  return {
    answer: isDevQa
      ? "This is the request used to open server-to-server communication in Dev/QA."
      : "This is the request used to enable communication between source and destination servers in Staging/Production.",
    recommendations: [
      {
        title: item.title,
        reason: isDevQa
          ? "Use it for firewall or network access between servers in Dev/QA."
          : "Use it when one server needs to communicate with another server or endpoint in Staging/Production.",
        url: item.url,
      },
    ],
    matchedByRule: true,
  };
};

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

      const directRecommendation = getDeterministicRecommendation(query, catalog);
      if (directRecommendation) {
        return json(res, 200, directRecommendation);
      }

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

      const systemPrompt = `You are the Technology Center request advisor for an internal service portal.
Answer in ${language}.
Understand Saudi Arabic, informal Arabic, English, Arabizi, abbreviations, and non-technical descriptions.
First infer the user's technical intent, then map it to the most precise request in the catalog.
Use ONLY requests present in the provided catalog. Never invent a request, URL, approval, or process.
Prefer ONE exact request when the user's intent clearly matches a single service. Only recommend multiple requests when they are genuinely required.
If the user says they need communication or connectivity between two servers, prefer "Access Provisioning: Communication Provisioning for Staging & Production" unless they explicitly say Dev/QA, in which case prefer "Network & Security Access Request (Security Access Network Requests (Dev/QA))".
If the user simply says they want or need a server, prefer "Scale Up: Add New Server" unless they explicitly mention DR, in which case prefer "Create New DR Servers for Project/Service".
Do not ask for sizing, environment, project name, CPU, RAM, or storage before recommending the request when one catalog request already clearly matches the intent.
You also have retrieved knowledge from the actual Technology Center website, including the Project Journey, developer onboarding guidance, department-to-TPM directory, categories, and request definitions.
Use that website knowledge when the user asks about the project journey, prerequisites, developer access, TPM ownership, departments, environments, tools, or portal guidance.
Treat the website knowledge and request catalog as the source of truth. Do not invent information that is not present.
If the user's need is unclear, ask only the minimum clarification needed.
Return ONLY valid JSON in this exact shape:
{"answer":"short helpful answer","recommendations":[{"title":"exact catalog title","reason":"short reason","url":"exact catalog URL"}]}

WEBSITE KNOWLEDGE:
${websiteKnowledgeText || "No additional website knowledge matched this query."}

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

        const compactPrompt = `You are the Technology Center assistant.
Answer in ${language}.
Understand Saudi Arabic, informal Arabic, and non-technical wording.
Explain portal guidance clearly and recommend the most precise request when applicable.
Use only the catalog below. Do not invent request names or links.
Prefer one request when the intent is clear.
Return ONLY valid JSON:
{"answer":"helpful answer","recommendations":[{"title":"exact catalog title","reason":"short reason","url":"exact catalog URL"}]}

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
