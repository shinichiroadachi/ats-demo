import { getCandidates, getJobs } from "@/lib/data";
import CandidatesTable from "@/components/candidates-table";

export default async function CandidatesPage() {
  const [candidates, jobs] = await Promise.all([getCandidates(), getJobs()]);

  return <CandidatesTable candidates={candidates} jobs={jobs} />;
}
