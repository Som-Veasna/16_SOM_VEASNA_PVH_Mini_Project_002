import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch("https://homework-api.noevchanmakara.site/api/v1/auths/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();

          if (!res.ok || !data) return null;

          const payload = data?.payload ?? data?.data ?? data;
          const user = payload?.user ?? payload;

          const accessToken =
            payload?.accessToken ||
            payload?.access_token ||
            payload?.token ||
            data?.accessToken ||
            data?.access_token ||
            data?.token;

          if (!accessToken) return null;

          return {
            id: user?.id || user?.userId || user?._id || credentials.email,
            name: user?.name || user?.fullName || user?.username || "User",
            email: user?.email || credentials.email,
            token: accessToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "any-secret-for-demo", 
});
