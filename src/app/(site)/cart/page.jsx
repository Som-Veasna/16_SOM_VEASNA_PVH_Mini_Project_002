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
  const { cartProducts, removeItem, updateQty, cartTotal, clearCart } = useCart();
  const { data: sessionData } = useSession();
  const route = useRouter();
  const { displayToast } = useToast();
  const [orderInProgress, setOrderInProgress] = useState(false);

  const handleCheckout = async () => {
    if (!sessionData?.accessToken) {
      displayToast({
        title: "Please Login",
        description: "You need to sign in first",
        color: "danger"
      });
      route.push("/login");
      return;
    }

    setOrderInProgress(true);
    try {
      const orderItems = {
        items: cartProducts.map((item) => ({
          id: item.productId,
          qty: item.quantity,
        })),
      };

      await createOrder(orderItems, sessionData.accessToken);
      clearCart();
      displayToast({
        title: "Order Placed",
        description: "Your order has been processed!",
        color: "success"
      });
      route.push("/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      displayToast({
        title: "Checkout Failed",
        description: error.message || "Something went wrong",
        color: "danger"
      });
    } finally {
      setOrderInProgress(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-green-50 py-20 px-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-12 text-5xl font-extrabold text-green-800">Your Cart</h1>
          <div className="bg-white rounded-2xl p-20 text-center border-4 border-green-200">
            <div className="mb-10 text-9xl">🛒</div>
            <h2 className="mb-6 text-3xl font-bold text-green-800">Cart is empty</h2>
            <p className="mb-16 text-green-600 text-xl">Add some products to continue.</p>
            <Link href="/catalog">
              <Button className="rounded-2xl bg-purple-500 font-bold text-white px-16 py-6 text-xl hover:bg-purple-400 shadow-xl">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-16 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-green-800">Cart Items</h1>
          <p className="mt-4 text-green-700 font-bold">{cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in cart</p>
        </div>

        <div className="flex gap-16">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100">
              <div className="p-10 border-b-2 border-green-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-green-800">Cart Contents</h2>
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    onPress={clearCart}
                    className="rounded-2xl bg-orange-100 text-orange-700 hover:bg-orange-50 font-bold px-8 py-3"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="divide-y-2 divide-green-100">
                {cartProducts.map((item) => (
                  <div key={`${item.productId}-${item.color || 'any'}-${item.size || 'any'}`} className="p-10">
                    <div className="flex gap-8">
                      <div className="w-40 h-40 bg-green-100 rounded-xl overflow-hidden relative border-4 border-green-200">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-green-200 text-green-500 text-3xl">
                            ●
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-2xl text-green-800">{item.productName}</h3>
                          <p className="text-xl text-green-600 mt-3">${item.price}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-8">
                          <div className="flex items-center gap-6">
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => updateQty(item.productId, item.color, item.size, item.quantity - 1)}
                              className="w-16 h-16 rounded-xl bg-green-200 text-green-700 font-bold text-2xl hover:bg-green-300"
                              isDisabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="w-16 text-center text-3xl font-extrabold text-green-800">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => updateQty(item.productId, item.color, item.size, item.quantity + 1)}
                              className="w-16 h-16 rounded-xl bg-green-200 text-green-700 font-bold text-2xl hover:bg-green-300"
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <span className="text-3xl font-extrabold text-green-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() => removeItem(item.productId, item.color, item.size)}
                              className="w-16 h-16 rounded-xl bg-orange-200 text-orange-600 font-bold text-3xl hover:bg-orange-300"
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

          <div className="w-96">
            <div className="bg-white rounded-2xl shadow-xl p-10 border-2 border-green-100 sticky top-16">
              <h2 className="text-2xl font-extrabold text-green-800 mb-10">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between">
                  <span className="text-green-700 font-bold">Sub Total</span>
                  <span className="font-extrabold text-2xl">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-bold">Shipping</span>
                  <span className="font-extrabold text-2xl">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-bold">Tax</span>
                  <span className="font-extrabold text-2xl">Calculated</span>
                </div>
              </div>
              
              <div className="border-t-2 border-green-300 pt-8 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-extrabold text-green-800">Total</span>
                  <span className="text-4xl font-extrabold text-green-800">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <Button
                  className="w-full rounded-2xl bg-purple-500 font-extrabold text-white text-xl py-6 hover:bg-purple-400 shadow-xl"
                  size="lg"
                  onPress={handleCheckout}
                  isLoading={orderInProgress}
                >
                  Place Order
                </Button>
                
                <Link href="/catalog">
                  <Button
                    variant="flat"
                    className="w-full rounded-2xl border-2 border-green-300 bg-green-100 text-green-700 font-bold text-xl py-6 hover:bg-green-200"
                    size="lg"
                  >
                    Continue Shopping
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