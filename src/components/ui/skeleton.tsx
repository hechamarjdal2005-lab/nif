import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-surface-container-low via-outline-variant/20 to-surface-container-low bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export { Skeleton };
