import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-dark-100 via-dark-200 to-dark-100 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export { Skeleton };
