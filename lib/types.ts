export const PIPELINE_STAGES = [
  "応募",
  "書類選考",
  "一次面接",
  "最終面接",
  "内定",
  "入社",
] as const;

export const ARCHIVED_STAGES = ["不採用", "辞退"] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
export type ArchivedStage = (typeof ARCHIVED_STAGES)[number];
export type Stage = PipelineStage | ArchivedStage;

export const SOURCES = ["求人媒体", "人材紹介", "リファラル", "直接応募"] as const;
export type Source = (typeof SOURCES)[number];

export const EMPLOYMENT_TYPES = ["正社員", "契約社員", "アルバイト"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const JOB_STATUSES = ["公開中", "停止"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface Job {
  id: string;
  title: string;
  employmentType: string;
  location: string | null;
  salaryRange: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  kana: string | null;
  email: string | null;
  phone: string | null;
  jobId: string | null;
  source: string;
  stage: string;
  resumeFilename: string | null;
  appliedAt: string;
  createdAt: string;
}

export interface Note {
  id: string;
  candidateId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface StageHistoryEntry {
  id: string;
  candidateId: string;
  fromStage: string | null;
  toStage: string;
  changedAt: string;
}
