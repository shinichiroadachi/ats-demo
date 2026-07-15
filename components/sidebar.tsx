"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, Users, Briefcase } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/pipeline", label: "パイプライン", icon: KanbanSquare },
  { href: "/candidates", label: "候補者", icon: Users },
  { href: "/jobs", label: "求人", icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          採
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">
          採用管理
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? "text-blue-600" : "text-slate-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
        デモ環境 · 本番データではありません
      </div>
    </aside>
  );
}
