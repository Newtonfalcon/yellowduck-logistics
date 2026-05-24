'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Tracking Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-500 mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            We could not find your shipment
          </h2>
        </div>

        <p className="text-gray-600 mb-2">
          {error.message || 'Something went wrong while tracking your package.'}
        </p>

        <p className="text-gray-500 text-sm mb-8">
          This could happen if the tracking number is incorrect or the shipment data is temporarily unavailable.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/track"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            New Search
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-blue-600 hover:text-blue-800 underline text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
