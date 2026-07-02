import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ChefHat, Clock, LogOut } from "lucide-react";

export default async function PendingPage() {
  const session = await auth();

  // If not logged in, send to login
  if (!session) redirect("/login?from=chef");

  // If already approved, go to chef page
  if ((session.user as { role?: string })?.role === "chef") {
    redirect("/chef");
  }

  // If admin somehow landed here
  if ((session.user as { role?: string })?.role === "admin") {
    redirect("/admin/restaurant");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Clock className="h-8 w-8 text-amber-300" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-white">Waiting for approval</h1>
          <p className="mt-2 text-slate-400">
            Your account is pending admin approval. The admin will review and activate your chef access.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-left">
          <div className="flex items-center gap-3">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="avatar"
                className="h-10 w-10 rounded-full border border-white/10"
              />
            )}
            <div>
              <p className="font-medium text-white">{session.user?.name}</p>
              <p className="text-sm text-slate-400">{session.user?.email}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3">
            <ChefHat className="h-4 w-4 text-yellow-300" />
            <span className="text-sm text-yellow-300">Chef access — pending admin approval</span>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
