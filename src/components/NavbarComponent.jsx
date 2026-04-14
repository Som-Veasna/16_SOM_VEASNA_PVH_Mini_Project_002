"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../app/context/CartContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop", badge: "NEW" },
  { href: "/manage-products", label: "Manage Products" },
  { href: "/order", label: "Orders" },
];

function BagIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function isNavActive(pathname, label) {
  if (label === "Home") return pathname === "/";
  if (label === "Shop") return pathname === "/products" || pathname.startsWith("/products/");
  if (label === "Orders") return pathname === "/order";
  if (label === "Manage Products") return pathname === "/manage-products";
  return false;
}

function UserDropdown({ session }) {
  const [open, setOpen] = useState(false);
  const initial = session?.user?.name?.[0] || session?.user?.email?.[0] || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
      >
        {initial.toUpperCase()}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function getAuthClass(pathname, path, solid = false) {
  const active = pathname === path;
  if (solid) {
    return active
      ? "rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
      : "rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-400";
  }
  return active
    ? "rounded-full px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300"
    : "rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:text-gray-900";
}

export default function NavbarComponent() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { totalQuantity } = useCart();

  const cartAriaLabel = totalQuantity > 0 ? `Cart, ${totalQuantity} items` : "Cart";

  const itemClass = (active) =>
    `relative flex items-center rounded-full px-3 py-2 text-sm font-medium transition ${
      active ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-lg">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-3">
        <Link href="/" className="z-10 shrink-0 text-lg font-bold tracking-tight text-gray-900 transition hover:text-violet-600">
          BloomShop
        </Link>

        <nav className="absolute left-1/2 hidden w-auto -translate-x-1/2 items-center gap-1 md:flex" aria-label="Main">
          {navItems.map(({ href, label, badge }) => {
            const active = isNavActive(pathname, label);
            return (
              <Link key={href + label} href={href} className={itemClass(active)}>
                {badge && (
                  <span className="absolute -top-2 z-20 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                    {badge}
                  </span>
                )}
                <span className={badge ? "inline-block leading-none" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="z-10 flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            {status === "authenticated" ? (
              <UserDropdown session={session} />
            ) : (
              <>
                <Link href="/login" className={getAuthClass(pathname, "/login", false)}>Log in</Link>
                <Link href="/register" className={getAuthClass(pathname, "/register", true)}>Register</Link>
              </>
            )}
          </div>

          <Link
            href="/cart"
            aria-label={cartAriaLabel}
            className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              pathname === "/cart"
                ? "border-violet-400 bg-violet-100 text-violet-700"
                : "border-gray-200 text-gray-500 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            <BagIcon className="size-5" />
            <span
              className={`absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold leading-none text-white tabular-nums transition-opacity ${
                totalQuantity > 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden
            >
              {totalQuantity > 99 ? "99+" : totalQuantity}
            </span>
          </Link>

          <Button
            isIconOnly
            variant="secondary"
            className="h-9 w-9 shrink-0 rounded-full border border-gray-200 text-gray-600 md:hidden"
            aria-expanded={menuOpen}
            onPress={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? "✕" : "☰"}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white py-3 md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="rounded-xl px-3 py-3 text-left text-sm font-medium text-rose-500 hover:bg-rose-50"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Log in</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-violet-700 hover:bg-violet-50">Register</Link>
              </>
            )}
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cart {totalQuantity > 0 ? `(${totalQuantity})` : ""}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}