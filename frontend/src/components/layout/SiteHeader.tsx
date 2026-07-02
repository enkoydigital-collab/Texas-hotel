"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/book", label: "Book" },
  { href: "/dashboard", label: "Dashboard" },
];

const staffItems = [
  { href: "/qr/T1", label: "QR Order (Demo)" },
  { href: "/admin/restaurant", label: "Admin Panel" },
  { href: "/chef", label: "Chef Kitchen" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white"
          onClick={() => setMobileOpen(false)}
        >
          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 p-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.15em]">TEXAS HOTEL</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Book · Stay · Dine
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Staff dropdown hint */}
          <div className="ml-2 border-l border-white/10 pl-2 flex items-center gap-1">
            {staffItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  pathname === item.href
                    ? "bg-amber-400/20 text-amber-200"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:inline-flex"
          >
            Reserve Now
          </Link>
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 pb-6 md:hidden">
          <div className="mt-4 flex flex-col gap-1">
            {[...navItems, ...staffItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  pathname === item.href
                    ? "bg-amber-400/15 text-amber-200"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="mt-3 rounded-full bg-amber-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Reserve Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
