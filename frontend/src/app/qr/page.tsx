import { redirect } from "next/navigation";

// /qr redirects to the actual menu ordering flow at table T1
export default function QrPage() {
  redirect("/menu/T1");
}
