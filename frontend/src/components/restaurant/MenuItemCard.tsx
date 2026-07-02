"use client";

import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { MenuItem } from "@/lib/restaurantData";
import { useCart } from "@/context/CartContext";

interface Props {
  item: MenuItem;
}

export function MenuItemCard({ item }: Props) {
  const { items, addItem, updateQty } = useCart();
  const cartEntry = items.find((i) => i.menuItem.id === item.id);
  const qty = cartEntry?.quantity ?? 0;

  return (
    <div
      className={`rounded-[1.75rem] border bg-slate-900/70 p-5 shadow-lg shadow-black/20 transition ${
        item.available
          ? "border-white/10 hover:border-amber-400/30"
          : "border-white/5 opacity-50"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
            {item.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{item.description}</p>
        </div>
        <div className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-200">
          ${item.price}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-slate-950/50 px-2.5 py-0.5 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Cart controls */}
      <div className="mt-4 flex items-center justify-between">
        {!item.available ? (
          <span className="text-sm text-slate-500">Currently unavailable</span>
        ) : qty === 0 ? (
          <button
            onClick={() => addItem(item)}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQty(item.id, qty - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-white transition hover:bg-slate-700 active:scale-95"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-5 text-center font-semibold text-white">{qty}</span>
            <button
              onClick={() => updateQty(item.id, qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition hover:bg-amber-300 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
