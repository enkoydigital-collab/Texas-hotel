import Link from "next/link";
import { ArrowRight, BedDouble, Sparkles, UtensilsCrossed } from "lucide-react";
import { features, testimonials, rooms, menuItems } from "@/lib/content";

export default function Home() {
  return (
    <div className="bg-transparent">
      <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
              <Sparkles className="h-4 w-4" />
              Texas-hotel luxury hospitality
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Texas-hotel blends modern booking, smart QR dining, and premium stays in one seamless experience.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Discover elegant rooms, contactless room service, and effortless guest management designed for travelers who expect more.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-amber-300">
                Reserve a Room <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/restaurant" className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20">
                Explore QR Dining
              </Link>
            </div>
          </div>
          <div className="grid flex-1 gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Featured Suite</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Panoramic Presidential Residence</h2>
              <p className="mt-3 text-slate-300">Skyline views, priority concierge, and a private lounge crafted for elevated stays.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Occupancy</p>
                <p className="mt-2 text-3xl font-semibold text-white">92%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">QR Dining Orders</p>
                <p className="mt-2 text-3xl font-semibold text-white">1.2k</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-slate-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Stay in style</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Signature rooms</h2>
            </div>
            <Link href="/rooms" className="text-sm font-medium text-amber-200 transition hover:text-amber-100">View all rooms</Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
                <div className="h-48 bg-gradient-to-br from-amber-400/20 via-slate-800 to-slate-950" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{room.category}</p>
                      <h3 className="mt-1 text-2xl font-semibold text-white">{room.name}</h3>
                    </div>
                    <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
                      ${room.price}/night
                    </div>
                  </div>
                  <p className="mt-4 text-slate-300">{room.amenities.join(" • ")}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <BedDouble className="h-4 w-4 text-amber-300" /> {room.beds}
                    </div>
                    <Link href="/book" className="inline-flex items-center gap-2 text-sm font-medium text-amber-200">
                      Book now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">QR Dining</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Scan, browse, and order without leaving the room.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">GlobalHotel combines contactless dining with premium room service, giving guests a seamless experience from booking to checkout.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/restaurant" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                <UtensilsCrossed className="h-4 w-4" /> View menu
              </Link>
              <Link href="/qr" className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20">
                QR scanner flow
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between border-b border-white/10 py-4 last:border-none">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-amber-200">${item.price}</p>
                  <p className="text-xs text-slate-500">{item.tags.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white">Guest stories</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <p className="text-slate-200">“{testimonial.quote}”</p>
                <div className="mt-4 text-sm text-amber-200">
                  {testimonial.name} • {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
