import { signIn } from "@/auth";
import { Sparkles, ChefHat, ShieldCheck } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const isAdminFlow = searchParams.from === "admin";
  const isChefFlow = searchParams.from === "chef";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
            {isAdminFlow ? (
              <ShieldCheck className="h-8 w-8 text-amber-300" />
            ) : isChefFlow ? (
              <ChefHat className="h-8 w-8 text-amber-300" />
            ) : (
              <Sparkles className="h-8 w-8 text-amber-300" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">
            {isAdminFlow
              ? "Admin Sign In"
              : isChefFlow
              ? "Chef Sign In"
              : "Sign In to Texas Hotel"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isAdminFlow
              ? "Sign in with the admin Google account to access the management panel."
              : isChefFlow
              ? "Sign in with your Google account. Your access will be approved by admin."
              : "Use your Google account to continue."}
          </p>
        </div>

        {/* Sign in card */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
          {isAdminFlow && (
            <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
              Only <span className="font-semibold">hailetadilo@gmail.com</span> has admin access.
            </div>
          )}
          {isChefFlow && (
            <div className="mb-6 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-300">
              After signing in, wait for admin to approve your account before accessing the kitchen.
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo:
                  isAdminFlow
                    ? "/admin/restaurant"
                    : isChefFlow
                    ? "/chef"
                    : "/",
              });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-6 py-3.5 font-semibold text-slate-900 shadow transition hover:bg-slate-100 active:scale-[.98]"
            >
              {/* Google icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Texas Hotel · Secure authentication powered by Google
        </p>
      </div>
    </div>
  );
}
