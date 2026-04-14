import React from "react";
import { getOrders } from "@/app/service/service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  const result = await getOrders(session.accessToken);
  const orderList = result?.payload || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {orderList.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-400">Your completed orders will show up here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orderList.map((order) => (
              <div key={order.orderId} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">Order</p>
                    <p className="text-lg font-bold text-gray-900">#{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-300 mb-1">Total</p>
                    <p className="text-lg font-bold text-gray-900">${(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />

                <div className="grid grid-cols-2 gap-6 mb-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">User ID</p>
                    <p className="text-sm font-semibold text-gray-700 break-all">{order.appUserId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">Date</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">Items</p>
                    <p className="text-sm font-semibold text-gray-700">{order.orderDetailsResponse?.length || 0}</p>
                  </div>
                </div>

                {order.orderDetailsResponse && order.orderDetailsResponse.length > 0 && (
                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Line Items</p>
                    <div className="space-y-4">
                      {order.orderDetailsResponse.map((line, i) => (
                        <div key={line.productId || i} className="flex justify-between items-center text-sm">
                          <div className="flex flex-1 items-center gap-1">
                            <span className="text-gray-400">Product</span>
                            <span className="font-bold text-gray-800">{line.productName}</span>
                          </div>
                          <div className="w-28 text-center font-semibold text-gray-500">× {line.orderQty}</div>
                          <div className="w-20 text-right font-bold text-gray-900">${(line.orderTotal || 0).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}