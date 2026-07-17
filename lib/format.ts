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

export const STAGE_STYLES: Record<
  string,
  { dot: string; header: string; badge: string; column: string; accent: string }
> = {
  応募: {
    dot: "bg-slate-400",
    header: "text-slate-700",
    badge: "bg-slate-100 text-slate-700",
    column: "bg-slate-100/70",
    accent: "#94a3b8",
  },
  書類選考: {
    dot: "bg-sky-500",
    header: "text-sky-700",
    badge: "bg-sky-50 text-sky-700",
    column: "bg-sky-50/70",
    accent: "#0ea5e9",
  },
  一次面接: {
    dot: "bg-indigo-500",
    header: "text-indigo-700",
    badge: "bg-indigo-50 text-indigo-700",
    column: "bg-indigo-50/70",
    accent: "#6366f1",
  },
  最終面接: {
    dot: "bg-violet-500",
    header: "text-violet-700",
    badge: "bg-violet-50 text-violet-700",
    column: "bg-violet-50/70",
    accent: "#8b5cf6",
  },
  内定: {
    dot: "bg-emerald-500",
    header: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700",
    column: "bg-emerald-50/70",
    accent: "#10b981",
  },
  入社: {
    dot: "bg-teal-600",
    header: "text-teal-700",
    badge: "bg-teal-50 text-teal-700",
    column: "bg-teal-50/70",
    accent: "#0d9488",
  },
  不採用: {
    dot: "bg-rose-400",
    header: "text-rose-700",
    badge: "bg-rose-50 text-rose-700",
    column: "bg-rose-50/70",
    accent: "#fb7185",
  },
  辞退: {
    dot: "bg-gray-400",
    header: "text-gray-600",
    badge: "bg-gray-100 text-gray-600",
    column: "bg-gray-100/70",
    accent: "#9ca3af",
  },
};

const DEFAULT_STAGE_STYLE = {
  dot: "bg-slate-400",
  header: "text-slate-700",
  badge: "bg-slate-100 text-slate-700",
  column: "bg-slate-100/70",
  accent: "#94a3b8",
};

export function stageStyle(stage: string) {
  return STAGE_STYLES[stage] ?? DEFAULT_STAGE_STYLE;
}

export function jobStatusStyle(status: string): string {
  return status === "公開中"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-slate-100 text-slate-500 ring-slate-500/10";
}
