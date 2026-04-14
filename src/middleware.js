import { auth } from "@/auth";
import { NextResponse } from "next/server";

const openRoutes = ["/", "/login", "/register"];
const guestOnlyRoutes = ["/login", "/register"];
const loginPath = "/login";
const afterLoginPath = "/";

export default async function middleware(request) {
  const { nextUrl } = request;
  const session = await auth();

  const loggedIn = !!session?.user;
  const isOpen = openRoutes.includes(nextUrl.pathname);
  const isGuestOnly = guestOnlyRoutes.includes(nextUrl.pathname);

  if (!loggedIn && !isOpen) {
    const dest = new URL(loginPath, nextUrl.origin);
    dest.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(dest);
  }

  if (loggedIn && isGuestOnly) {
    return NextResponse.redirect(new URL(afterLoginPath, nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};