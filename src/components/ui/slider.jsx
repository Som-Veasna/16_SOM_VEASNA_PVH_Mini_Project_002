"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, value, defaultValue, ...props }, ref) => {
  const normalized = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "number") return [value];
    if (defaultValue && Array.isArray(defaultValue)) return defaultValue;
    return [0];
  }, [value, defaultValue]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={normalized}
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-100">
        <SliderPrimitive.Range className="absolute h-full bg-violet-600" />
      </SliderPrimitive.Track>
      {normalized.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 rounded-full border-2 border-violet-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }