import JobForm from "@/components/job-form";

export default function NewJobPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">求人を追加</h1>
      <div className="mt-6">
        <JobForm />
      </div>
    </div>
  );
}
