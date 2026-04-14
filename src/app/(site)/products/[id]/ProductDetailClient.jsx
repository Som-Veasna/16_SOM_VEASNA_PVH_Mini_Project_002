"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../../../app/context/CartContext";
import { useToast } from "../../../../app/context/ToastContext";
import { useSession } from "next-auth/react";
import { updateProductRating } from "../../../../app/service/service";
import ProductVariationSelector from "../../../../components/shop/ProductVariationSelector";

function StarWidget({ rating, onRate, busy }) {
  const [hovered, setHovered] = useState(0);
  const { data: session } = useSession();
  const canRate = !!session?.user;

  const handleClick = async (val) => {
    if (!canRate || busy) return;
    await onRate(val);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => {
          const lit = s <= (hovered || rating);
          return (
            <button
              key={s}
              type="button"
              onClick={() => handleClick(s)}
              onMouseEnter={() => canRate && setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              disabled={busy || !canRate}
              className={`transition-all duration-150 ${canRate ? "cursor-pointer hover:scale-110" : "cursor-default"} ${busy ? "opacity-40" : ""}`}
              title={canRate ? `Rate ${s} stars` : "Sign in to rate"}
            >
              <svg
                className={`h-5 w-5 ${lit ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      {!session?.user && <span className="text-xs text-gray-400">(Sign in to rate)</span>}
    </div>
  );
}

const categoryStyles = {
  Skincare: "bg-sky-50 text-sky-700 ring-sky-200",
  Makeup: "bg-rose-50 text-rose-700 ring-rose-200",
  Fragrance: "bg-amber-50 text-amber-800 ring-amber-200",
  Haircare: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function catBadge(label) {
  return categoryStyles[label] ?? "bg-violet-50 text-violet-700 ring-violet-200";
}

export default function ProductDetailClient({ product: raw }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const [qty, setQty] = useState(1);
  const [chosenColor, setChosenColor] = useState(null);
  const [chosenSize, setChosenSize] = useState(null);
  const [starVal, setStarVal] = useState(0);
  const [ratingBusy, setRatingBusy] = useState(false);

  const item = raw?.payload ?? raw;

  if (!item || (!item.productId && !item.id)) {
    return <div>Product not found</div>;
  }

  const pid = item.productId || item.id;
  const pname = item.name || item.productName;
  const catLabel = item.categoryName || item.category?.name || "Product";
  const cost = item.price;
  const about = item.description || "No description available.";
  const thumb = item.imageUrl;
  const colorOptions = item.colors || [];
  const sizeOptions = item.sizes || [];
  const initStar = item.star || item.rating || 0;

  useEffect(() => {
    if (colorOptions.length > 0 && !chosenColor) setChosenColor(colorOptions[0]);
    if (sizeOptions.length > 0 && !chosenSize) setChosenSize(sizeOptions[0]);
    setStarVal(initStar);
  }, [colorOptions, sizeOptions, initStar]);

  const submitRating = async (val) => {
    if (!session?.accessToken) {
      addToast({ title: "Sign in required", description: "Please log in to rate this product.", color: "warning" });
      return;
    }
    setRatingBusy(true);
    try {
      const res = await updateProductRating(pid, val, session.accessToken);
      const updated = res?.payload?.star ?? res?.data?.star ?? val;
      setStarVal(updated);
      addToast({ title: "Rating saved!", description: `You gave ${pname} ${val} stars.`, color: "success" });
    } catch (err) {
      addToast({ title: "Rating failed", description: err.message || "Please try again.", color: "danger" });
    } finally {
      setRatingBusy(false);
    }
  };

  const addItems = () => {
    const payload = { productId: pid, productName: pname, price: cost, imageUrl: thumb };
    for (let i = 0; i < qty; i++) {
      addToCart(payload, chosenColor, chosenSize);
    }
    const colorNote = chosenColor ? ` (${chosenColor})` : "";
    const sizeNote = chosenSize ? ` / ${chosenSize}` : "";
    addToast({ title: "Added to cart!", description: `${qty} × ${pname}${colorNote}${sizeNote}`, color: "success" });
  };

  const shots = thumb
    ? [
        thumb,
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop",
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
          <span>/</span>
          <span className="line-clamp-1 text-gray-900 font-semibold">{pname}</span>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              {thumb ? (
                <Image src={thumb} alt={pname} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-100 to-violet-50/30 text-gray-300 text-6xl">◇</div>
              )}
            </div>
            {shots.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {shots.slice(0, 4).map((url, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm ${i === 0 ? "border-violet-600 ring-1 ring-violet-600" : "border-gray-200"}`}
                  >
                    <Image src={url} alt={`${pname} view ${i + 1}`} fill sizes="12vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-6">
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${catBadge(catLabel)}`}>
              {catLabel}
            </span>

            <div>
              <h1 className="text-4xl font-bold leading-tight text-gray-900">{pname}</h1>
              <p className="mt-1 text-xs text-gray-300 font-mono">#{pid?.toString().slice(0, 8)}</p>
            </div>

            <StarWidget rating={starVal} onRate={submitRating} busy={ratingBusy} />

            <p className="text-4xl font-bold tabular-nums text-gray-900">
              ${cost}
              <span className="ml-2 text-sm font-normal text-gray-400">USD</span>
            </p>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">About</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{about}</p>
            </div>

            <ul className="space-y-2 text-sm text-gray-500">
              {["Free shipping on orders over $75", "30-day hassle-free returns", "Authenticity guaranteed"].map((pt) => (
                <li key={pt} className="flex items-center gap-2">
                  <span className="text-violet-500 font-bold">✓</span>
                  {pt}
                </li>
              ))}
            </ul>

            <ProductVariationSelector
              colors={colorOptions}
              sizes={sizeOptions}
              selectedColor={chosenColor}
              selectedSize={chosenSize}
              onColorChange={setChosenColor}
              onSizeChange={setChosenSize}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Qty:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="h-8 w-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="h-8 w-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addItems}
                  className="flex-1 rounded-2xl bg-violet-600 py-4 text-sm font-bold text-white transition hover:bg-violet-500 active:scale-[.98]"
                >
                  Add to Cart
                </button>
                <button className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition hover:border-gray-300 active:scale-[.98]">
                  ♡ Save
                </button>
              </div>
            </div>

            <Link href="/products" className="mt-2 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors">
              ← Back to products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}