import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Sparkles, ChefHat, ShieldCheck, UtensilsCrossed } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const role = (session?.user as { role?: string })?.role;

  // Already logged in — redirect to their dashboard
  if (session) {
    if (role === "admin") redirect("/admin/restaurant");
    if (role === "chef") redirect("/chef");
    if (role === "pending") redirect("/pending");
    redirect("/");
  }

  const from = params.from;

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">

        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
            <Sparkles className="h-8 w-8 text-amber-300" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white">Texas Hotel</h1>
          <p className="mt-2 text-slate-400">Sign in with your Google account to continue</p>
        </div>

        {/* Role cards */}
        <div className="grid gap-4">

          {/* Admin */}
          <div className={`rounded-[1.75rem] border p-5 transition ${
            from === "admin" ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-slate-900/70"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
                <ShieldCheck className="h-5 w-5 text-amber-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Admin</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  Manage orders, menu, analytics, and approve chef accounts.
                  Only <span className="text-amber-300 font-medium">hailetadilo@gmail.com</span> has this role.
                </p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/admin/restaurant" });
              }}
              className="mt-4"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 active:scale-[.98]"
              >
                <GoogleIcon />
                Sign in as Admin
              </button>
            </form>
          </div>

          {/* Chef */}
          <div className={`rounded-[1.75rem] border p-5 transition ${
            from === "chef" ? "border-orange-400/50 bg-orange-400/10" : "border-white/10 bg-slate-900/70"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10">
                <ChefHat className="h-5 w-5 text-orange-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Chef</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  Access the kitchen dashboard to manage and update orders.
                  Admin approval required before first access.
                </p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/chef" });
              }}
              className="mt-4"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[.98]"
              >
                <GoogleIcon />
                Sign in as Chef
              </button>
            </form>
          </div>

          {/* Guest / Customer */}
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10">
                <UtensilsCrossed className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Guest / Customer</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  Browse rooms, scan QR codes to order food, and track your orders in real time.
                  No account needed for ordering.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="/rooms"
                className="flex-1 rounded-full border border-white/10 py-3 text-center text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                Browse Rooms
              </a>
              <a
                href="/qr/T1"
                className="flex-1 rounded-full bg-blue-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Order Food
              </a>
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-slate-500">
          Texas Hotel · Authentication secured by Google OAuth
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
