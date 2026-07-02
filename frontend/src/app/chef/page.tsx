"use client";

import { useState, useEffect } from "react";
import {
  ChefHat,
  Flame,
  CheckCircle2,
  Clock,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { orderStore } from "@/lib/orderStore";
import { type Order, ORDER_STATUS_COLORS } from "@/lib/restaurantData";

type KitchenTab = "queue" | "completed";

export default function ChefPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<KitchenTab>("queue");

  useEffect(() => {
    const unsub = orderStore.subscribe(() => {
      setOrders(orderStore.getAllOrders());
    });
    setOrders(orderStore.getAllOrders());
    return () => { unsub(); };
  }, []);

  // Chef only sees orders that are "confirmed" or "preparing"
  const queue = orders.filter(
    (o) => o.status === "confirmed" || o.status === "preparing"
  );
  // Completed = ready or served
  const completed = orders.filter(
    (o) => o.status === "ready" || o.status === "served"
  );

  function startPreparing(order: Order) {
    orderStore.updateStatus(order.id, "preparing");
  }

  function markReady(order: Order) {
    orderStore.updateStatus(order.id, "ready");
  }

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
              <ChefHat className="h-4 w-4" /> Kitchen View
            </div>
            <h1 className="mt-1 text-3xl font-semibold text-white">Chef Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Receive assigned orders, update preparation status, and notify when ready.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-center">
              <p className="text-xs text-slate-400">In queue</p>
              <p className="text-xl font-semibold text-orange-300">{queue.length}</p>
            </div>
            <div className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-2 text-center">
              <p className="text-xs text-slate-400">Completed</p>
              <p className="text-xl font-semibold text-green-300">{completed.length}</p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          {(["queue", "completed"] as KitchenTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-amber-400 text-slate-950"
                  : "border border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/30"
              }`}
            >
              {t === "queue" ? `Active (${queue.length})` : `Completed (${completed.length})`}
            </button>
          ))}
        </div>

        {/* Active queue */}
        {tab === "queue" && (
          <>
            {queue.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 text-slate-500">
                <Sparkles className="h-8 w-8 text-slate-600" />
                <p>No orders in the queue right now</p>
                <p className="text-xs">New confirmed orders will appear here automatically</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {queue.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStartPreparing={() => startPreparing(order)}
                    onMarkReady={() => markReady(order)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Completed orders */}
        {tab === "completed" && (
          <>
            {completed.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-500">
                No completed orders yet
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {completed.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 opacity-75"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">{order.id}</p>
                        <p className="text-xs text-slate-400">Table {order.tableId}</p>
                      </div>
                      <span
                        className={`flex items-center gap-1 rounded-full border border-white/10 bg-slate-800/60 px-3 py-1 text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {order.status}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-slate-300">
                      {order.items.map(({ menuItem, quantity }) => (
                        <li key={menuItem.id}>
                          {menuItem.name} × {quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-right text-sm font-semibold text-amber-200">
                      ${order.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Kitchen order card ────────────────────────────────────────────────────────

function KitchenOrderCard({
  order,
  onStartPreparing,
  onMarkReady,
}: {
  order: Order;
  onStartPreparing: () => void;
  onMarkReady: () => void;
}) {
  const isPreparing = order.status === "preparing";

  return (
    <div
      className={`rounded-[1.75rem] border p-5 transition ${
        isPreparing
          ? "border-orange-400/40 bg-orange-400/5 shadow-lg shadow-orange-400/10"
          : "border-blue-400/30 bg-slate-900/70"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-white">{order.id}</p>
          <p className="text-xs text-slate-400">Table {order.tableId}</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${
            isPreparing
              ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
              : "border-blue-400/30 bg-blue-400/10 text-blue-300"
          }`}
        >
          {isPreparing ? <Flame className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
          {isPreparing ? "Preparing" : "Confirmed"}
        </span>
      </div>

      {/* Items list */}
      <div className="mt-4 space-y-2">
        {order.items.map(({ menuItem, quantity }) => (
          <div
            key={menuItem.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm"
          >
            <span className="text-white">{menuItem.name}</span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
              ×{quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {!isPreparing ? (
          <button
            onClick={onStartPreparing}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400 active:scale-[.98]"
          >
            <Flame className="h-4 w-4" />
            Start preparing
          </button>
        ) : (
          <button
            onClick={onMarkReady}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-500 py-2.5 text-sm font-medium text-white transition hover:bg-green-400 active:scale-[.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as ready
          </button>
        )}
      </div>

      {/* Time info */}
      <p className="mt-3 text-right text-xs text-slate-500">
        <ReceiptText className="mr-1 inline h-3 w-3" />
        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
