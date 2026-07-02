import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = [
  {
    heading: "Hotel",
    links: [
      { href: "/rooms", label: "Rooms & Suites" },
      { href: "/book", label: "Reservations" },
      { href: "/restaurant", label: "Restaurant" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Dining",
    links: [
      { href: "/qr/T1", label: "QR Menu (Demo)" },
      { href: "/menu/T1", label: "Order Online" },
    ],
  },
  {
    heading: "Info",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 pt-12 pb-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top row */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="rounded-full border border-amber-400/40 bg-amber-400/10 p-1.5">
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <span className="font-semibold tracking-wider">TEXAS HOTEL</span>
            </div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Luxury stays, contactless QR dining, and premium hospitality for travelers worldwide.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300 font-medium">
                {section.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Texas Hotel. All rights reserved.</p>
          <p>Powered by Next.js · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
