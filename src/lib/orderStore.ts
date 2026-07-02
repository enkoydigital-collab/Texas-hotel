/**
 * In-memory order store — acts as a lightweight stand-in for a real database.
 * In production this would be replaced by API calls to the Express backend.
 */

import type { Order, OrderStatus } from "./restaurantData";

// Singleton store accessible across the app (client-side only)
class OrderStore {
  private orders: Map<string, Order> = new Map();
  private listeners: Set<() => void> = new Set();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  addOrder(order: Order) {
    this.orders.set(order.id, order);
    this.notify();
  }

  updateStatus(orderId: string, status: OrderStatus) {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrdersByTable(tableId: string): Order[] {
    return this.getAllOrders().filter((o) => o.tableId === tableId);
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getAllOrders().filter((o) => o.status === status);
  }

  getActiveKitchenOrders(): Order[] {
    return this.getAllOrders().filter(
      (o) => o.status === "confirmed" || o.status === "preparing"
    );
  }
}

// Export a single instance
export const orderStore = new OrderStore();
