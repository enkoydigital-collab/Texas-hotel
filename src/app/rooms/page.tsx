import Link from "next/link";
import { ArrowRight, BedDouble, Sparkles } from "lucide-react";
import { rooms } from "@/lib/content";

export default function RoomsPage() {
  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Rooms & Suites</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">A residence for every traveler.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">From cozy standard rooms to grand presidential suites, each stay is designed around comfort, service, and elevated details.</p>
          </div>
          <Link href="/book" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-amber-300">Check availability <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20">
              <div className="h-48 bg-gradient-to-br from-amber-400/20 via-slate-800 to-slate-950" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{room.category}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">{room.name}</h2>
                  </div>
                  <div className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">${room.price}/night</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full border border-white/10 px-3 py-1">{amenity}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <BedDouble className="h-4 w-4 text-amber-300" /> {room.beds}
                  </div>
                  <Link href={`/rooms/${room.id}`} className="text-sm font-medium text-amber-200 transition hover:text-amber-100">View details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
