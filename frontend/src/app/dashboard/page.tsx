"use client";

import { useEffect, useState } from "react";
import { Briefcase, Hotel, ShieldCheck, Sparkles, UtensilsCrossed, Users } from "lucide-react";
import { analyticsCards, dashboardRoles, roleContent } from "@/lib/dashboardViews";

const iconMap = {
  Reservations: Hotel,
  "Dining Orders": UtensilsCrossed,
  Guests: Users,
  "Staff Tasks": Briefcase,
};

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<"admin" | "staff" | "guest">("admin");
  const [stats, setStats] = useState<Array<{ title: string; value: string; change: string }>>([]);
  const [analytics, setAnalytics] = useState<Array<{ label: string; value: string; delta: string }>>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || []);
        setAnalytics(data.analytics || []);
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

  const roleData = roleContent[activeRole];

  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Operations Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Real-time hotel and dining control center.</h1>
              <p className="mt-4 max-w-2xl text-slate-300">The platform combines reservations, restaurant operations, guest support, and staff coordination into one polished command view.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
              <ShieldCheck className="h-4 w-4" /> Secure workspace • role-aware access
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {dashboardRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeRole === role.id ? "bg-amber-400 text-slate-950" : "border border-white/10 bg-slate-900/70 text-slate-200"}`}
            >
              {role.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((card) => {
            const Icon = iconMap[card.title as keyof typeof iconMap] ?? Sparkles;
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
                <p className="mt-4 text-sm text-slate-400">{card.change}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{roleData.title}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{dashboardRoles.find((role) => role.id === activeRole)?.summary}</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {roleData.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {roleData.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Analytics charts</h2>
            <div className="mt-6 space-y-4">
              {analytics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <span className="text-sm font-medium text-amber-200">{item.delta}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
