export type DashboardRole = "admin" | "staff" | "guest";

export const dashboardRoles = [
  {
    id: "admin" as const,
    label: "Admin view",
    summary: "Manage rooms, dining, payments, and occupancy in one place.",
  },
  {
    id: "staff" as const,
    label: "Staff view",
    summary: "Coordinate arrivals, housekeeping, and restaurant service.",
  },
  {
    id: "guest" as const,
    label: "Guest view",
    summary: "Track bookings, invoices, dining orders, and profile updates.",
  },
];

export const analyticsCards = [
  { label: "Occupancy", value: "92%", delta: "+6%" },
  { label: "Revenue", value: "$84k", delta: "+14%" },
  { label: "QR Orders", value: "1,240", delta: "+23%" },
  { label: "Check-ins", value: "318", delta: "+9%" },
];

export const roleContent: Record<DashboardRole, { title: string; metrics: Array<{ label: string; value: string }>; items: string[] }> = {
  admin: {
    title: "Admin view",
    metrics: [
      { label: "Reservations", value: "184" },
      { label: "Open Payments", value: "27" },
      { label: "Rooms Managed", value: "86" },
    ],
    items: ["Approve reservations", "Track restaurant inventory", "View occupancy and revenue", "Manage promotions and coupons"],
  },
  staff: {
    title: "Staff view",
    metrics: [
      { label: "Housekeeping", value: "12" },
      { label: "Pending Requests", value: "8" },
      { label: "Service Tickets", value: "5" },
    ],
    items: ["Coordinate housekeeping shifts", "Handle guest requests", "Support check-ins and check-outs", "Notify operations on maintenance issues"],
  },
  guest: {
    title: "Guest view",
    metrics: [
      { label: "Bookings", value: "3" },
      { label: "Invoices", value: "2" },
      { label: "Dining Orders", value: "6" },
    ],
    items: ["View booking history", "Access room invoices", "Track amenity requests", "Manage dining preferences"],
  },
};
