import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// ─── Admin email (only this email gets admin role) ────────────────────────────
const ADMIN_EMAIL = "hailetadilo@gmail.com";

// ─── In-memory chef approval store ───────────────────────────────────────────
// In production replace with a real database (Postgres, MongoDB, etc.)
export const chefApprovals = new Map<string, "pending" | "approved" | "rejected">();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? "";

      // Admin always allowed
      if (email === ADMIN_EMAIL) return true;

      // For chefs: register them as pending if first time
      if (!chefApprovals.has(email)) {
        chefApprovals.set(email, "pending");
      }

      const status = chefApprovals.get(email);

      // Block rejected chefs
      if (status === "rejected") return false;

      // Allow admin and approved chefs through; pending chefs land on /pending
      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        if (user.email === ADMIN_EMAIL) {
          token.role = "admin";
        } else {
          const status = chefApprovals.get(user.email) ?? "pending";
          token.role = status === "approved" ? "chef" : "pending";
        }
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image ?? undefined;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.picture as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
