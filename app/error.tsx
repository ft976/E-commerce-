'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBE8EC] p-4 text-center">
      <h2 className="text-2xl font-semibold text-[#2E0C1B] mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="bg-[#7B1E45] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#4A1229] transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
