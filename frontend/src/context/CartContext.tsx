"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { CartItem, MenuItem } from "@/lib/restaurantData";

// ─── State & Actions ──────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  tableId: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; note?: string } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QTY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_TABLE"; payload: { tableId: string } };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_TABLE":
      return { ...state, tableId: action.payload.tableId };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.menuItem.id === action.payload.menuItem.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menuItem.id === action.payload.menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { menuItem: action.payload.menuItem, quantity: 1, note: action.payload.note },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.menuItem.id !== action.payload.itemId),
      };

    case "UPDATE_QTY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.menuItem.id !== action.payload.itemId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItem.id === action.payload.itemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  tableId: string;
  totalItems: number;
  totalPrice: number;
  addItem: (menuItem: MenuItem, note?: string) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setTable: (tableId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], tableId: "" });

  const addItem = useCallback((menuItem: MenuItem, note?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, note } });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }, []);

  const updateQty = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const setTable = useCallback((tableId: string) => {
    dispatch({ type: "SET_TABLE", payload: { tableId } });
  }, []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ ...state, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart, setTable }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
