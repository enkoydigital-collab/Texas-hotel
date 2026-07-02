"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  ReceiptText,
  ArrowLeft,
} from "lucide-react";
import { orderStore } from "@/lib/orderStore";
import {
  type Order,
  type OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/restaurantData";

const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "pending", label: "Order placed", icon: <Clock className="h-5 w-5" /> },
  { status: "confirmed", label: "Confirmed", icon: <CheckCircle2 className="h-5 w-5" /> },
  { status: "preparing", label: "Preparing", icon: <ChefHat className="h-5 w-5" /> },
  { status: "ready", label: "Ready", icon: <Sparkles className="h-5 w-5" /> },
  { status: "served", label: "Served", icon: <UtensilsCrossed className="h-5 w-5" /> },
];

const stepOrder: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "served"];

function stepIndex(status: OrderStatus): number {
  return stepOrder.indexOf(status);
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (!orderId) return;
    // Initial load
    setOrder(orderStore.getOrder(orderId));

    // Subscribe to store changes (simulates real-time polling)
    const unsubscribe = orderStore.subscribe(() => {
      setOrder(orderStore.getOrder(orderId!));
    });

    return () => { unsubscribe(); };
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-slate-400">
        <div className="text-center">
          <p className="text-lg">Order not found</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200">
            <ArrowLeft className="h-4 w-4" /> Go home
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = stepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Status banner */}
        <div
          className={`rounded-[2rem] border p-6 text-center ${
            isCancelled
              ? "border-red-500/30 bg-red-500/10"
              : order.status === "served"
              ? "border-amber-400/30 bg-amber-400/10"
              : "border-white/10 bg-slate-900/70"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Order {order.id}</p>
          <p className={`mt-3 text-2xl font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </p>
          <p className="mt-2 text-sm text-slate-400">Table {order.tableId}</p>
        </div>

        {/* Progress stepper (only when not cancelled) */}
        {!isCancelled && (
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
            <div className="relative">
              {/* connector line */}
              <div className="absolute left-4 top-5 bottom-5 w-px bg-white/10" />

              <div className="space-y-6">
                {steps.map((step, idx) => {
                  const done = idx < currentIndex;
                  const active = idx === currentIndex;
                  return (
                    <div key={step.status} className="relative flex items-center gap-4">
                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition ${
                          done
                            ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
                            : active
                            ? "border-amber-400 bg-amber-400 text-slate-950"
                            : "border-white/10 bg-slate-800 text-slate-500"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          done || active ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </span>
                      {active && (
                        <span className="ml-auto rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300">
                          Now
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ReceiptText className="h-4 w-4 text-amber-300" />
            Receipt
          </div>
          <div className="mt-4 space-y-3">
            {order.items.map(({ menuItem, quantity }) => (
              <div key={menuItem.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  {menuItem.name} × {quantity}
                </span>
                <span className="font-medium text-white">${menuItem.price * quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-semibold text-amber-200">${order.total}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
              <p className="text-slate-400">Payment</p>
              <p className="mt-1 font-medium capitalize text-white">{order.paymentMethod}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
              <p className="text-slate-400">Status</p>
              <p className={`mt-1 font-medium capitalize ${ORDER_STATUS_COLORS[order.status]}`}>
                {order.paymentStatus.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Cash code */}
          {order.paymentMethod === "cash" && order.paymentRef && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-center">
              <p className="text-xs text-amber-400">Cash receipt code — show to waiter</p>
              <p className="mt-1 font-mono text-lg font-bold tracking-widest text-amber-200">
                {order.paymentRef}
              </p>
            </div>
          )}
        </div>

        <Link
          href={`/menu/${order.tableId}`}
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/70 py-3 text-sm text-slate-300 transition hover:border-white/30"
        >
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>
      </div>
    </div>
  );
}
