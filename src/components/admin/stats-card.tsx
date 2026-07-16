import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

function StatsCard({ title, value, icon, change, changeType = "neutral" }: StatsCardProps) {
  return (
    <div className="p-6 rounded-xl border border-dark-200 bg-dark-50 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-dark-500 font-medium">{title}</h3>
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {change && (
        <p
          className={cn(
            "text-xs font-medium",
            changeType === "positive" && "text-green-400",
            changeType === "negative" && "text-red-400",
            changeType === "neutral" && "text-dark-500"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}

export { StatsCard };
