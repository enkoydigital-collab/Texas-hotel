import { redirect } from "next/navigation";

// /book is removed — redirect to rooms
export default function BookPage() {
  redirect("/rooms");
}
