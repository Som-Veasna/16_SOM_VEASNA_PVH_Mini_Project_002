'use client'

import { Button } from "@heroui/react";
import React from "react";
import { useCart } from "../app/context/CartContext";
import { useToast } from "../app/context/ToastContext";

export default function ButtonAddComponent({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAdd = () => {
    addToCart(product);
    addToast({
      title: "Item added!",
      description: `${product.productName} is now in your cart.`,
      color: "success",
    });
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      onPress={handleAdd}
      className="size-10 rounded-full bg-violet-600 text-xl font-light text-white shadow-md transition hover:bg-violet-500 active:scale-95"
    >
      +
    </Button>
  );
}