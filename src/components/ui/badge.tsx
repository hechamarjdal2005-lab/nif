import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "destructive";
  className?: string;
}

function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-primary/10 text-primary": variant === "default",
          "border border-outline-variant text-primary": variant === "outline",
          "bg-green-500/10 text-green-700": variant === "success",
          "bg-amber-500/10 text-amber-700": variant === "warning",
          "bg-red-500/10 text-red-600": variant === "destructive",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
