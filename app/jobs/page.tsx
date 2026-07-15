import Link from "next/link";
import { Plus } from "lucide-react";
import { getJobs, getCandidateCountByJob } from "@/lib/data";
import { formatDate, jobStatusStyle } from "@/lib/format";
import clsx from "clsx";

export default async function JobsPage() {
  const [jobs, counts] = await Promise.all([getJobs(), getCandidateCountByJob()]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">求人管理</h1>
          <p className="mt-1 text-sm text-slate-500">
            公開中の求人と応募状況を管理します
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          求人を追加
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">職種名</th>
              <th className="px-5 py-3">雇用形態</th>
              <th className="px-5 py-3">公開ステータス</th>
              <th className="px-5 py-3 text-right">候補者数</th>
              <th className="px-5 py-3">作成日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {job.title}
                  </Link>
                  {job.location && (
                    <p className="text-xs text-slate-400">{job.location}</p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {job.employmentType}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                      jobStatusStyle(job.status)
                    )}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-slate-600">
                  {counts[job.id] ?? 0}名
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {formatDate(job.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
