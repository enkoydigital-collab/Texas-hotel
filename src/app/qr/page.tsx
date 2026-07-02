import { QrCode, ScanLine, Smartphone } from "lucide-react";

export default function QrPage() {
  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">QR Flow</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Scan to unlock contactless hotel dining.</h1>
            <p className="mt-4 text-slate-300">Each room and table receives a dynamic QR code containing room information, hotel branch details, and a guest session so service can begin instantly.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-amber-200"><ScanLine className="h-4 w-4" /> Scan from any device</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-amber-200"><Smartphone className="h-4 w-4" /> Open mobile menu instantly</div>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <div className="rounded-[1.5rem] border border-amber-400/30 bg-gradient-to-br from-amber-400/20 via-slate-800 to-slate-950 p-8 text-center">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-white/10">
                <QrCode className="h-24 w-24 text-amber-200" />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-amber-300">Room QR</p>
              <p className="mt-2 text-xl font-semibold text-white">Deluxe Suite • Branch 04</p>
              <p className="mt-3 text-sm text-slate-300">Scans available for guest ordering, bill requests, service calls, and support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
