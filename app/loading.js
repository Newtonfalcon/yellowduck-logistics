import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-xl w-full rounded-[28px] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40 text-center">
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-slate-500" />
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Loading Yellowduck</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We&apos;re preparing your workspace and fetching the latest shipment data.
          This may take a few seconds.
        </p>
      </div>
    </div>
  );
}
