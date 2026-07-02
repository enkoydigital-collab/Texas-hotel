import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, ShieldCheck } from "lucide-react";

export default function BookPage() {
  return (
    <div className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Reserve</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Plan a stay in minutes.</h1>
            <p className="mt-4 text-slate-300">Real-time availability, luxurious room options, and flexible payments combine into a smooth reservation flow.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <CalendarDays className="mt-1 h-5 w-5 text-amber-300" />
                <div>
                  <p className="font-semibold text-white">Live calendar availability</p>
                  <p className="text-sm text-slate-400">Check-in and check-out dates are synced with room inventory.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <CreditCard className="mt-1 h-5 w-5 text-amber-300" />
                <div>
                  <p className="font-semibold text-white">International payments</p>
                  <p className="text-sm text-slate-400">Support for cards, Stripe, PayPal, transfers, and deposit-based reservations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <ShieldCheck className="mt-1 h-5 w-5 text-amber-300" />
                <div>
                  <p className="font-semibold text-white">Secure confirmation</p>
                  <p className="text-sm text-slate-400">Email and SMS confirmations keep guests informed at every step.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
            <div className="rounded-[1.5rem] border border-amber-400/20 bg-gradient-to-br from-amber-400/15 via-slate-900 to-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Reservation summary</p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Room</span>
                  <span className="font-semibold text-white">Deluxe Ocean Suite</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-in</span>
                  <span className="font-semibold text-white">Aug 16</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Check-out</span>
                  <span className="font-semibold text-white">Aug 19</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span>Total</span>
                  <span className="text-xl font-semibold text-amber-200">$945</span>
                </div>
              </div>
              <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-amber-300">
                Continue booking <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
