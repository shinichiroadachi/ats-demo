import Link from "next/link";
import clsx from "clsx";
import { FileText, Users, Award, Timer, ArrowRight, CalendarDays } from "lucide-react";
import { getDashboardData } from "@/lib/stats";
import { formatDate, sourceStyle, stageStyle } from "@/lib/format";
import { SourcePieChart, StageFunnelChart } from "@/components/dashboard-charts";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default async function DashboardPage() {
  const { kpis, sourceBreakdown, stageFunnel, recentApplicants } =
    await getDashboardData();

  const today = new Date();
  const todayLabel = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日(${WEEKDAYS[today.getDay()]})`;

  const kpiCards = [
    {
      label: "総応募数(今月)",
      value: `${kpis.monthlyApplications}名`,
      icon: FileText,
      accent: "bg-blue-50 text-blue-600",
      ring: "ring-blue-100",
    },
    {
      label: "選考中人数",
      value: `${kpis.inProgressCount}名`,
      icon: Users,
      accent: "bg-indigo-50 text-indigo-600",
      ring: "ring-indigo-100",
    },
    {
      label: "内定数(今月)",
      value: `${kpis.monthlyOffers}名`,
      icon: Award,
      accent: "bg-emerald-50 text-emerald-600",
      ring: "ring-emerald-100",
    },
    {
      label: "平均選考日数",
      value: kpis.avgDaysToOffer !== null ? `${kpis.avgDaysToOffer}日` : "—",
      icon: Timer,
      accent: "bg-amber-50 text-amber-600",
      ring: "ring-amber-100",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ダッシュボード
          </h1>
          <p className="mt-1 text-sm text-slate-500">採用活動の全体状況</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-slate-400" />
          {todayLabel}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <div
                className={clsx(
                  "rounded-xl p-2 ring-1 ring-inset transition-transform group-hover:scale-105",
                  card.accent,
                  card.ring
                )}
              >
                <card.icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold text-slate-700">経路別応募数</h2>
          </div>
          <SourcePieChart data={sourceBreakdown} />
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-indigo-500" />
            <h2 className="text-sm font-bold text-slate-700">ステージ別人数</h2>
          </div>
          <StageFunnelChart data={stageFunnel} />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-slate-400" />
            <h2 className="text-sm font-bold text-slate-700">直近の応募者</h2>
          </div>
          <Link
            href="/pipeline"
            className="group flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            パイプラインで見る
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {recentApplicants.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {c.name}
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {c.jobTitle ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={clsx(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      sourceStyle(c.source)
                    )}
                  >
                    {c.source}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={clsx(
                      "flex w-fit items-center gap-1.5 text-xs font-medium",
                      stageStyle(c.stage).header
                    )}
                  >
                    <span
                      className={clsx(
                        "h-1.5 w-1.5 rounded-full",
                        stageStyle(c.stage).dot
                      )}
                    />
                    {c.stage}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-slate-500">
                  {formatDate(c.appliedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
