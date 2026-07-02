import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10">
          <ShieldX className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Access denied</h1>
          <p className="mt-2 text-slate-400">
            You don't have permission to view this page.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
