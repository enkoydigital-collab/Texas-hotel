"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Sparkles, ShieldCheck, ChefHat, LogOut, LogIn } from "lucide-react";

// ─── Nav items visible to everyone ───────────────────────────────────────────
const publicNav = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Restaurant" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "admin";
  const isChef = role === "chef";
  const isLoggedIn = !!session;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-white" onClick={() => setMobileOpen(false)}>
          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 p-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.15em]">TEXAS HOTEL</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Book · Stay · Dine</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Public links — always visible */}
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname === item.href ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Admin-only nav */}
          {isAdmin && (
            <>
              <div className="mx-2 h-4 w-px bg-white/10" />
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname === "/dashboard"
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/restaurant"
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname.startsWith("/admin")
                    ? "bg-amber-400/20 text-amber-200"
                    : "text-amber-300 hover:bg-amber-400/10"
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            </>
          )}

          {/* Chef-only nav */}
          {isChef && (
            <>
              <div className="mx-2 h-4 w-px bg-white/10" />
              <Link
                href="/chef"
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname === "/chef"
                    ? "bg-orange-400/20 text-orange-200"
                    : "text-orange-300 hover:bg-orange-400/10"
                }`}
              >
                <ChefHat className="h-4 w-4" /> Kitchen
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          ) : isLoggedIn ? (
            /* ── Logged-in user avatar + dropdown ── */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 py-1 transition hover:bg-white/10"
              >
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="avatar" className="h-7 w-7 rounded-full" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-950">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="hidden text-sm font-medium text-white sm:block">
                  {session.user?.name?.split(" ")[0]}
                </span>
                {/* Role badge */}
                {isAdmin && (
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300">Admin</span>
                )}
                {isChef && (
                  <span className="rounded-full bg-orange-400/20 px-2 py-0.5 text-xs text-orange-300">Chef</span>
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-xl shadow-black/40">
                    <div className="px-3 py-2 text-xs text-slate-500 border-b border-white/10 mb-1">
                      {session.user?.email}
                    </div>
                    {isAdmin && (
                      <>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5">
                          Dashboard
                        </Link>
                        <Link href="/admin/restaurant" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-amber-300 transition hover:bg-white/5">
                          <ShieldCheck className="h-4 w-4" /> Admin Panel
                        </Link>
                      </>
                    )}
                    {isChef && (
                      <Link href="/chef" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-orange-300 transition hover:bg-white/5">
                        <ChefHat className="h-4 w-4" /> Kitchen
                      </Link>
                    )}
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ── Not logged in ── */
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/30 hover:text-white sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
              <Link
                href="/book"
                className="hidden rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:inline-flex"
              >
                Reserve Now
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full border border-white/10 bg-white/10 p-2 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 pb-6 md:hidden">
          <div className="mt-4 flex flex-col gap-1">
            {/* Public links */}
            {publicNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  pathname === item.href ? "bg-amber-400/15 text-amber-200" : "text-slate-300 hover:bg-white/5"
                }`}>
                {item.label}
              </Link>
            ))}

            {/* Role-based links */}
            {isAdmin && (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
                  Dashboard
                </Link>
                <Link href="/admin/restaurant" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-300">
                  <ShieldCheck className="h-4 w-4" /> Admin Panel
                </Link>
              </>
            )}
            {isChef && (
              <Link href="/chef" onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm font-medium text-orange-300">
                <ChefHat className="h-4 w-4" /> Kitchen
              </Link>
            )}

            <div className="mt-3 border-t border-white/10 pt-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Sign out ({session.user?.name?.split(" ")[0]})
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm text-slate-300">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Link>
                  <Link href="/book" onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-amber-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                    Reserve Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
