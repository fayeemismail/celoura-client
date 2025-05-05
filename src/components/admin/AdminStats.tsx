import React, { ReactNode } from "react";
import { ADMIN_COLORS } from "../../styles/theme";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AdminStatsProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

export default function AdminStats({ icon, title, value, trend, trendUp }: AdminStatsProps) {
  return (
    <div 
      style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} 
      className="rounded-lg border p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div 
          style={{ backgroundColor: ADMIN_COLORS.hoverBg, color: ADMIN_COLORS.accent }} 
          className="rounded-full p-3"
        >
          {icon}
        </div>
        <div 
          className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            trendUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {trendUp ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {trend}
        </div>
      </div>
      <h3 
        style={{ color: ADMIN_COLORS.secondaryText }} 
        className="mt-4 text-sm font-medium"
      >
        {title}
      </h3>
      <p 
        style={{ color: ADMIN_COLORS.text }} 
        className="mt-1 text-2xl font-semibold"
      >
        {value}
      </p>
    </div>
  );
}