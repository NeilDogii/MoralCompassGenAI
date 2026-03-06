import Main from "@/components/Main";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <Main />
    </Suspense>
  );
}
