"use client";

import { useState } from "react";

export default function ItemOptionsPicker({ colors = [], sizes = [], selectedColor, selectedSize, onColorChange, onSizeChange }) {
  const [activeColor, setActiveColor] = useState(selectedColor || (colors[0] || null));
  const [activeSize, setActiveSize] = useState(selectedSize || (sizes[0] || null));

  const pickColor = (c) => {
    setActiveColor(c);
    onColorChange(c);
  };

  const pickSize = (s) => {
    setActiveSize(s);
    onSizeChange(s);
  };

  return (
    <div className="space-y-5">
      {colors && colors.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-700">Color</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => pickColor(c)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
                  activeColor === c
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Selected: {activeColor || "None"}</p>
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-700">Size</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => pickSize(s)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                  activeSize === s
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Selected: {activeSize || "None"}</p>
        </div>
      )}
    </div>
  );
}