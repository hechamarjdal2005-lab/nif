import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-dark-200 bg-dark-50 p-6", className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

function CardTitle({ children, className }: CardProps) {
  return <h3 className={cn("text-lg font-semibold text-white", className)}>{children}</h3>;
}

function CardContent({ children, className }: CardProps) {
  return <div className={cn("", className)}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardContent };
