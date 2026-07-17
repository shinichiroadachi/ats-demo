"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import clsx from "clsx";
import CandidateCard from "@/components/candidate-card";
import CandidateDetailPanel from "@/components/candidate-detail-panel";
import { moveCandidateStageAction } from "@/app/actions";
import { PIPELINE_STAGES } from "@/lib/types";
import { stageStyle } from "@/lib/format";
import type { Candidate, Job } from "@/lib/types";

interface PipelineBoardProps {
  candidates: Candidate[];
  jobs: Job[];
}

function DraggableCard({
  candidate,
  jobTitle,
  onClick,
  onArchive,
}: {
  candidate: Candidate;
  jobTitle: string | undefined;
  onClick: () => void;
  onArchive: (stage: "不採用" | "辞退") => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: candidate.id,
  });

  return (
    <CandidateCard
      candidate={candidate}
      jobTitle={jobTitle}
      onClick={onClick}
      onArchive={onArchive}
      isDragging={isDragging}
      innerRef={setNodeRef}
      dragHandleProps={{ attributes, listeners }}
    />
  );
}

function DroppableColumn({
  stage,
  children,
}: {
  stage: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-full flex-col gap-2 rounded-xl p-2 transition-colors",
        isOver && "bg-blue-100/70 ring-2 ring-blue-300"
      )}
    >
      {children}
    </div>
  );
}

export default function PipelineBoard({ candidates, jobs }: PipelineBoardProps) {
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [optimisticCandidates, applyMove] = useOptimistic(
    candidates,
    (state, { id, stage }: { id: string; stage: string }) =>
      state.map((c) => (c.id === id ? { ...c, stage } : c))
  );

  const jobById = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);

  const visibleCandidates = useMemo(() => {
    const base = optimisticCandidates.filter(
      (c) => !["不採用", "辞退"].includes(c.stage)
    );
    if (jobFilter === "all") return base;
    return base.filter((c) => c.jobId === jobFilter);
  }, [optimisticCandidates, jobFilter]);

  const columns = useMemo(() => {
    const map = new Map<string, Candidate[]>();
    for (const stage of PIPELINE_STAGES) map.set(stage, []);
    for (const c of visibleCandidates) {
      map.get(c.stage)?.push(c);
    }
    return map;
  }, [visibleCandidates]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const candidateId = String(active.id);
    const newStage = String(over.id);
    const candidate = optimisticCandidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    startTransition(async () => {
      applyMove({ id: candidateId, stage: newStage });
      await moveCandidateStageAction(candidateId, newStage);
    });
  }

  function archive(candidateId: string, stage: "不採用" | "辞退") {
    startTransition(async () => {
      applyMove({ id: candidateId, stage });
      await moveCandidateStageAction(candidateId, stage);
    });
  }

  const activeCandidate = activeId
    ? optimisticCandidates.find((c) => c.id === activeId)
    : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">候補者パイプライン</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            カードをドラッグしてステージを移動できます
          </p>
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">すべての職種</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <DndContext
        id="pipeline-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="relative flex-1 overflow-hidden">
          <div className="flex h-full gap-3 overflow-x-auto px-6 py-6 [scrollbar-gutter:stable]">
            {PIPELINE_STAGES.map((stage) => {
              const stageCandidates = columns.get(stage) ?? [];
              const style = stageStyle(stage);
              return (
                <div
                  key={stage}
                  className={clsx(
                    "flex w-[272px] shrink-0 flex-col rounded-xl border border-black/[0.03]",
                    style.column
                  )}
                >
                  <div className="flex items-center justify-between px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={clsx("h-2 w-2 rounded-full", style.dot)} />
                      <h2 className={clsx("text-sm font-bold", style.header)}>
                        {stage}
                      </h2>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 shadow-sm">
                      {stageCandidates.length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 pb-2">
                    <DroppableColumn stage={stage}>
                      {stageCandidates.map((candidate) => (
                        <DraggableCard
                          key={candidate.id}
                          candidate={candidate}
                          jobTitle={
                            candidate.jobId
                              ? jobById.get(candidate.jobId)?.title
                              : undefined
                          }
                          onClick={() => setSelectedId(candidate.id)}
                          onArchive={(stage) => archive(candidate.id, stage)}
                        />
                      ))}
                      {stageCandidates.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300/80 py-6 text-center text-xs text-slate-400">
                          候補者なし
                        </div>
                      )}
                    </DroppableColumn>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-50 to-transparent" />
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="w-[272px] rotate-2 drop-shadow-xl">
              <CandidateCard
                candidate={activeCandidate}
                jobTitle={
                  activeCandidate.jobId
                    ? jobById.get(activeCandidate.jobId)?.title
                    : undefined
                }
                onClick={() => {}}
                onArchive={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedId && (
        <CandidateDetailPanel
          candidateId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
