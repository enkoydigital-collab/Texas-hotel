import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;
  const role = (session?.user as { role?: string })?.role;

  // ── Protect /admin routes — admin only ──────────────────────────
  if (path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?from=admin", nextUrl));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  // ── Protect /chef route — approved chefs + admin ─────────────────
  if (path.startsWith("/chef")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?from=chef", nextUrl));
    }
    if (role === "pending") {
      return NextResponse.redirect(new URL("/pending", nextUrl));
    }
    if (role !== "chef" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/chef/:path*"],
};
