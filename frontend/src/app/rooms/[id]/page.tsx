import Link from "next/link";
import { ArrowLeft, ArrowRight, BedDouble, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { rooms } from "@/lib/content";

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = rooms.find((item) => item.id === Number(params.id));

  if (!room) {
    notFound();
  }

  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to rooms
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">{room.category}</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{room.name}</h1>
            <p className="mt-4 text-slate-300">Premium comfort, refined design, and concierge features built for international guests.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Floor</p>
                <p className="mt-2 font-semibold text-white">{room.floor}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Bathroom</p>
                <p className="mt-2 font-semibold text-white">{room.bathroom}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-300">
              <BedDouble className="h-4 w-4 text-amber-300" /> {room.beds}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-amber-400/20 via-slate-800 to-slate-950 p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-300">From</p>
              <p className="mt-2 text-4xl font-semibold text-white">${room.price}<span className="text-lg text-slate-400">/night</span></p>
              <div className="mt-6 flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-200">{amenity}</span>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Link href="/book" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-amber-300">
                  Reserve this room <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="rounded-full border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
