import Link from "next/link";
import clsx from "clsx";
import { FileText, Users, Award, Timer, ArrowRight } from "lucide-react";
import { getDashboardData } from "@/lib/stats";
import { formatDate, sourceStyle, stageStyle } from "@/lib/format";
import { SourcePieChart, StageFunnelChart } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  const { kpis, sourceBreakdown, stageFunnel, recentApplicants } =
    await getDashboardData();

  const kpiCards = [
    {
      label: "総応募数(今月)",
      value: `${kpis.monthlyApplications}名`,
      icon: FileText,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "選考中人数",
      value: `${kpis.inProgressCount}名`,
      icon: Users,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "内定数(今月)",
      value: `${kpis.monthlyOffers}名`,
      icon: Award,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "平均選考日数",
      value: kpis.avgDaysToOffer !== null ? `${kpis.avgDaysToOffer}日` : "—",
      icon: Timer,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
      <p className="mt-1 text-sm text-slate-500">採用活動の全体状況</p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={clsx("rounded-lg p-2", card.accent)}>
                <card.icon size={18} />
              </div>
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700">経路別応募数</h2>
          <SourcePieChart data={sourceBreakdown} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700">ステージ別人数</h2>
          <StageFunnelChart data={stageFunnel} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-700">直近の応募者</h2>
          <Link
            href="/pipeline"
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            パイプラインで見る
            <ArrowRight size={13} />
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {recentApplicants.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {c.name}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {c.jobTitle ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={clsx(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      sourceStyle(c.source)
                    )}
                  >
                    {c.source}
                  </span>
                </td>
                <td className="px-5 py-3">
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
                <td className="px-5 py-3 text-right text-slate-500">
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
