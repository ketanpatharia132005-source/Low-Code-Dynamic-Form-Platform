import React from "react";
import { motion } from "motion/react";
import {
  Layers,
  CheckCircle,
  FileText,
  Archive,
  Database,
  Flame,
  User,
  Workflow,
  Shield,
  Clock,
  Server,
  Cpu
} from "lucide-react";

// Mini Sparkline component
export function Sparkline({ strokeColor = "#4F46E5", values = [10, 15, 8, 12, 14, 20, 18, 25] }: { strokeColor?: string; values?: number[] }) {
  const width = 80;
  const height = 24;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((val, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * height + 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <defs>
        <linearGradient id={`grad-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#grad-${strokeColor})`}
        className="opacity-25 animate-pulse"
      />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

interface DashboardStatsProps {
  totalForms: number;
  activeForms: number;
  simulatedSubmissionsCount: number;
}

export function DashboardStats({ totalForms, activeForms, simulatedSubmissionsCount }: DashboardStatsProps) {
  // Let's create an array of 12 detailed statistics objects
  const stats = [
    {
      id: "total_forms",
      label: "Total Forms",
      value: totalForms,
      badge: `+${totalForms > 0 ? totalForms : 0} defined`,
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      description: "Structured Pydantic schemas",
      icon: Layers,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      sparklineColor: "#6366f1",
      sparklineData: [5, 8, 12, totalForms, totalForms + 2, totalForms],
    },
    {
      id: "published_forms",
      label: "Published Forms",
      value: activeForms,
      badge: `${totalForms > 0 ? Math.round((activeForms / totalForms) * 100) : 0}% live`,
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      description: "Active database endpoints",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      sparklineColor: "#10b981",
      sparklineData: [2, 4, 3, activeForms, activeForms + 1, activeForms],
    },
    {
      id: "draft_forms",
      label: "Draft Forms",
      value: Math.max(0, totalForms - activeForms),
      badge: "Staged",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      description: "Unpublished versions",
      icon: FileText,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      sparklineColor: "#f59e0b",
      sparklineData: [1, 2, 0, 1, 3, Math.max(0, totalForms - activeForms)],
    },
    {
      id: "archived_forms",
      label: "Archived Forms",
      value: 2,
      badge: "-1 this wk",
      badgeColor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      description: "Cold schema stores",
      icon: Archive,
      color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      sparklineColor: "#64748b",
      sparklineData: [4, 3, 3, 2, 2, 2],
    },
    {
      id: "total_submissions",
      label: "Total Responses",
      value: simulatedSubmissionsCount,
      badge: "+24.2%",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      description: "Validated payload rows",
      icon: Database,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      sparklineColor: "#06b6d4",
      sparklineData: [45, 90, 120, simulatedSubmissionsCount - 15, simulatedSubmissionsCount],
    },
    {
      id: "todays_submissions",
      label: "Today's Responses",
      value: 24,
      badge: "+140% surge",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      description: "Submissions last 24h",
      icon: Flame,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      sparklineColor: "#f43f5e",
      sparklineData: [5, 12, 8, 14, 18, 24],
    },
    {
      id: "active_users",
      label: "Active Users",
      value: 148,
      badge: "+12.5%",
      badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      description: "Authorized access tokens",
      icon: User,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      sparklineColor: "#8b5cf6",
      sparklineData: [110, 120, 125, 130, 142, 148],
    },
    {
      id: "org_departments",
      label: "Org Departments",
      value: 8,
      badge: "Enterprise",
      badgeColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
      description: "Federated directories",
      icon: Workflow,
      color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
      sparklineColor: "#d946ef",
      sparklineData: [4, 6, 6, 8, 8, 8],
    },
    {
      id: "approval_requests",
      label: "Approval Requests",
      value: 3,
      badge: "Action Required",
      badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      description: "Pending schema validations",
      icon: Shield,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      sparklineColor: "#f97316",
      sparklineData: [5, 4, 3, 2, 4, 3],
    },
    {
      id: "pending_reviews",
      label: "Pending Reviews",
      value: 1,
      badge: "Priority HIGH",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      description: "Outstanding security review",
      icon: Clock,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      sparklineColor: "#3b82f6",
      sparklineData: [3, 2, 2, 1, 2, 1],
    },
    {
      id: "storage_used",
      label: "Storage Used",
      value: "12.4 GB",
      badge: "24.8% cap",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      description: "Attachments & JSON blobs",
      icon: Server,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      sparklineColor: "#6366f1",
      sparklineData: [10.2, 10.8, 11.2, 11.8, 12.1, 12.4],
    },
    {
      id: "api_requests",
      label: "API Requests",
      value: "42.8k",
      badge: "+18.5% growth",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      description: "Serverless ingress triggers",
      icon: Cpu,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      sparklineColor: "#06b6d4",
      sparklineData: [25, 30, 32, 38, 41, 42.8],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111827]/40 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.01] to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2.5 rounded-xl border ${stat.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-350`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>

            <div className="space-y-1 mt-2">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-extrabold text-white tracking-tight leading-none">
                {stat.value}
              </h3>
            </div>

            <div className="flex justify-between items-end mt-3 pt-2 border-t border-white/[0.03]">
              <p className="text-[8px] text-slate-400 leading-tight max-w-[64px] truncate">{stat.description}</p>
              <Sparkline strokeColor={stat.sparklineColor} values={stat.sparklineData} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
