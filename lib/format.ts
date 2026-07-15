export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export const SOURCE_STYLES: Record<string, string> = {
  求人媒体: "bg-blue-50 text-blue-700 ring-blue-600/20",
  人材紹介: "bg-purple-50 text-purple-700 ring-purple-600/20",
  リファラル: "bg-green-50 text-green-700 ring-green-600/20",
  直接応募: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

export function sourceStyle(source: string): string {
  return SOURCE_STYLES[source] ?? "bg-slate-50 text-slate-700 ring-slate-600/20";
}

export const STAGE_STYLES: Record<string, { dot: string; header: string }> = {
  応募: { dot: "bg-slate-400", header: "text-slate-700" },
  書類選考: { dot: "bg-sky-500", header: "text-sky-700" },
  一次面接: { dot: "bg-indigo-500", header: "text-indigo-700" },
  最終面接: { dot: "bg-violet-500", header: "text-violet-700" },
  内定: { dot: "bg-emerald-500", header: "text-emerald-700" },
  入社: { dot: "bg-teal-600", header: "text-teal-700" },
  不採用: { dot: "bg-rose-400", header: "text-rose-700" },
  辞退: { dot: "bg-gray-400", header: "text-gray-600" },
};

export function stageStyle(stage: string) {
  return STAGE_STYLES[stage] ?? { dot: "bg-slate-400", header: "text-slate-700" };
}

export function jobStatusStyle(status: string): string {
  return status === "公開中"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-slate-100 text-slate-500 ring-slate-500/10";
}
