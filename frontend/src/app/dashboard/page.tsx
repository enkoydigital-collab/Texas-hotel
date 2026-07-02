"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Briefcase, Hotel, ShieldCheck, Sparkles,
  UtensilsCrossed, Users, BarChart2, ClipboardList,
  BedDouble, Wrench,
} from "lucide-react";
import { analyticsCards } from "@/lib/dashboardViews";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  Reservations: Hotel,
  "Dining Orders": UtensilsCrossed,
  Guests: Users,
  "Staff Tasks": Briefcase,
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role;

  const [stats, setStats] = useState<Array<{ title: string; value: string; change: string }>>([]);
  const [analytics, setAnalytics] = useState<Array<{ label: string; value: string; delta: string }>>([]);

  // Redirect if not authorized
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && role !== "admin" && role !== "staff") {
      router.push("/");
    }
  }, [status, role, router]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/dashboard`)
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? []);
        setAnalytics(d.analytics ?? []);
      })
      .catch(() => {
        setStats([
          { title: "Reservations", value: "184", change: "+12% this month" },
          { title: "Dining Orders", value: "32", change: "8 pending prep" },
          { title: "Guests", value: "1,208", change: "+96 checked in" },
          { title: "Staff Tasks", value: "19", change: "4 high priority" },
        ]);
        setAnalytics(analyticsCards);
      });
  }, []);

  // Loading state
  if (status === "loading" || !role) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  // Not authorized
  if (role !== "admin" && role !== "staff") return null;

  return (
    <div className="px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-amber-300">
                {role === "admin" ? <ShieldCheck className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                <span className="uppercase tracking-widest">
                  {role === "admin" ? "Admin Dashboard" : "Staff Dashboard"}
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Welcome back, {session?.user?.name?.split(" ")[0]}
              </h1>
              <p className="mt-2 text-slate-400">
                {role === "admin"
                  ? "Full operations overview — manage rooms, dining, payments, and staff."
                  : "Your daily tasks — housekeeping, guest requests, and service coordination."}
              </p>
            </div>
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="avatar"
                className="h-14 w-14 rounded-full border-2 border-amber-400/40 shadow-lg" />
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((card) => {
            const Icon = iconMap[card.title] ?? Sparkles;
            return (
              <div key={card.title} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                  </div>
                  <div className="rounded-full border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{card.change}</p>
              </div>
            );
          })}
        </div>

        {/* ── ADMIN VIEW ─────────────────────────────────────────── */}
        {role === "admin" && (
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Quick actions */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <ClipboardList className="h-5 w-5 text-amber-300" /> Quick actions
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { href: "/admin/restaurant", label: "Restaurant orders", icon: UtensilsCrossed, color: "text-amber-300" },
                  { href: "/admin/restaurant?tab=menu", label: "Manage menu", icon: BedDouble, color: "text-blue-300" },
                  { href: "/admin/restaurant?tab=staff", label: "Approve chefs", icon: Users, color: "text-green-300" },
                  { href: "/admin/restaurant?tab=analytics", label: "View analytics", icon: BarChart2, color: "text-purple-300" },
                ].map((action) => (
                  <Link key={action.href} href={action.href}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-white/20 hover:bg-slate-800/60">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm font-medium text-white">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <BarChart2 className="h-5 w-5 text-amber-300" /> Key metrics
              </h2>
              <div className="mt-4 space-y-3">
                {analytics.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-green-400">{item.delta}</span>
                      <span className="text-lg font-semibold text-white">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── STAFF VIEW ─────────────────────────────────────────── */}
        {role === "staff" && (
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Staff tasks */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Wrench className="h-5 w-5 text-amber-300" /> Today's tasks
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Room 204 – Housekeeping", status: "Pending", color: "text-yellow-300" },
                  { label: "Room 311 – Towel request", status: "In progress", color: "text-blue-300" },
                  { label: "Lobby – General cleaning", status: "Done", color: "text-green-400" },
                  { label: "Room 105 – Maintenance", status: "Pending", color: "text-yellow-300" },
                ].map((task) => (
                  <div key={task.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <span className="text-sm text-white">{task.label}</span>
                    <span className={`text-xs font-medium ${task.color}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest requests */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Users className="h-5 w-5 text-amber-300" /> Guest requests
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { guest: "Room 412", request: "Extra pillow", time: "10 min ago" },
                  { guest: "Room 208", request: "Late checkout request", time: "25 min ago" },
                  { guest: "Room 319", request: "Iron & board", time: "1 hr ago" },
                ].map((req) => (
                  <div key={req.guest} className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{req.guest}</span>
                      <span className="text-xs text-slate-500">{req.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{req.request}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
