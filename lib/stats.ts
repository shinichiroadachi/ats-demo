import "server-only";
import { getAllStageHistory, getCandidates, getJobs } from "./data";
import { PIPELINE_STAGES, SOURCES } from "./types";

const ACTIVE_STAGES = ["応募", "書類選考", "一次面接", "最終面接"];

function isSameMonth(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

function daysBetween(fromStr: string, toStr: string): number {
  const from = new Date(fromStr).getTime();
  const to = new Date(toStr).getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

export async function getDashboardData() {
  const [candidates, jobs, history] = await Promise.all([
    getCandidates(),
    getJobs(),
    getAllStageHistory(),
  ]);
  const jobById = new Map(jobs.map((j) => [j.id, j]));
  const now = new Date();

  const monthlyApplications = candidates.filter((c) =>
    isSameMonth(c.appliedAt, now)
  ).length;

  const inProgressCount = candidates.filter((c) =>
    ACTIVE_STAGES.includes(c.stage)
  ).length;

  const offerEntriesByCandidate = new Map<string, string>();
  for (const entry of history) {
    if (entry.toStage !== "内定") continue;
    if (!offerEntriesByCandidate.has(entry.candidateId)) {
      offerEntriesByCandidate.set(entry.candidateId, entry.changedAt);
    }
  }

  const monthlyOffers = [...offerEntriesByCandidate.values()].filter((changedAt) =>
    isSameMonth(changedAt, now)
  ).length;

  const daysToOffer: number[] = [];
  for (const c of candidates) {
    const offerAt = offerEntriesByCandidate.get(c.id);
    if (offerAt) daysToOffer.push(daysBetween(c.appliedAt, offerAt));
  }
  const avgDaysToOffer =
    daysToOffer.length > 0
      ? Math.round(
          daysToOffer.reduce((sum, d) => sum + d, 0) / daysToOffer.length
        )
      : null;

  const sourceBreakdown = SOURCES.map((source) => ({
    name: source,
    value: candidates.filter((c) => c.source === source).length,
  })).filter((s) => s.value > 0);

  const stageFunnel = PIPELINE_STAGES.map((stage) => ({
    name: stage,
    count: candidates.filter((c) => c.stage === stage).length,
  }));

  const recentApplicants = [...candidates]
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, 5)
    .map((c) => ({
      ...c,
      jobTitle: c.jobId ? jobById.get(c.jobId)?.title ?? null : null,
    }));

  return {
    kpis: {
      monthlyApplications,
      inProgressCount,
      monthlyOffers,
      avgDaysToOffer,
    },
    sourceBreakdown,
    stageFunnel,
    recentApplicants,
  };
}
