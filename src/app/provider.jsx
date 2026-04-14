"use client";

import { HeroUIProvider } from "@heroui/react";
import React from "react";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { SessionProvider } from "next-auth/react";

export default function Provider({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartProvider>
          <HeroUIProvider>{children}</HeroUIProvider>
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
