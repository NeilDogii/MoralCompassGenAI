import ResultsPage from "@/components/ResultsPage";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsPage />
    </Suspense>
  );
}
