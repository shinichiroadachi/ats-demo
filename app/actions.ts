"use server";

import { revalidatePath } from "next/cache";
import * as data from "@/lib/data";
import type { EmploymentType, JobStatus } from "@/lib/types";

export async function moveCandidateStageAction(id: string, toStage: string) {
  const candidate = await data.moveCandidateStage(id, toStage);
  revalidatePath("/pipeline");
  revalidatePath("/candidates");
  revalidatePath("/");
  return candidate;
}

export async function addNoteAction(candidateId: string, body: string) {
  if (!body.trim()) return;
  const note = await data.addNote(candidateId, body.trim());
  revalidatePath("/pipeline");
  revalidatePath("/candidates");
  return note;
}

export async function getCandidateDetailAction(candidateId: string) {
  const candidate = await data.getCandidateById(candidateId);
  if (!candidate) return null;

  const [job, notes, history] = await Promise.all([
    candidate.jobId ? data.getJobById(candidate.jobId) : Promise.resolve(undefined),
    data.getNotesByCandidate(candidateId),
    data.getStageHistoryByCandidate(candidateId),
  ]);

  return { candidate, job: job ?? null, notes, history };
}

export interface JobFormInput {
  title: string;
  employmentType: EmploymentType | string;
  location: string;
  salaryRange: string;
  description: string;
  status: JobStatus | string;
}

export async function createJobAction(input: JobFormInput) {
  const job = await data.createJob({
    title: input.title,
    employmentType: input.employmentType,
    location: input.location || null,
    salaryRange: input.salaryRange || null,
    description: input.description || null,
    status: input.status,
  });
  revalidatePath("/jobs");
  revalidatePath("/");
  return job;
}

export async function updateJobAction(id: string, input: JobFormInput) {
  const job = await data.updateJob(id, {
    title: input.title,
    employmentType: input.employmentType,
    location: input.location || null,
    salaryRange: input.salaryRange || null,
    description: input.description || null,
    status: input.status,
  });
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/");
  return job;
}
