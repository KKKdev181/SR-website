import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.TD_AI_PORT || 8084);
const BASE_URL = (process.env.TD_AI_BASE_URL || "https://llms.elm.sa").replace(/\/+$/, "");
const API_KEY = process.env.TD_AI_API_KEY || "";
const MODELS_PATH = process.env.TD_AI_MODELS_PATH || "/v1/models";
const CHAT_PATH = process.env.TD_AI_CHAT_PATH || "/v1/chat/completions";
const ALLOWED_ORIGIN = process.env.TD_AI_ALLOWED_ORIGIN || "*";

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
      });
    }

    if (req.method === "GET" && url.pathname === "/models") {
      const payload = await upstream(MODELS_PATH);
      const models = parseModels(payload);
      return json(res, 200, { models });
    }

    if (req.method === "POST" && url.pathname === "/chat") {
      const body = await readJson(req);
      const query = String(body.query || "").trim();
      const model = String(body.model || "").trim();
      const language = body.language === "ar" ? "Arabic" : "English";
      const catalog = Array.isArray(body.catalog) ? body.catalog.slice(0, 150) : [];

      if (!query) return json(res, 400, { error: "Query is required." });
      if (!model) return json(res, 400, { error: "Model is required." });

      const catalogText = catalog
        .map(
          (item, index) =>
            `${index + 1}. ${String(item.title || "").slice(0, 180)}
Description: ${String(item.description || "").slice(0, 420)}
Category: ${String(item.category || "").slice(0, 120)}
URL: ${String(item.url || "").slice(0, 500)}`,
        )
        .join("\n\n");

      const systemPrompt = `You are the Technology Center request advisor for an internal service portal.
Answer in ${language}.
Use ONLY requests present in the provided catalog. Never invent a request, URL, approval, or process.
Recommend at most 5 requests and explain briefly why each one is relevant.
If the user's need is unclear, say what information is missing.
Return ONLY valid JSON in this exact shape:
{"answer":"short helpful answer","recommendations":[{"title":"exact catalog title","reason":"short reason","url":"exact catalog URL"}]}

REQUEST CATALOG:
${catalogText}`;

      const payload = await upstream(CHAT_PATH, {
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
});
