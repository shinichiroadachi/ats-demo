"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJobAction, updateJobAction, type JobFormInput } from "@/app/actions";
import { EMPLOYMENT_TYPES, JOB_STATUSES } from "@/lib/types";
import type { Job } from "@/lib/types";

export default function JobForm({ job }: { job?: Job }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<JobFormInput>({
    title: job?.title ?? "",
    employmentType: job?.employmentType ?? EMPLOYMENT_TYPES[0],
    location: job?.location ?? "",
    salaryRange: job?.salaryRange ?? "",
    description: job?.description ?? "",
    status: job?.status ?? JOB_STATUSES[0],
  });

  function update<K extends keyof JobFormInput>(key: K, value: JobFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = job
        ? await updateJobAction(job.id, form)
        : await createJobAction(form);
      router.push(`/jobs/${result.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          職種名
        </label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="例: 営業職(法人営業)"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            雇用形態
          </label>
          <select
            value={form.employmentType}
            onChange={(e) => update("employmentType", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            公開ステータス
          </label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            勤務地
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="例: 名古屋市中区"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            給与レンジ
          </label>
          <input
            type="text"
            value={form.salaryRange}
            onChange={(e) => update("salaryRange", e.target.value)}
            placeholder="例: 400万〜550万円"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          仕事内容
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={5}
          placeholder="業務内容を記載..."
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {job ? "更新する" : "求人を作成"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
