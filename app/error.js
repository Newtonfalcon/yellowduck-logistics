"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-4xl border border-rose-200 bg-white p-10 shadow-xl shadow-rose-100/60 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We couldn&apos;t load the page. Please refresh, try again, or return to the home page.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go home
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Error: {error?.message ?? "Unknown error"}
        </p>
      </div>
    </div>
  );
}
