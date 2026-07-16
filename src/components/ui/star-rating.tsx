"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function StarRating({ rating, size = "md", className }: StarRatingProps) {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= rating
              ? "fill-gold text-gold"
              : star - 0.5 <= rating
              ? "fill-gold/50 text-gold"
              : "fill-dark-300 text-dark-300"
          )}
        />
      ))}
    </div>
  );
}

export { StarRating };
