import { useMemo, useState } from "react";
import { Building2, Mail, Search, UserRound, UsersRound } from "lucide-react";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { departmentAssignments, tpmContacts } from "@/data/departmentAssignments";
import { useLanguage } from "@/contexts/LanguageContext";

const normalize = (value: string) => value.toLowerCase().trim();

const TeamsIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="8.2" y="6.2" width="9.4" height="11.2" rx="2.1" fill="currentColor" opacity="0.95" />
    <rect x="3.2" y="8.1" width="7.8" height="8.1" rx="1.7" fill="currentColor" />
    <circle cx="17.9" cy="6.1" r="2.1" fill="currentColor" opacity="0.78" />
    <circle cx="20.1" cy="9.6" r="1.6" fill="currentColor" opacity="0.6" />
    <path d="M5.1 10.25h4.1v1.35H7.85v3.95H6.45V11.6H5.1z" fill="white" />
  </svg>
);

const TpmDirectoryPage = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [query, setQuery] = useState("");
  const [selectedTpm, setSelectedTpm] = useState("all");

  const tpms = useMemo(
    () => Array.from(new Set(departmentAssignments.flatMap((item) => item.tpms))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return departmentAssignments.filter((item) => {
      const matchesTpm = selectedTpm === "all" || item.tpms.includes(selectedTpm);
      const matchesQuery =
        !q ||
        normalize(item.department).includes(q) ||
        item.tpms.some((tpm) => normalize(tpm).includes(q));
      return matchesTpm && matchesQuery;
    });
  }, [query, selectedTpm]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d]" dir={isArabic ? "rtl" : "ltr"}>
      <Header />

      <main className="mx-auto max-w-[1560px] px-4 py-7 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-[#dfe1e6] bg-white shadow-[0_8px_28px_rgba(9,30,66,0.08)]">
          <div className="border-b border-[#dfe1e6] bg-gradient-to-br from-[#f7fbff] to-white px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e9f2ff] px-3 py-1.5 text-xs font-bold text-[#0c66e4]">
                  <UsersRound className="h-4 w-4" aria-hidden="true" />
                  {isArabic ? "دليل فرق التسليم" : "Technology Delivery Directory"}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#172b4d] sm:text-3xl">
                  {isArabic ? "اعثر على مدير المشروع التقني" : "Find Your Technical Project Manager"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5e6c84] sm:text-base">
                  {isArabic
                    ? "ابحث باسم الإدارة لمعرفة مدير المشروع التقني المسؤول عن تنسيق التسليم التقني لجميع الخدمات التابعة لها."
                    : "Search by department to find the Technical Project Manager responsible for coordinating technology delivery across its services."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[290px]">
                <div className="rounded-xl border border-[#dfe1e6] bg-white p-4">
                  <div className="text-2xl font-bold text-[#0c66e4]">{departmentAssignments.length}</div>
                  <div className="mt-1 text-xs font-medium text-[#6b778c]">
                    {isArabic ? "إدارة" : "Departments"}
                  </div>
                </div>
                <div className="rounded-xl border border-[#dfe1e6] bg-white p-4">
                  <div className="text-2xl font-bold text-[#0c66e4]">{tpms.length}</div>
                  <div className="mt-1 text-xs font-medium text-[#6b778c]">
                    {isArabic ? "مدير مشروع تقني" : "Technical PMs"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="mb-5">
              <div className="relative">
                <Search
                  className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a869a] ${isArabic ? "right-4" : "left-4"}`}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={isArabic ? "ابحث باسم الإدارة أو مدير المشروع التقني..." : "Search by department or Technical Project Manager..."}
                  className={`h-12 w-full rounded-xl border border-[#dfe1e6] bg-white text-sm shadow-sm outline-none transition placeholder:text-[#97a0af] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"}`}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTpm("all")}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selectedTpm === "all" ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]" : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"}`}
                >
                  {isArabic ? "الكل" : "All TPMs"}
                </button>
                {tpms.map((tpm) => (
                  <button
                    key={tpm}
                    type="button"
                    onClick={() => setSelectedTpm(tpm)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selectedTpm === tpm ? "border-[#0c66e4] bg-[#e9f2ff] text-[#0c66e4]" : "border-[#dfe1e6] bg-white text-[#44546f] hover:bg-[#f7f8f9]"}`}
                  >
                    {tpm}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[#5e6c84]">
                <span className="font-bold text-[#172b4d]">{filtered.length}</span>{" "}
                {isArabic ? "إدارة مطابقة" : filtered.length === 1 ? "department found" : "departments found"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#b3bac5] bg-[#fafbfc] px-6 py-14 text-center">
                <Search className="mx-auto h-8 w-8 text-[#97a0af]" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-bold text-[#172b4d]">
                  {isArabic ? "لم يتم العثور على إدارة" : "No department found"}
                </h2>
                <p className="mt-1 text-sm text-[#6b778c]">
                  {isArabic ? "جرّب البحث باسم مختلف أو اعرض جميع المدراء." : "Try another search term or select All TPMs."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <article
                    key={item.department}
                    className="group overflow-hidden rounded-xl border border-[#dfe1e6] bg-white shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition hover:-translate-y-0.5 hover:border-[#b3d4ff] hover:shadow-[0_8px_22px_rgba(9,30,66,0.10)]"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#0c66e4]">
                          <Building2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        {item.tpms.length > 1 && (
                          <span className="rounded-full bg-[#fff0b3] px-2.5 py-1 text-[10px] font-bold text-[#7f5f01]">
                            {isArabic ? "تغطية مشتركة" : "Shared coverage"}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-base font-bold leading-6 text-[#172b4d]">
                        {item.department}
                      </h2>

                      <div className="mt-4 border-t border-[#f1f2f4] pt-4">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#6b778c]">
                          {isArabic ? "مدير المشروع التقني" : "Technical Project Manager"}
                        </div>
                        <div className="space-y-2">
                          {item.tpms.map((tpm) => {
                            const contact = tpmContacts[tpm];

                            return (
                              <div key={tpm} className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4] text-[#44546f]">
                                  <UserRound className="h-4 w-4" aria-hidden="true" />
                                </span>

                                <div className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold text-[#172b4d]">{tpm}</span>
                                </div>

                                {contact && (
                                  <div className="flex shrink-0 items-center gap-1.5">
                                    <a
                                      href={`mailto:${contact.email}`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9d7f7] bg-[#f7f6ff] text-[#5b5fc7] transition hover:border-[#a9a7e8] hover:bg-[#ecebff] hover:text-[#464775] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b5fc7]"
                                      aria-label={`${isArabic ? "إرسال بريد إلى" : "Email"} ${tpm}`}
                                      title={isArabic ? "إرسال بريد" : "Email"}
                                    >
                                      <Mail className="h-4 w-4" aria-hidden="true" />
                                    </a>

                                    <a
                                      href={contact.teamsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe1e6] bg-white text-[#44546f] transition hover:border-[#b3d4ff] hover:bg-[#f4f8ff] hover:text-[#0c66e4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c66e4]"
                                      aria-label={`${isArabic ? "فتح محادثة Teams مع" : "Open Teams chat with"} ${tpm}`}
                                      title={isArabic ? "محادثة Teams" : "Teams chat"}
                                    >
                                      <TeamsIcon className="h-[18px] w-[18px]" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TpmDirectoryPage;
