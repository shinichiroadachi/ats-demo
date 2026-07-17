"use client";

import { useEffect, useState, useTransition } from "react";
import { X, FileText, Mail, Phone, Briefcase, Calendar } from "lucide-react";
import clsx from "clsx";
import { addNoteAction, getCandidateDetailAction } from "@/app/actions";
import { formatDate, formatDateTime, sourceStyle, stageStyle } from "@/lib/format";
import type { Candidate, Job, Note, StageHistoryEntry } from "@/lib/types";

interface Detail {
  candidate: Candidate;
  job: Job | null;
  notes: Note[];
  history: StageHistoryEntry[];
}

export default function CandidateDetailPanel({
  candidateId,
  onClose,
}: {
  candidateId: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [noteBody, setNoteBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    getCandidateDetailAction(candidateId).then((result) => {
      if (!cancelled) setDetail(result);
    });
    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  function refresh() {
    getCandidateDetailAction(candidateId).then(setDetail);
  }

  function submitNote() {
    if (!noteBody.trim()) return;
    const body = noteBody.trim();
    setNoteBody("");
    startTransition(async () => {
      await addNoteAction(candidateId, body);
      refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className={clsx(
          "absolute inset-0 bg-slate-900/30 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={clsx(
          "relative flex h-full w-[440px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          {detail ? (
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {detail.candidate.name}
              </h2>
              {detail.candidate.kana && (
                <p className="text-xs text-slate-400">{detail.candidate.kana}</p>
              )}
              <span
                className={clsx(
                  "mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  stageStyle(detail.candidate.stage).badge
                )}
              >
                {detail.candidate.stage}
              </span>
            </div>
          ) : (
            <div className="h-10" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            読み込み中...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* 基本情報 */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                基本情報
              </h3>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Briefcase size={15} className="shrink-0 text-slate-400" />
                  <span>{detail.job?.title ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  <span>{detail.candidate.email ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone size={15} className="shrink-0 text-slate-400" />
                  <span>{detail.candidate.phone ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Calendar size={15} className="shrink-0 text-slate-400" />
                  <span>応募日: {formatDate(detail.candidate.appliedAt)}</span>
                </div>
              </dl>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    sourceStyle(detail.candidate.source)
                  )}
                >
                  {detail.candidate.source}
                </span>
              </div>
            </section>

            {/* 添付ファイル */}
            <section className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                添付ファイル
              </h3>
              <div className="mt-3">
                {detail.candidate.resumeFilename ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">
                    <FileText size={16} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      {detail.candidate.resumeFilename}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">未添付</p>
                )}
              </div>
            </section>

            {/* 選考履歴 */}
            <section className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                選考履歴
              </h3>
              <ol className="mt-3 space-y-3">
                {detail.history.map((entry, i) => (
                  <li key={entry.id} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <span
                        className={clsx(
                          "h-2 w-2 rounded-full",
                          stageStyle(entry.toStage).dot
                        )}
                      />
                      {i < detail.history.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-slate-200" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="font-medium text-slate-700">
                        {entry.fromStage ? `${entry.fromStage} → ` : ""}
                        {entry.toStage}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(entry.changedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* メモ */}
            <section className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                メモ
              </h3>
              <div className="mt-3 space-y-3">
                {detail.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
                  >
                    <p className="whitespace-pre-wrap text-slate-700">
                      {note.body}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {note.author} · {formatDateTime(note.createdAt)}
                    </p>
                  </div>
                ))}
                {detail.notes.length === 0 && (
                  <p className="text-sm text-slate-400">メモはまだありません</p>
                )}
              </div>

              <div className="mt-3">
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="面接所感などを記録..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={submitNote}
                  disabled={isPending || !noteBody.trim()}
                  className="mt-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  メモを追加
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
