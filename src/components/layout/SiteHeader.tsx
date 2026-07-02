import Link from "next/link";
import { Compass, Menu, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Menu" },
  { href: "/qr/T1", label: "QR Order" },
  { href: "/admin/restaurant", label: "Admin" },
  { href: "/chef", label: "Chef" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 p-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.2em]">TEXAS-HOTEL</p>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Book. Stay. Scan. Enjoy.
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden rounded-full border border-amber-400/40 bg-amber-400/15 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/25 sm:inline-flex"
          >
            Reserve Now
          </Link>
          <button className="rounded-full border border-white/10 bg-white/10 p-2 text-white">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
