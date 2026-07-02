import { NextRequest, NextResponse } from "next/server";
import { auth, chefApprovals } from "@/auth";

// GET — list all pending chefs (admin only)
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = Array.from(chefApprovals.entries()).map(([email, status]) => ({
    email,
    status,
  }));

  return NextResponse.json({ chefs: list });
}

// POST — approve or reject a chef (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, action } = await req.json() as {
    email: string;
    action: "approve" | "reject";
  };

  if (!email || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  chefApprovals.set(email, action === "approve" ? "approved" : "rejected");

  return NextResponse.json({ ok: true, email, status: chefApprovals.get(email) });
}
