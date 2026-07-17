"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import CandidateDetailPanel from "@/components/candidate-detail-panel";
import { formatDate, sourceStyle, stageStyle } from "@/lib/format";
import { ARCHIVED_STAGES, PIPELINE_STAGES } from "@/lib/types";
import type { Candidate, Job } from "@/lib/types";

const ALL_STAGES = [...PIPELINE_STAGES, ...ARCHIVED_STAGES];

export default function CandidatesTable({
  candidates,
  jobs,
}: {
  candidates: Candidate[];
  jobs: Job[];
}) {
  const [jobFilter, setJobFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const jobById = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);

  const filtered = useMemo(() => {
    return candidates
      .filter((c) => jobFilter === "all" || c.jobId === jobFilter)
      .filter((c) => stageFilter === "all" || c.stage === stageFilter)
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  }, [candidates, jobFilter, stageFilter]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">候補者</h1>
          <p className="mt-1 text-sm text-slate-500">
            全{candidates.length}名(不採用・辞退を含む)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">すべての職種</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">すべてのステージ</option>
            {ALL_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">氏名</th>
              <th className="px-5 py-3">応募職種</th>
              <th className="px-5 py-3">経路</th>
              <th className="px-5 py-3">ステージ</th>
              <th className="px-5 py-3">応募日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {c.name}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {c.jobId ? jobById.get(c.jobId)?.title ?? "—" : "—"}
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
                <td className="px-5 py-3.5 text-slate-500">
                  {formatDate(c.appliedAt)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  該当する候補者はいません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <CandidateDetailPanel
          candidateId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
