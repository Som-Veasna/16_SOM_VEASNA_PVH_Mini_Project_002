import React from "react";
import { getOrders } from "@/app/service/service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PurchaseHistory() {
  const userSession = await auth();
  
  if (!userSession?.accessToken) {
    redirect("/login");
  }

  const orderData = await getOrders(userSession.accessToken);
  const purchaseList = orderData?.payload || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Purchase History
          </h1>
          <p className="text-xl text-slate-600 font-semibold max-w-2xl mx-auto leading-relaxed">
            Track all your completed orders and delivery details
          </p>
        </div>
        
        {purchaseList.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-4 border-indigo-200 p-20 text-center shadow-2xl mx-auto max-w-2xl">
            <div className="w-32 h-32 mx-auto mb-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">No Purchases Yet</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Your shopping journey starts here. No orders found for this account.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {purchaseList.map((purchase) => (
              <div key={purchase.orderId} className="group bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-indigo-200 p-10 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                
                <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-indigo-100">
                  <div>
                    <div className="text-xs font-black text-indigo-500 tracking-widest mb-2 uppercase bg-indigo-100 px-3 py-1 rounded-full inline-block">
                      Purchase #{purchase.orderId?.slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Amount</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${(purchase.totalAmount || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Account ID</div>
                    <div className="text-lg font-semibold text-slate-900 break-words bg-slate-50 px-4 py-2 rounded-xl border-l-4 border-indigo-400">
                      {purchase.appUserId}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Date Placed</div>
                    <div className="text-lg font-semibold text-slate-900 bg-slate-50 px-4 py-2 rounded-xl border-l-4 border-purple-400">
                      {purchase.orderDate ? new Date(purchase.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      }) : 'Pending'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Items</div>
                    <div className="text-2xl font-black text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-xl border-2 border-indigo-200 font-mono">
                      {purchase.orderDetailsResponse?.length || 0}
                    </div>
                  </div>
                </div>

                {purchase.orderDetailsResponse && purchase.orderDetailsResponse.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200/50">
                    <div className="text-sm font-black text-slate-700 tracking-widest mb-8 uppercase bg-gradient-to-r from-indigo-200 to-purple-200 px-6 py-3 rounded-xl inline-block shadow-md">
                      Purchase Breakdown
                    </div>
                    
                    <div className="space-y-6 divide-y-2 divide-indigo-100">
                      {purchase.orderDetailsResponse.map((productItem, idx) => (
                        <div key={productItem.productId || idx} className="flex items-center justify-between py-6 first:pt-0 last:pb-0 group/item">
                          <div className="flex flex-1 items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl flex items-center justify-center shadow-md">
                              <span className="text-indigo-600 font-bold text-lg">✓</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-sm font-medium mr-2">Item:</span>
                              <span className="font-bold text-slate-900 text-lg">{productItem.productName}</span>
                            </div>
                          </div>
                          <div className="text-center ml-8">
                            <div className="text-2xl font-bold text-indigo-700 mb-1">
                              {productItem.orderQty}
                            </div>
                            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Qty</div>
                          </div>
                          <div className="text-right ml-12">
                            <div className="text-xl font-black text-purple-700">
                              ${(productItem.orderTotal || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {purchaseList.length > 0 && (
          <div className="mt-20 p-12 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-indigo-200 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Total Orders: {purchaseList.length}</h3>
            <p className="text-lg text-slate-600">
              Keep shopping to see more purchase history updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}