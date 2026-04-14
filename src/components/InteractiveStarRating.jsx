"use client";

import { useState } from "react";
import { updateProductRating } from "../app/service/productService";
import { useSession } from "next-auth/react";

export default function InteractiveStarRating({ productId, initialRating = 0, size = "sm", showValue = true, accessToken }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [busy, setBusy] = useState(false);

  const starSize = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

  const submitRating = async (val) => {
    if (busy) return;
    setBusy(true);
    try {
      await updateProductRating(productId, val, session?.accessToken || accessToken);
      setRating(val);
    } catch (err) {
      console.error("Rating failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const drawStar = (i) => {
    const starVal = i + 1;
    const filled = starVal <= (hovered || rating);

    return (
      <button
        key={i}
        onClick={() => submitRating(starVal)}
        onMouseEnter={() => setHovered(starVal)}
        onMouseLeave={() => setHovered(0)}
        disabled={busy}
        className={`${starSize[size]} transition-all duration-150 ${busy ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-110"}`}
        aria-label={`${starVal} stars`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-colors duration-150 ${filled ? "text-amber-400" : "text-gray-200"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">{[0, 1, 2, 3, 4].map(drawStar)}</div>
      {showValue && (
        <span className={`text-sm font-semibold ${busy ? "text-gray-300" : "text-gray-600"}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {busy && <span className="text-xs text-gray-400">Saving...</span>}
    </div>
  );
}