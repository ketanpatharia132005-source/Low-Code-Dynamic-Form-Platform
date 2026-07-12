import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, BarChart2, CheckCircle2 } from "lucide-react";

export function SubmissionTrendChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { day: "Mon", count: 42, rate: "92%" },
    { day: "Tue", count: 58, rate: "95%" },
    { day: "Wed", count: 74, rate: "93%" },
    { day: "Thu", count: 61, rate: "96%" },
    { day: "Fri", count: 85, rate: "94%" },
    { day: "Sat", count: 48, rate: "97%" },
    { day: "Sun", count: 35, rate: "98%" },
  ];

  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;
  const maxVal = 95;

  const points = data.map((item, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (item.count / maxVal) * (height - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div id="submission-trend-chart" className="bg-[#111827]/60 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-5 shadow-xl relative overflow-hidden group">
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full" />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <div>
            <p className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Telemetry pipeline</p>
            <h4 className="text-sm font-bold text-white">Weekly Responses Analytics</h4>
          </div>
        </div>
        <span className="text-[9px] font-mono text-slate-400 bg-slate-800/40 px-2 py-0.5 border border-white/[0.04] rounded-lg">Real-time update</span>
      </div>

      <div className="relative h-40">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chart-glow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="4 4"
              />
            );
          })}

          <path d={areaD} fill="url(#chart-glow-grad)" />

          <path
            d={pathD}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {points.map((p, index) => (
            <g key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" className="cursor-pointer" />
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === index ? "6" : "3.5"}
                fill={hoveredIndex === index ? "#818cf8" : "#6366f1"}
                stroke="#030712"
                strokeWidth="2"
                className="transition-all duration-150 cursor-pointer"
              />
            </g>
          ))}
        </svg>

        {hoveredIndex !== null && (
          <div
            className="absolute bg-[#030712]/95 border border-indigo-500/30 rounded-xl p-2.5 shadow-xl text-[10px] transition-all duration-150 text-left pointer-events-none z-10"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 45}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="font-bold text-white">{points[hoveredIndex].day}</p>
            <p className="text-slate-400 mt-0.5">
              Responses: <span className="text-indigo-400 font-bold font-mono">{points[hoveredIndex].count}</span>
            </p>
            <p className="text-slate-400">
              Completion: <span className="text-emerald-400 font-bold font-mono">{points[hoveredIndex].rate}</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2 px-1">
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

export function MonthlyGrowthChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const months = [
    { label: "Jan", val: 45, growth: "+12%" },
    { label: "Feb", val: 55, growth: "+15%" },
    { label: "Mar", val: 48, growth: "-8%" },
    { label: "Apr", val: 70, growth: "+22%" },
    { label: "May", val: 85, growth: "+18%" },
    { label: "Jun", val: 95, growth: "+25%" },
  ];

  const maxVal = 100;
  return (
    <div id="monthly-growth-chart" className="bg-[#111827]/60 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-5 shadow-xl relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/10 blur-xl rounded-full" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest">Growth Telemetry</p>
            <h4 className="text-sm font-bold text-white">Monthly Submissions Growth</h4>
          </div>
        </div>
        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-full font-mono font-bold">+25% peak</span>
      </div>

      <div className="h-40 flex items-end justify-between gap-3 pt-6 relative">
        {months.map((m, index) => {
          const heightPct = `${(m.val / maxVal) * 100}%`;
          return (
            <div
              key={m.label}
              className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {hoveredBar === index && (
                <div className="absolute bottom-full mb-2 bg-[#030712] border border-purple-500/30 p-2 rounded-lg text-[9px] font-mono text-center z-10 shadow-lg min-w-[70px]">
                  <p className="text-white font-bold">{m.growth}</p>
                  <p className="text-slate-400">Vol: {m.val * 10}</p>
                </div>
              )}

              <div className="w-full bg-slate-800/20 absolute inset-y-0 rounded-lg pointer-events-none" />

              <div
                className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-lg transition-all duration-300 relative"
                style={{ height: heightPct }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-300 rounded-t-lg shadow-[0_0_8px_#c084fc]" />
              </div>

              <span className="text-[9px] text-slate-400 font-mono mt-2 z-10">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompletionGauge() {
  const percentage = 94.8;
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div id="completion-gauge" className="bg-[#111827]/60 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-5 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-cyan-500/10 blur-xl rounded-full" />
      <div className="text-left w-full mb-3 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
        <div>
          <p className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Performance Funnel</p>
          <h4 className="text-sm font-bold text-white">Funnel Completion Rate</h4>
        </div>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke="url(#cyan-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cyan-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute text-center">
          <p className="text-2xl font-extrabold text-white tracking-tight">{percentage}%</p>
          <p className="text-[8px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Optimal</p>
        </div>
      </div>

      <div className="flex gap-4 text-[9px] font-mono text-slate-400 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Completed: 1,482</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          <span>Bounces: 77</span>
        </div>
      </div>
    </div>
  );
}
