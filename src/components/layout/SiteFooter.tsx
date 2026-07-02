import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 text-slate-400 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">Texas-hotel</p>
          <p className="mt-2 max-w-md text-sm">
            Luxury stays, contactless dining, and premium hospitality for travelers worldwide.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <Link href="/faq" className="transition hover:text-white">FAQ</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
