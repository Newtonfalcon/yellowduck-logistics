import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50 text-center">
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-slate-500" />
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Loading shipment details</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We&apos;re connecting to the tracking service and retrieving the latest shipment status.
        </p>
      </div>
    </div>
  );
}
