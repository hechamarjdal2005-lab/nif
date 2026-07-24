"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-on-primary hover:opacity-90 active:opacity-80": variant === "default",
            "border border-primary text-primary hover:bg-primary hover:text-on-primary": variant === "outline",
            "text-primary hover:bg-primary/10": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          },
          {
            "h-8 px-3 text-xs rounded-lg": size === "sm",
            "h-10 px-5 text-sm rounded-lg": size === "md",
            "h-12 px-8 text-sm rounded-lg uppercase tracking-[0.12em]": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
