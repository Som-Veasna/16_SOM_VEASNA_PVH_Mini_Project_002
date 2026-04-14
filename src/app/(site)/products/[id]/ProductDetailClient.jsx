"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../../../app/context/CartContext";
import { useToast } from "../../../../app/context/ToastContext";
import { useSession } from "next-auth/react";
import { updateProductRating } from "../../../../app/service/service";
import ProductVariationSelector from "../../../../components/shop/ProductVariationSelector";

function ClickableStars({ score, onClick, loading, itemId }) {
  const [hoverScore, setHoverScore] = useState(0);
  const { data: userData } = useSession();
  const loggedIn = !!userData?.user;

  const starClick = async (value) => {
    if (!loggedIn) return;
    if (onClick && !loading) {
      await onClick(value);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const active = starNum <= (hoverScore || score);
          return (
            <button
              key={starNum}
              type="button"
              onClick={() => starClick(starNum)}
              onMouseEnter={() => loggedIn && setHoverScore(starNum)}
              onMouseLeave={() => setHoverScore(0)}
              disabled={loading || !loggedIn}
              className={`transition-all duration-200 hover:rotate-12 ${
                loggedIn ? "cursor-pointer hover:scale-125 hover:shadow-lg" : "cursor-not-allowed"
              } ${loading ? "opacity-60" : ""}`}
              title={loggedIn ? `Give ${starNum} stars` : "Login required"}
            >
              <svg
                className={`h-6 w-6 ${
                  active ? "fill-gold-400 text-gold-400 drop-shadow-lg" : "fill-zinc-300 text-zinc-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      {!userData?.user && (
        <span className="text-xs text-zinc-500 italic">(Login to review)</span>
      )}
    </div>
  );
}

const groupStyle = {
  Skincare: "bg-cyan-100 text-cyan-800 ring-cyan-300/50",
  Makeup: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-300/50",
  Fragrance: "bg-amber-100 text-amber-800 ring-amber-300/50",
  Haircare: "bg-teal-100 text-teal-800 ring-teal-300/50",
};

function tagStyle(name) {
  return groupStyle[name] ?? "bg-violet-100 text-violet-800 ring-violet-300/50";
}

export default function ItemShowcase({ item: originalItem }) {
  const { addItem } = useCart();
  const { showAlert } = useToast();
  const { data: userSession } = useSession();
  const [count, setCount] = useState(1);
  const [chosenColor, setChosenColor] = useState(null);
  const [chosenSize, setChosenSize] = useState(null);
  const [activeScore, setActiveScore] = useState(0);
  const [scoreUpdating, setScoreUpdating] = useState(false);

  const item = originalItem?.payload ?? originalItem;

  if (!item || !item.productId && !item.id) {
    return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
      <div className="text-center p-20 bg-white rounded-3xl shadow-2xl border-4 border-rose-200">
        <div className="text-8xl mb-8">❓</div>
        <h1 className="text-4xl font-black text-rose-800 mb-4">Item Not Found</h1>
        <p className="text-xl text-rose-600">The product you're looking for doesn't exist</p>
      </div>
    </div>;
  }

  const itemId = item.productId || item.id;
  const itemTitle = item.name || item.productName;
  const groupName = item.categoryName || item.category?.name || "Item";
  const itemPrice = item.price;
  const itemDetails = item.description || "Details unavailable.";
  const mainImage = item.imageUrl;
  const availableColors = item.colors || [];
  const availableSizes = item.sizes || [];
  const itemScore = item.star || item.rating || 0;

  useEffect(() => {
    if (availableColors.length > 0 && !chosenColor) {
      setChosenColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !chosenSize) {
      setChosenSize(availableSizes[0]);
    }
    setActiveScore(itemScore);
  }, [availableColors, availableSizes, itemScore]);

  const submitScore = async (newScore) => {
    if (!userSession?.accessToken) {
      showAlert({
        title: "Login Required",
        description: "Sign in to leave ratings and reviews.",
        color: "info",
      });
      return;
    }

    setScoreUpdating(true);
    try {
      const response = await updateProductRating(itemId, newScore, userSession.accessToken);
      const newScoreValue = response?.payload?.star ?? response?.data?.star ?? newScore;
      setActiveScore(newScoreValue);
      
      showAlert({
        title: "Review Saved!",
        description: `Thanks for rating ${itemTitle} ${newScore} stars!`,
        color: "success",
      });
    } catch (err) {
      console.error("Score update failed:", err);
      
      if (err.message?.includes("auth") || err.message?.includes("token")) {
        showAlert({
          title: "Login Expired",
          description: "Please sign in again to continue rating.",
          color: "info",
        });
      } else {
        showAlert({
          title: "Rating Failed",
          description: err.message || "Please try rating again.",
          color: "error",
        });
      }
    } finally {
      setScoreUpdating(false);
    }
  };

  const addMultiple = () => {
    const itemData = {
      productId: itemId,
      productName: itemTitle,
      price: itemPrice,
      imageUrl: mainImage,
    };
    
    for (let i = 0; i < count; i++) {
      addItem(itemData, chosenColor, chosenSize);
    }
    
    const colorInfo = chosenColor ? ` (${chosenColor})` : '';
    const sizeInfo = chosenSize ? ` (${chosenSize})` : '';
    
    showAlert({
      title: "Basket Updated!",
      description: `${count} × ${itemTitle}${colorInfo}${sizeInfo} added successfully!`,
      color: "success"
    });
  };

  const imageSet = mainImage ? [
    mainImage,
    "https://images.unsplash.com/photo-1574169208507-84376144848b?w=900&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1593774636888-72c2f4c7b4d3?w=900&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1602295581005-6c8932e1be69?w=900&h=1200&fit=crop",
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      
      <div className="mx-auto w-full max-w-7xl px-8 pt-12 pb-8">
        <nav className="flex items-center gap-3 text-base text-teal-700 font-semibold mb-12">
          <Link href="/" className="hover:text-teal-900 transition-all duration-200 hover:underline">🏠 Home</Link>
          <span className="text-teal-400">/</span>
          <Link href="/catalog" className="hover:text-teal-900 transition-all duration-200 hover:underline">Catalog</Link>
          <span className="text-teal-400">/</span>
          <span className="font-black text-teal-900 truncate max-w-xs">{itemTitle}</span>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-7xl px-8 pb-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          <div className="flex flex-col gap-8">
            
            <div className="relative w-full h-[500px] overflow-hidden rounded-3xl border-4 border-teal-200/50 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={itemTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-500 text-7xl font-black drop-shadow-lg">
                  ◆
                </div>
              )}
            </div>

            {imageSet.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {imageSet.slice(0, 4).map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`relative h-32 overflow-hidden rounded-2xl border-3 bg-white shadow-xl cursor-pointer hover:scale-105 transition-all duration-200 ${
                      idx === 0 ? "border-teal-500 ring-4 ring-teal-200/50 shadow-teal-200/50" : "border-teal-100 hover:border-teal-300"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${itemTitle} - view ${idx + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-12">
            
            <div className={`inline-flex items-center px-5 py-2 rounded-2xl text-sm font-black ring-2 shadow-lg ${tagStyle(groupName)}`}>
              {groupName.toUpperCase()}
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-none text-slate-900 drop-shadow-lg tracking-tight">
                {itemTitle}
              </h1>
              <p className="text-lg font-mono text-teal-700 bg-teal-100/50 px-4 py-2 rounded-xl font-bold">
                ID: #{itemId?.toString().slice(0, 8)?.toUpperCase()}
              </p>
            </div>

            <ClickableStars
              score={activeScore}
              onClick={submitScore}
              loading={scoreUpdating}
              itemId={itemId}
            />

            <div className="text-6xl font-black text-teal-700 drop-shadow-2xl tracking-tight">
              ${itemPrice}
              <span className="ml-4 text-2xl font-normal text-teal-600">USD</span>
            </div>

            <hr className="border-teal-200 border-2 -mx-8 lg:-mx-12" />

            <div className="space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-widest text-teal-800 bg-teal-100 px-6 py-3 rounded-2xl inline-block shadow-md">
                Product Overview
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 font-medium max-w-2xl">{itemDetails}</p>
            </div>

            <ul className="grid grid-cols-1 gap-4 text-lg text-teal-800">
              {[
                "🚚 Free delivery over $99",
                "↩️ 45-day easy returns",
                "✅ 100% verified authentic",
                "⚡ Same/next day dispatch",
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border-l-4 border-teal-400 shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl font-black text-teal-600">→</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <ProductVariationSelector
              colors={availableColors}
              sizes={availableSizes}
              selectedColor={chosenColor}
              selectedSize={chosenSize}
              onColorChange={setChosenColor}
              onSizeChange={setChosenSize}
            />

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-xl font-bold text-slate-800">Amount:</span>
                <div className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl shadow-lg border-2 border-teal-200">
                  <button
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="w-14 h-14 rounded-2xl border-2 border-teal-300 bg-white text-teal-700 font-black text-2xl hover:bg-teal-50 hover:border-teal-400 hover:shadow-md transition-all duration-200 shadow-lg"
                    disabled={count <= 1}
                  >
                    −
                  </button>
                  <span className="w-20 text-center text-3xl font-black text-teal-800 bg-teal-100 px-6 py-3 rounded-2xl shadow-inner">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="w-14 h-14 rounded-2xl border-2 border-teal-300 bg-white text-teal-700 font-black text-2xl hover:bg-teal-50 hover:border-teal-400 hover:shadow-md transition-all duration-200 shadow-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={addMultiple}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xl py-6 px-12 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 active:scale-95 tracking-wide uppercase letter-spacing-1"
                >
                  🛒 Add to Basket
                </button>
                <button className="w-20 h-20 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl hover:rotate-180 transition-all duration-500 flex items-center justify-center text-3xl font-black hover:scale-110">
                  💖
                </button>
              </div>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 text-xl font-bold text-teal-700 hover:text-teal-900 transition-all duration-200 hover:underline decoration-2 underline-offset-4 group"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}