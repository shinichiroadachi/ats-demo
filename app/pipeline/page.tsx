import { getCandidates, getJobs } from "@/lib/data";
import PipelineBoard from "@/components/pipeline-board";

export default async function PipelinePage() {
  const [candidates, jobs] = await Promise.all([getCandidates(), getJobs()]);

  return <PipelineBoard candidates={candidates} jobs={jobs} />;
}
