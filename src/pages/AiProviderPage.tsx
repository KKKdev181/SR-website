import { useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

type ModelItem = {
  id: string;
  label: string;
};

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

const getModelsEndpoint = (baseUrl: string) => {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return "";
  return /\/v1$/i.test(normalized) ? `${normalized}/models` : `${normalized}/v1/models`;
};

const parseModels = (payload: unknown): ModelItem[] => {
  let source: unknown[] = [];

  if (Array.isArray(payload)) {
    source = payload;
  } else if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) source = record.data;
    else if (Array.isArray(record.models)) source = record.models;
  }

  const mapped = source
    .map((item) => {
      if (typeof item === "string") return { id: item, label: item };
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const id =
        typeof record.id === "string"
          ? record.id
          : typeof record.name === "string"
            ? record.name
            : typeof record.model === "string"
              ? record.model
              : "";

      if (!id) return null;
      return {
        id,
        label:
          typeof record.display_name === "string"
            ? record.display_name
            : typeof record.label === "string"
              ? record.label
              : id,
      };
    })
    .filter((item): item is ModelItem => Boolean(item));

  return Array.from(new Map(mapped.map((item) => [item.id, item])).values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
};

const AiProviderPage = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionOk, setConnectionOk] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const modelsEndpoint = useMemo(() => getModelsEndpoint(baseUrl), [baseUrl]);

  const loadModels = async () => {
    setError("");
    setConnectionOk(false);
    setSaved(false);
    setModels([]);
    setSelectedModel("");

    if (!baseUrl.trim()) {
      setError(isArabic ? "أدخل رابط مزود الـ AI أولاً." : "Enter the AI provider Base URL first.");
      return;
    }

    if (!apiKey.trim()) {
      setError(isArabic ? "أدخل مفتاح API أولاً." : "Enter the API key first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(modelsEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          Accept: "application/json",
        },
      });

      const raw = await response.text();
      let payload: unknown = null;

      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = raw;
      }

      if (!response.ok) {
        const message =
          payload && typeof payload === "object"
            ? String(
                (payload as Record<string, unknown>).message ??
                  (payload as Record<string, unknown>).error ??
                  `HTTP ${response.status}`,
              )
            : `HTTP ${response.status}`;
        throw new Error(message);
      }

      const discoveredModels = parseModels(payload);
      if (discoveredModels.length === 0) {
        throw new Error(
          isArabic
            ? "تم الاتصال بنجاح، لكن لم يتم العثور على موديلات في الاستجابة."
            : "Connection succeeded, but no models were found in the response.",
        );
      }

      setModels(discoveredModels);
      localStorage.setItem("td-ai-models", JSON.stringify(discoveredModels));
      setSelectedModel(discoveredModels[0].id);
      setConnectionOk(true);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      const looksLikeCors =
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("networkerror");

      setError(
        looksLikeCors
          ? isArabic
            ? "تعذر الاتصال من المتصفح. قد يكون مزود الـ AI يمنع CORS. في هذه الحالة نربطه عبر Backend داخلي بدلاً من الاتصال المباشر."
            : "The browser could not reach the provider. The AI endpoint may block CORS. In that case, connect it through an internal backend instead of calling it directly from the browser."
          : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveSelection = () => {
    if (!connectionOk || !selectedModel) return;

    localStorage.setItem(
      "td-ai-provider",
      JSON.stringify({
        baseUrl: normalizeBaseUrl(baseUrl),
        model: selectedModel,
      }),
    );

    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]" dir={isArabic ? "rtl" : "ltr"}>
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_8px_28px_rgba(9,30,66,0.08)]">
          <div className="border-b border-[#dfe1e6] bg-gradient-to-br from-[#f7fbff] to-white px-6 py-7 sm:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ff] text-[#0c66e4]">
                <Bot className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0c66e4]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {isArabic ? "إعدادات الذكاء الاصطناعي" : "AI Provider Setup"}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#172b4d] sm:text-3xl">
                  {isArabic ? "ربط مزود الـ AI واختيار الموديل" : "Connect an AI provider and choose a model"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5e6c84]">
                  {isArabic
                    ? "أدخل Base URL ومفتاح API. ستجلب الصفحة الموديلات المتاحة من المزود ثم تختار الموديل الذي سيُستخدم في الصفحة."
                    : "Enter the provider Base URL and API key. The page will retrieve the available models so you can choose which model the portal should use."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div>
                <label htmlFor="ai-base-url" className="mb-2 flex items-center gap-2 text-sm font-bold text-[#172b4d]">
                  <Server className="h-4 w-4 text-[#0c66e4]" aria-hidden="true" />
                  {isArabic ? "Base URL" : "Base URL"}
                </label>
                <input
                  id="ai-base-url"
                  type="url"
                  value={baseUrl}
                  onChange={(event) => {
                    setBaseUrl(event.target.value);
                    setConnectionOk(false);
                    setSaved(false);
                  }}
                  placeholder="https://llms.example.internal"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 w-full rounded-xl border border-[#dfe1e6] bg-white px-4 text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15"
                />
                {modelsEndpoint && (
                  <p className="mt-2 text-xs text-[#6b778c]">
                    {isArabic ? "Models endpoint:" : "Models endpoint:"}{" "}
                    <span className="font-mono text-[#44546f]">{modelsEndpoint}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ai-api-key" className="mb-2 flex items-center gap-2 text-sm font-bold text-[#172b4d]">
                  <KeyRound className="h-4 w-4 text-[#0c66e4]" aria-hidden="true" />
                  API Key
                </label>
                <div className="relative">
                  <input
                    id="ai-api-key"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(event) => {
                      setApiKey(event.target.value);
                      setConnectionOk(false);
                      setSaved(false);
                    }}
                    placeholder={isArabic ? "أدخل مفتاح API" : "Enter API key"}
                    autoComplete="off"
                    spellCheck={false}
                    className={`h-12 w-full rounded-xl border border-[#dfe1e6] bg-white text-sm text-[#172b4d] shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-4 pl-12" : "pl-4 pr-12"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((current) => !current)}
                    className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#6b778c] transition hover:bg-[#f1f2f4] hover:text-[#172b4d] ${isArabic ? "left-2" : "right-2"}`}
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 flex items-center gap-2 text-xs text-[#6b778c]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#22a06b]" aria-hidden="true" />
                  {isArabic
                    ? "مفتاح API لا يتم حفظه في Local Storage أو في GitHub. يبقى فقط في ذاكرة الصفحة الحالية."
                    : "The API key is not saved to Local Storage or GitHub. It stays only in the current page memory."}
                </p>
              </div>

              <button
                type="button"
                onClick={loadModels}
                disabled={isLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0c66e4] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0055cc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isArabic ? "جاري جلب الموديلات..." : "Loading models..."}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {isArabic ? "اتصل واجلب الموديلات" : "Connect & Load Models"}
                  </>
                )}
              </button>

              {error && (
                <div className="rounded-xl border border-[#ffbdad] bg-[#ffebe6] px-4 py-3 text-sm leading-6 text-[#ae2a19]">
                  {error}
                </div>
              )}

              {connectionOk && (
                <div className="rounded-xl border border-[#b7e4cf] bg-[#e3fcef] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#146c43]">
                    <CheckCircle2 className="h-5 w-5" />
                    {isArabic ? "تم الاتصال بنجاح" : "Connected successfully"}
                  </div>
                  <p className="mt-1 text-xs text-[#216e4e]">
                    {isArabic
                      ? `تم العثور على ${models.length} موديل.`
                      : `${models.length} model${models.length === 1 ? "" : "s"} found.`}
                  </p>
                </div>
              )}

              {models.length > 0 && (
                <div className="rounded-xl border border-[#dfe1e6] bg-[#fafbfc] p-4">
                  <label htmlFor="ai-model" className="mb-2 block text-sm font-bold text-[#172b4d]">
                    {isArabic ? "اختر الموديل" : "Choose model"}
                  </label>
                  <select
                    id="ai-model"
                    value={selectedModel}
                    onChange={(event) => {
                      setSelectedModel(event.target.value);
                      setSaved(false);
                    }}
                    className="h-12 w-full rounded-xl border border-[#dfe1e6] bg-white px-4 text-sm font-semibold text-[#172b4d] shadow-sm outline-none focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={saveSelection}
                    disabled={!selectedModel}
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#0c66e4] bg-white px-4 py-2 text-sm font-bold text-[#0c66e4] transition hover:bg-[#e9f2ff] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isArabic ? "استخدم هذا الموديل" : "Use this model"}
                  </button>

                  {saved && (
                    <p className="mt-2 text-xs font-semibold text-[#216e4e]">
                      {isArabic
                        ? "تم حفظ Base URL والموديل المختار لهذا المتصفح."
                        : "Base URL and selected model saved for this browser."}
                    </p>
                  )}
                </div>
              )}
            </div>

            <aside className="h-fit rounded-xl border border-[#dfe1e6] bg-[#f8fafc] p-5">
              <h2 className="text-sm font-bold text-[#172b4d]">
                {isArabic ? "كيف يعمل؟" : "How it works"}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-[#5e6c84]">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9f2ff] text-xs font-bold text-[#0c66e4]">1</span>
                  <p>{isArabic ? "أدخل رابط الـ LLM ومفتاح API." : "Enter the LLM URL and API key."}</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9f2ff] text-xs font-bold text-[#0c66e4]">2</span>
                  <p>{isArabic ? "نطلب قائمة الموديلات من /v1/models." : "We request the model list from /v1/models."}</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9f2ff] text-xs font-bold text-[#0c66e4]">3</span>
                  <p>{isArabic ? "اختر الموديل الذي تريد استخدامه." : "Choose the model you want the portal to use."}</p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-[#b3d4ff] bg-[#e9f2ff] p-3 text-xs leading-5 text-[#44546f]">
                {isArabic
                  ? "هذه الخطوة مناسبة لاختبار مزود OpenAI-compatible. قبل الإنتاج، الأفضل نقل مفتاح API إلى Backend داخلي حتى لا يمر عبر المتصفح."
                  : "This is suitable for testing an OpenAI-compatible provider. Before production, move the API key to an internal backend so it is not handled by the browser."}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AiProviderPage;
