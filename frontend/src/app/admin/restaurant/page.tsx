"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UtensilsCrossed,
  ShieldCheck,
  RefreshCcw,
  ReceiptText,
  BarChart2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  ChefHat,
  Clock,
  CheckCircle2,
  Sparkles,
  XCircle,
  Users,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { orderStore } from "@/lib/orderStore";
import {
  menuData as initialMenu,
  type MenuItem,
  type Order,
  type OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/restaurantData";

type AdminTab = "orders" | "menu" | "analytics" | "staff";

const STATUS_ACTIONS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  pending: { next: "confirmed", label: "Confirm order" },
  confirmed: { next: "preparing", label: "Send to chef" },
  preparing: { next: "ready", label: "Mark ready" },
  ready: { next: "served", label: "Mark served" },
};

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle2 className="h-4 w-4" />,
  preparing: <ChefHat className="h-4 w-4" />,
  ready: <Sparkles className="h-4 w-4" />,
  served: <UtensilsCrossed className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export default function AdminRestaurantPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [tick, setTick] = useState(0);
  const [chefs, setChefs] = useState<{ email: string; status: string }[]>([]);

  // Subscribe to order store
  useEffect(() => {
    const unsub = orderStore.subscribe(() => {
      setOrders(orderStore.getAllOrders());
    });
    setOrders(orderStore.getAllOrders());
    return () => { unsub(); };
  }, []);

  // Simulate polling refresh label
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  // Load chef approvals when on staff tab
  useEffect(() => {
    if (tab === "staff") {
      fetch("/api/chef-approvals")
        .then((r) => r.json())
        .then((d) => setChefs(d.chefs ?? []));
    }
  }, [tab, tick]);

  async function handleChefAction(email: string, action: "approve" | "reject") {
    await fetch("/api/chef-approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action }),
    });
    setChefs((prev) =>
      prev.map((c) =>
        c.email === email
          ? { ...c, status: action === "approve" ? "approved" : "rejected" }
          : c
      )
    );
  }

  const visibleOrders = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  function advanceOrder(order: Order) {
    const action = STATUS_ACTIONS[order.status];
    if (action) orderStore.updateStatus(order.id, action.next);
  }

  function cancelOrder(order: Order) {
    orderStore.updateStatus(order.id, "cancelled");
  }

  function toggleAvailability(id: string) {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
  }

  function saveEdit(updated: MenuItem) {
    setMenuItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditItem(null);
  }

  const ordersByStatus: Record<string, number> = {};
  orders.forEach((o) => {
    ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;
  });
  const totalRevenue = orders
    .filter((o) => o.status === "served")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
              <ShieldCheck className="h-4 w-4" /> Admin Panel
            </div>
            <h1 className="mt-1 text-3xl font-semibold text-white">Restaurant Management</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage orders, menu items, and view analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="avatar" className="h-9 w-9 rounded-full border border-white/10" />
            )}
            <div className="text-right text-sm hidden sm:block">
              <p className="font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-amber-300">Administrator</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total orders", value: orders.length, color: "text-white" },
            { label: "Pending", value: ordersByStatus["pending"] ?? 0, color: "text-yellow-300" },
            { label: "In kitchen", value: (ordersByStatus["confirmed"] ?? 0) + (ordersByStatus["preparing"] ?? 0), color: "text-orange-300" },
            { label: "Revenue served", value: `$${totalRevenue}`, color: "text-amber-200" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          {(["orders", "menu", "analytics", "staff"] as AdminTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-amber-400 text-slate-950"
                  : "border border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/30"
              }`}
            >
              {t === "staff" ? (
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Staff</span>
              ) : t}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ─────────────────────────────────────────── */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Status filter */}
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "confirmed", "preparing", "ready", "served", "cancelled"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                      filterStatus === s
                        ? "bg-white/20 text-white"
                        : "border border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s === "all" ? "All" : s} {s !== "all" && ordersByStatus[s] ? `(${ordersByStatus[s]})` : ""}
                  </button>
                )
              )}
            </div>

            {visibleOrders.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-500">
                No orders yet
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {visibleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5"
                  >
                    {/* Order header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">{order.id}</p>
                        <p className="text-xs text-slate-400">Table {order.tableId}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_ICON[order.status]}
                        {order.status}
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="mt-3 space-y-1 text-sm text-slate-300">
                      {order.items.map(({ menuItem, quantity }) => (
                        <li key={menuItem.id} className="flex justify-between">
                          <span>{menuItem.name} ×{quantity}</span>
                          <span className="text-slate-400">${menuItem.price * quantity}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="text-sm">
                        <span className="text-slate-400">Total </span>
                        <span className="font-semibold text-amber-200">${order.total}</span>
                        <span className="ml-3 text-xs capitalize text-slate-500">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {STATUS_ACTIONS[order.status] && (
                          <button
                            onClick={() => advanceOrder(order)}
                            className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-950 transition hover:bg-amber-300"
                          >
                            {STATUS_ACTIONS[order.status]!.label}
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "served" && (
                          <button
                            onClick={() => cancelOrder(order)}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cash code */}
                    {order.paymentMethod === "cash" && order.paymentRef && (
                      <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-center">
                        <p className="text-xs text-amber-400">Cash code</p>
                        <p className="font-mono text-sm font-bold tracking-widest text-amber-200">
                          {order.paymentRef}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MENU TAB ──────────────────────────────────────────── */}
        {tab === "menu" && (
          <div className="space-y-4">
            {editItem && (
              <EditMenuModal
                item={editItem}
                onSave={saveEdit}
                onCancel={() => setEditItem(null)}
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[1.75rem] border bg-slate-900/70 p-5 ${
                    item.available ? "border-white/10" : "border-red-500/20 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-300">
                        {item.category}
                      </p>
                      <p className="mt-1 font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-amber-200">${item.price}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition ${
                        item.available ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.available ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                    <button
                      onClick={() => setEditItem(item)}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-white/30 hover:text-white"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ─────────────────────────────────────── */}
        {tab === "analytics" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {(["pending", "confirmed", "preparing", "ready", "served", "cancelled"] as OrderStatus[]).map(
                (s) => (
                  <div
                    key={s}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className={`flex items-center gap-2 text-sm font-medium capitalize ${ORDER_STATUS_COLORS[s]}`}>
                      {STATUS_ICON[s]} {s}
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {ordersByStatus[s] ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">orders</p>
                  </div>
                )
              )}
            </div>

            {/* Most ordered items */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <BarChart2 className="h-4 w-4 text-amber-300" /> Most ordered items
              </div>
              <div className="mt-4 space-y-3">
                {(() => {
                  const counts: Record<string, { name: string; count: number }> = {};
                  orders.forEach((o) =>
                    o.items.forEach(({ menuItem, quantity }) => {
                      counts[menuItem.id] = {
                        name: menuItem.name,
                        count: (counts[menuItem.id]?.count ?? 0) + quantity,
                      };
                    })
                  );
                  return Object.values(counts)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)
                    .map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{item.name}</span>
                        <span className="font-semibold text-amber-200">{item.count}x</span>
                      </div>
                    ));
                })()}
                {orders.length === 0 && (
                  <p className="text-sm text-slate-500">No data yet</p>
                )}
              </div>
            </div>

            {/* Daily summary */}
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ReceiptText className="h-4 w-4 text-amber-300" /> Daily summary
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-slate-400">Total orders</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{orders.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-slate-400">Revenue (served)</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-200">${totalRevenue}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STAFF TAB ─────────────────────────────────────────── */}
        {tab === "staff" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Chefs who signed in with Google are listed here. Approve them to grant kitchen access.
            </p>
            {chefs.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-500">
                No chef sign-ins yet
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {chefs.map((chef) => (
                  <div key={chef.email} className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm font-bold text-white uppercase">
                        {chef.email[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">{chef.email}</p>
                        <span className={`text-xs font-medium capitalize ${
                          chef.status === "approved" ? "text-green-400" :
                          chef.status === "rejected" ? "text-red-400" :
                          "text-yellow-300"
                        }`}>● {chef.status}</span>
                      </div>
                    </div>
                    {chef.status === "pending" && (
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => handleChefAction(chef.email, "approve")}
                          className="flex-1 rounded-full bg-green-500 py-2 text-xs font-semibold text-white transition hover:bg-green-400">
                          Approve
                        </button>
                        <button onClick={() => handleChefAction(chef.email, "reject")}
                          className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20">
                          Reject
                        </button>
                      </div>
                    )}
                    {chef.status === "approved" && (
                      <button onClick={() => handleChefAction(chef.email, "reject")}
                        className="mt-4 w-full rounded-full border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20">
                        Revoke access
                      </button>
                    )}
                    {chef.status === "rejected" && (
                      <button onClick={() => handleChefAction(chef.email, "approve")}
                        className="mt-4 w-full rounded-full bg-green-500 py-2 text-xs font-semibold text-white transition hover:bg-green-400">
                        Re-approve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Edit menu item modal ──────────────────────────────────────────────────────

function EditMenuModal({
  item,
  onSave,
  onCancel,
}: {
  item: MenuItem;
  onSave: (updated: MenuItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...item });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">Edit menu item</h2>
        <div className="mt-4 space-y-3">
          {(["name", "description"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs capitalize text-slate-400">{field}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-400/60"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400">Price ($)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-400/60"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-slate-300 transition hover:border-white/30"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 rounded-full bg-amber-400 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
