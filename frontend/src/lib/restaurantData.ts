// ─── Types ────────────────────────────────────────────────────────────────────

export type MenuCategory = "Breakfast" | "Lunch" | "Dinner" | "Drinks" | "Desserts" | "Starters";

export type OrderStatus =
  | "pending"      // placed, waiting admin to confirm
  | "confirmed"    // admin confirmed, sent to kitchen
  | "preparing"    // chef is cooking
  | "ready"        // chef marked ready, waiting waiter
  | "served"       // delivered to table
  | "cancelled";

export type PaymentMethod = "express" | "cash" | "card";

export type PaymentStatus = "unpaid" | "paid" | "pending_verification";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  tags: string[];
  available: boolean;
  image?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string;   // phone number for express, cash receipt code
  total: number;
  createdAt: string;
  updatedAt: string;
  assignedChef?: string;
}

// ─── Static menu data ─────────────────────────────────────────────────────────

export const menuData: MenuItem[] = [
  // Starters
  {
    id: "m1",
    name: "Crispy Calamari",
    category: "Starters",
    price: 14,
    description: "Lightly breaded squid rings with zesty marinara dipping sauce.",
    tags: ["Seafood", "Crispy"],
    available: true,
  },
  {
    id: "m2",
    name: "Bruschetta Platter",
    category: "Starters",
    price: 11,
    description: "Toasted ciabatta with heirloom tomatoes, fresh basil, and aged balsamic.",
    tags: ["Vegetarian", "Chef's Pick"],
    available: true,
  },
  // Breakfast
  {
    id: "m3",
    name: "Sunrise Breakfast",
    category: "Breakfast",
    price: 18,
    description: "Selection of pastries, scrambled eggs, and fresh fruit platter.",
    tags: ["Breakfast", "Popular"],
    available: true,
  },
  {
    id: "m4",
    name: "Texas Avocado Toast",
    category: "Breakfast",
    price: 16,
    description: "Sourdough with smashed avocado, poached eggs, and chili flakes.",
    tags: ["Healthy", "Vegetarian"],
    available: true,
  },
  // Lunch
  {
    id: "m5",
    name: "Grilled Chicken Wrap",
    category: "Lunch",
    price: 17,
    description: "Herb-marinated chicken, fresh greens, and garlic aioli in a warm tortilla.",
    tags: ["Protein", "Popular"],
    available: true,
  },
  {
    id: "m6",
    name: "Caesar Salad",
    category: "Lunch",
    price: 13,
    description: "Romaine lettuce, parmesan shavings, croutons, and house Caesar dressing.",
    tags: ["Vegetarian"],
    available: true,
  },
  // Dinner
  {
    id: "m7",
    name: "Truffle Risotto",
    category: "Dinner",
    price: 24,
    description: "Creamy arborio with wild mushrooms, truffle oil, and aged parmesan.",
    tags: ["Signature", "Vegetarian"],
    available: true,
  },
  {
    id: "m8",
    name: "Texas Ribeye",
    category: "Dinner",
    price: 42,
    description: "12oz prime ribeye with roasted garlic butter, served with seasonal vegetables.",
    tags: ["Signature", "Meat"],
    available: true,
  },
  {
    id: "m9",
    name: "Pan-Seared Salmon",
    category: "Dinner",
    price: 32,
    description: "Atlantic salmon with lemon caper sauce and herb-roasted potatoes.",
    tags: ["Seafood", "Healthy"],
    available: true,
  },
  // Drinks
  {
    id: "m10",
    name: "Ocean Breeze",
    category: "Drinks",
    price: 12,
    description: "Citrus and mint mocktail with sparkling water and a lime wheel.",
    tags: ["Refreshing", "Non-Alcoholic"],
    available: true,
  },
  {
    id: "m11",
    name: "Classic Lemonade",
    category: "Drinks",
    price: 7,
    description: "Freshly squeezed lemonade with a hint of ginger.",
    tags: ["Refreshing", "Non-Alcoholic"],
    available: true,
  },
  {
    id: "m12",
    name: "Espresso",
    category: "Drinks",
    price: 5,
    description: "Double shot of house-blend espresso.",
    tags: ["Hot", "Coffee"],
    available: true,
  },
  // Desserts
  {
    id: "m13",
    name: "Lemon Tart",
    category: "Desserts",
    price: 9,
    description: "Bright citrus tart with vanilla bean cream and powdered sugar.",
    tags: ["Chef's Pick", "Sweet"],
    available: true,
  },
  {
    id: "m14",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 11,
    description: "Warm dark chocolate cake with a molten center, served with vanilla ice cream.",
    tags: ["Sweet", "Popular"],
    available: true,
  },
];

export const menuCategories: MenuCategory[] = [
  "Starters",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Drinks",
  "Desserts",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function generateCashCode(): string {
  return `CASH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Waiting for confirmation",
  confirmed: "Confirmed — sent to kitchen",
  preparing: "Chef is preparing your order",
  ready: "Your order is ready!",
  served: "Served — enjoy your meal!",
  cancelled: "Order cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-300",
  confirmed: "text-blue-300",
  preparing: "text-orange-300",
  ready: "text-green-300",
  served: "text-amber-300",
  cancelled: "text-red-400",
};
