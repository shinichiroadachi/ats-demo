import { notFound } from "next/navigation";
import { getJobById } from "@/lib/data";
import JobForm from "@/components/job-form";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">求人を編集</h1>
      <div className="mt-6">
        <JobForm job={job} />
      </div>
    </div>
  );
}
