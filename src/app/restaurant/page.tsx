import Link from "next/link";
import { ArrowRight, Search, UtensilsCrossed } from "lucide-react";
import { menuData } from "@/lib/restaurantData";

export default function RestaurantPage() {
  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">QR Menu</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Elevated dining from every table.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Guests scan a table-specific QR code, browse curated dishes, personalize orders, and enjoy
              live updates on preparation and delivery.
            </p>
          </div>
          <Link
            href="/menu/T1"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-amber-300"
          >
            <UtensilsCrossed className="h-4 w-4" /> Order from Table 1
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {menuData.map((item) => (
            <div key={item.id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{item.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{item.name}</h2>
                  <p className="mt-3 text-slate-300">{item.description}</p>
                </div>
                <div className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200">
                  ${item.price}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/menu/T1"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <UtensilsCrossed className="h-4 w-4" /> Order this
                </Link>
                <Link
                  href="/qr/T1"
                  className="text-sm font-medium text-amber-200 transition hover:text-amber-100"
                >
                  View QR flow
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
