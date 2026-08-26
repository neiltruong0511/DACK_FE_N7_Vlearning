"use client";

import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isIncrease?: boolean;
}

export default function DashboardCard({ title, value, icon: Icon, trend, isIncrease }: DashboardCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#123b3a]/5 text-[#123b3a]">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={`flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isIncrease ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {isIncrease ? "+" : "-"}{trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="mt-1 text-2xl font-bold text-[#123b3a]">{value}</p>
      </div>
    </div>
  );
}