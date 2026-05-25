"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <h1 className="text-2xl font-bold text-navy-900">Something went wrong</h1>
      <p className="max-w-md text-navy-600">{error.message}</p>
      <Button variant="emerald" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
