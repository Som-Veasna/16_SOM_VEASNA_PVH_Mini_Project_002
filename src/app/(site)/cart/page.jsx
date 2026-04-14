"use client";

import { useCart } from "@/app/context/CartContext";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/service/service";
import { useToast } from "@/app/context/ToastContext";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [placing, setPlacing] = useState(false);

  const checkout = async () => {
    if (!session?.accessToken) {
      addToast({ title: "Login required", description: "Sign in to place an order.", color: "danger" });
      router.push("/login");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        orderDetailRequests: cartItems.map((i) => ({
          productId: i.productId,
          orderQty: i.quantity,
        })),
      };

      await createOrder(payload, session.accessToken);
      clearCart();
      addToast({ title: "Order placed!", description: "Your order was submitted successfully.", color: "success" });
      router.push("/order");
    } catch (err) {
      addToast({ title: "Checkout failed", description: err.message || "Please try again.", color: "danger" });
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Your Cart</h1>
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mb-5 text-6xl">🛍️</div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Nothing here yet</h2>
            <p className="mb-8 text-gray-400">Add some products to get started.</p>
            <Link href="/products">
              <Button className="rounded-full bg-violet-600 font-bold text-white hover:bg-violet-500">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-1 text-gray-400">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Items</h2>
                <Button variant="flat" color="danger" size="sm" onPress={clearCart} className="rounded-full text-xs">
                  Remove all
                </Button>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.color || "x"}-${item.size || "x"}`} className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">◇</div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{item.productName}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">${item.price}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                              className="h-7 w-7 rounded-full p-0 min-w-7"
                              isDisabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                              className="h-7 w-7 rounded-full p-0 min-w-7"
                            >
                              +
                            </Button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() => removeFromCart(item.productId, item.color, item.size)}
                              className="h-7 w-7 rounded-full p-0 min-w-7"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm p-6 sticky top-8">
              <h2 className="text-base font-bold text-gray-900 mb-5">Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-semibold text-gray-400">At checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full rounded-full bg-violet-600 font-bold text-white hover:bg-violet-500"
                  size="lg"
                  onPress={checkout}
                  isLoading={placing}
                >
                  Checkout
                </Button>
                <Link href="/products">
                  <Button variant="flat" className="w-full rounded-full" size="lg">
                    Keep Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}