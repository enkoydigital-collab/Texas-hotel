"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2, CreditCard, Banknote, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import {
  generateOrderId,
  generateCashCode,
  type PaymentMethod,
  type Order,
} from "@/lib/restaurantData";
import { orderStore } from "@/lib/orderStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, totalPrice, totalItems, updateQty, removeItem, clearCart, tableId } = useCart();
  const [step, setStep] = useState<"cart" | "payment">("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("express");
  const [paymentRef, setPaymentRef] = useState("");
  const [cashCode, setCashCode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  function handlePlaceOrder() {
    setPlacingOrder(true);
    const code = paymentMethod === "cash" ? generateCashCode() : paymentRef;
    const orderId = generateOrderId();

    const order: Order = {
      id: orderId,
      tableId: tableId || "T1",
      items: [...items],
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "express" ? "pending_verification" : "unpaid",
      paymentRef: code,
      total: totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orderStore.addOrder(order);

    if (paymentMethod === "cash") {
      setCashCode(code);
    }

    clearCart();
    setPlacingOrder(false);
    onClose();
    setStep("cart");
    router.push(`/order-status/${orderId}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {step === "cart" ? "Your order" : "Payment"}
            </h2>
            <p className="text-sm text-slate-400">Table {tableId || "1"}</p>
          </div>
          <button
            onClick={() => { onClose(); setStep("cart"); }}
            className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-slate-500">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ menuItem, quantity }) => (
                    <div
                      key={menuItem.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-800/50 p-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{menuItem.name}</p>
                        <p className="text-sm text-amber-200">${menuItem.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(menuItem.id, quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-slate-700 text-white transition hover:bg-slate-600"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-white">{quantity}</span>
                        <button
                          onClick={() => updateQty(menuItem.id, quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition hover:bg-amber-300"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="w-14 text-right font-semibold text-white">
                        ${menuItem.price * quantity}
                      </p>
                      <button
                        onClick={() => removeItem(menuItem.id)}
                        className="text-slate-500 transition hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Select how you want to pay</p>

              {/* Express payment */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  paymentMethod === "express"
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-white/10 bg-slate-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="express"
                  checked={paymentMethod === "express"}
                  onChange={() => setPaymentMethod("express")}
                  className="mt-1 accent-amber-400"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-white">
                    <Smartphone className="h-4 w-4 text-amber-300" />
                    Express Payment
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Enter your mobile payment number to pay instantly.
                  </p>
                  {paymentMethod === "express" && (
                    <input
                      type="tel"
                      placeholder="e.g. +251 91 234 5678"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60"
                    />
                  )}
                </div>
              </label>

              {/* Cash */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  paymentMethod === "cash"
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-white/10 bg-slate-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mt-1 accent-amber-400"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-white">
                    <Banknote className="h-4 w-4 text-amber-300" />
                    Cash Payment
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    A unique receipt code will be generated for your waiter to verify.
                  </p>
                </div>
              </label>

              {/* Card */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  paymentMethod === "card"
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-white/10 bg-slate-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1 accent-amber-400"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-white">
                    <CreditCard className="h-4 w-4 text-amber-300" />
                    Card Payment
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Pay at the table with your debit or credit card.
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
            <span className="text-xl font-semibold text-white">${totalPrice}</span>
          </div>

          {step === "cart" ? (
            <button
              onClick={() => setStep("payment")}
              disabled={items.length === 0}
              className="mt-4 w-full rounded-full bg-amber-400 py-3 font-medium text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[.98]"
            >
              Proceed to payment
            </button>
          ) : (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setStep("cart")}
                className="flex-1 rounded-full border border-white/10 py-3 text-sm text-slate-300 transition hover:border-white/30"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || (paymentMethod === "express" && !paymentRef.trim())}
                className="flex-1 rounded-full bg-amber-400 py-3 font-medium text-slate-950 transition hover:bg-amber-300 disabled:opacity-40 active:scale-[.98]"
              >
                {placingOrder ? "Placing…" : "Place order"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
