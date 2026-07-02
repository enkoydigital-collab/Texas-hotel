"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QrCode, UtensilsCrossed, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function QrTablePage() {
  const params = useParams();
  const router = useRouter();
  const tableId = Array.isArray(params.tableId) ? params.tableId[0] : params.tableId;
  const { setTable } = useCart();

  useEffect(() => {
    if (tableId) {
      setTable(tableId);
    }
  }, [tableId, setTable]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-md w-full space-y-6">
        {/* QR confirmation card */}
        <div className="rounded-[2rem] border border-amber-400/30 bg-gradient-to-br from-amber-400/15 via-slate-900 to-slate-950 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
            <QrCode className="h-10 w-10 text-amber-300" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-amber-300">Table scanned</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Table {tableId}</h1>
          <p className="mt-3 text-slate-400">
            Welcome! Your session is linked to this table. Browse the menu and place your order below.
          </p>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400">Table number</p>
            <p className="mt-1 text-xl font-semibold text-white">{tableId}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400">Service</p>
            <p className="mt-1 text-sm font-semibold text-white">Restaurant Dining</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/menu/${tableId}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-[.98]"
        >
          <UtensilsCrossed className="h-5 w-5" />
          View menu & order
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-center text-xs text-slate-500">
          Orders are confirmed by our staff and prepared by the kitchen in real time.
        </p>
      </div>
    </div>
  );
}
