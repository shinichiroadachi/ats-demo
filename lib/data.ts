import "server-only";
import { supabase } from "./supabase";
import type { Candidate, Job, Note, StageHistoryEntry } from "./types";

// Supabase-backed data layer. Table/column names follow supabase/schema.sql
// (snake_case); everything exported from here uses the camelCase app types.

function rowToJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    title: row.title as string,
    employmentType: row.employment_type as string,
    location: (row.location as string | null) ?? null,
    salaryRange: (row.salary_range as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    status: row.status as string,
    createdAt: row.created_at as string,
  };
}

function rowToCandidate(row: Record<string, unknown>): Candidate {
  return {
    id: row.id as string,
    name: row.name as string,
    kana: (row.kana as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    jobId: (row.job_id as string | null) ?? null,
    source: row.source as string,
    stage: row.stage as string,
    resumeFilename: (row.resume_filename as string | null) ?? null,
    appliedAt: row.applied_at as string,
    createdAt: row.created_at as string,
  };
}

function rowToNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    author: row.author as string,
    body: row.body as string,
    createdAt: row.created_at as string,
  };
}

function rowToStageHistory(row: Record<string, unknown>): StageHistoryEntry {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    fromStage: (row.from_stage as string | null) ?? null,
    toStage: row.to_stage as string,
    changedAt: row.changed_at as string,
  };
}

// --- Jobs -------------------------------------------------------------

export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(rowToJob);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToJob(data) : undefined;
}

export async function createJob(
  input: Omit<Job, "id" | "createdAt">
): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title: input.title,
      employment_type: input.employmentType,
      location: input.location,
      salary_range: input.salaryRange,
      description: input.description,
      status: input.status,
    })
    .select("*")
    .single();
  if (error) throw error;
  return rowToJob(data);
}

export async function updateJob(
  id: string,
  patch: Partial<Omit<Job, "id" | "createdAt">>
): Promise<Job> {
  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) update.title = patch.title;
  if (patch.employmentType !== undefined)
    update.employment_type = patch.employmentType;
  if (patch.location !== undefined) update.location = patch.location;
  if (patch.salaryRange !== undefined) update.salary_range = patch.salaryRange;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.status !== undefined) update.status = patch.status;

  const { data, error } = await supabase
    .from("jobs")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToJob(data);
}

export async function getCandidateCountByJob(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("candidates").select("job_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data) {
    const jobId = row.job_id as string | null;
    if (!jobId) continue;
    counts[jobId] = (counts[jobId] ?? 0) + 1;
  }
  return counts;
}

// --- Candidates ---------------------------------------------------------

export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase.from("candidates").select("*");
  if (error) throw error;
  return data.map(rowToCandidate);
}

export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToCandidate(data) : undefined;
}

export async function getCandidatesByJob(jobId: string): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("job_id", jobId);
  if (error) throw error;
  return data.map(rowToCandidate);
}

export async function moveCandidateStage(
  id: string,
  toStage: string
): Promise<Candidate> {
  const { data: current, error: fetchError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;
  const fromStage = current.stage as string;

  const { data: updated, error: updateError } = await supabase
    .from("candidates")
    .update({ stage: toStage })
    .eq("id", id)
    .select("*")
    .single();
  if (updateError) throw updateError;

  const { error: historyError } = await supabase.from("stage_history").insert({
    candidate_id: id,
    from_stage: fromStage,
    to_stage: toStage,
  });
  if (historyError) throw historyError;

  return rowToCandidate(updated);
}

// --- Notes ----------------------------------------------------------------

export async function getNotesByCandidate(candidateId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(rowToNote);
}

export async function addNote(
  candidateId: string,
  body: string,
  author: string = "採用担当"
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .insert({ candidate_id: candidateId, body, author })
    .select("*")
    .single();
  if (error) throw error;
  return rowToNote(data);
}

// --- Stage history ----------------------------------------------------------

export async function getStageHistoryByCandidate(
  candidateId: string
): Promise<StageHistoryEntry[]> {
  const { data, error } = await supabase
    .from("stage_history")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("changed_at", { ascending: true });
  if (error) throw error;
  return data.map(rowToStageHistory);
}

export async function getAllStageHistory(): Promise<StageHistoryEntry[]> {
  const { data, error } = await supabase
    .from("stage_history")
    .select("*")
    .order("changed_at", { ascending: true });
  if (error) throw error;
  return data.map(rowToStageHistory);
}
