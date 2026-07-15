import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { getJobById, getCandidatesByJob } from "@/lib/data";
import { formatDate, jobStatusStyle, sourceStyle, stageStyle } from "@/lib/format";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const candidates = await getCandidatesByJob(id);

  return (
    <div className="p-8">
      <Link
        href="/jobs"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} />
        求人一覧へ戻る
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <span
              className={clsx(
                "rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                jobStatusStyle(job.status)
              )}
            >
              {job.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {job.employmentType}
            {job.location ? ` · ${job.location}` : ""}
            {job.salaryRange ? ` · ${job.salaryRange}` : ""}
          </p>
        </div>
        <Link
          href={`/jobs/${job.id}/edit`}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={15} />
          編集
        </Link>
      </div>

      {job.description && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
            仕事内容
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
            {job.description}
          </p>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">
            この求人の候補者({candidates.length}名)
          </h2>
          <span className="text-xs text-slate-400">
            作成日: {formatDate(job.createdAt)}
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {candidates.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              まだ候補者がいません
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">氏名</th>
                  <th className="px-5 py-3">経路</th>
                  <th className="px-5 py-3">ステージ</th>
                  <th className="px-5 py-3">応募日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {c.name}
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
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(c.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
