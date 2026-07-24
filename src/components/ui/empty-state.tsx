import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-outline-variant">{icon}</div>}
      <h3 className="text-lg font-medium text-on-background mb-2">{title}</h3>
      {description && <p className="text-sm text-secondary max-w-md">{description}</p>}
    </div>
  );
}

export { EmptyState };
