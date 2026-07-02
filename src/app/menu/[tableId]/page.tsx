"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { menuData, menuCategories, type MenuCategory } from "@/lib/restaurantData";
import { MenuItemCard } from "@/components/restaurant/MenuItemCard";
import { CartDrawer } from "@/components/restaurant/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function MenuPage() {
  const params = useParams();
  const tableId = Array.isArray(params.tableId) ? params.tableId[0] : params.tableId;
  const { setTable, totalItems, totalPrice } = useCart();

  const [activeCategory, setActiveCategory] = useState<MenuCategory | "All">("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (tableId) setTable(tableId);
  }, [tableId, setTable]);

  const filtered = menuData.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Table {tableId}</p>
              <h1 className="mt-1 text-3xl font-semibold text-white">Our Menu</h1>
              <p className="mt-1 text-sm text-slate-400">Browse, add to cart, and place your order.</p>
            </div>
            {/* Search */}
            <input
              type="text"
              placeholder="Search dishes, drinks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/50 sm:w-64"
            />
          </div>

          {/* Category tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(["All", ...menuCategories] as Array<MenuCategory | "All">).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-amber-400 text-slate-950"
                    : "border border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          {filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-slate-500">
              No items found
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 rounded-full bg-amber-400 px-6 py-3.5 font-semibold text-slate-950 shadow-xl shadow-amber-400/30 transition hover:bg-amber-300 active:scale-[.97]"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>View cart · {totalItems} item{totalItems !== 1 ? "s" : ""}</span>
            <span className="rounded-full bg-slate-950/20 px-2 py-0.5 text-sm">
              ${totalPrice}
            </span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
