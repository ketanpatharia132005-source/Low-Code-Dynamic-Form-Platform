import React from "react";
import { useTheme, ThemeType } from "../context/ThemeContext";
import { Check, Sparkles, Moon, Sun, CloudRain, Flame } from "lucide-react";

interface ThemeSelectorProps {
  variant?: "compact" | "full";
}

export default function ThemeSelector({ variant = "compact" }: ThemeSelectorProps) {
  const { theme, setTheme, styles } = useTheme();

  const themes: { id: ThemeType; label: string; color: string; icon: React.ReactNode; previewBg: string }[] = [
    {
      id: "dark",
      label: "Dark Black",
      color: "bg-[#030712] border-white/20",
      icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
      previewBg: "#030712",
    },
    {
      id: "blue",
      label: "Ocean Blue",
      color: "bg-[#2563EB] border-blue-400/20",
      icon: <CloudRain className="w-3.5 h-3.5 text-white" />,
      previewBg: "#E0F2FE",
    },
    {
      id: "white",
      label: "Pure White",
      color: "bg-[#FFFFFF] border-slate-300",
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      previewBg: "#F9FAFB",
    },
    {
      id: "orange",
      label: "Sunset Orange",
      color: "bg-[#F97316] border-orange-400/20",
      icon: <Flame className="w-3.5 h-3.5 text-white" />,
      previewBg: "#FFF7ED",
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1.5 p-1 rounded-lg ${
        theme === "dark" ? "bg-white/5 border border-white/10" : "bg-slate-100 border border-slate-200"
      }`}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 relative cursor-pointer group ${
              theme === t.id 
                ? "scale-110 shadow-md ring-2 ring-indigo-500/50" 
                : "opacity-60 hover:opacity-100 hover:scale-105"
            } ${t.id === 'white' ? 'bg-white border border-slate-300' : t.id === 'dark' ? 'bg-slate-900 border border-slate-800' : t.id === 'blue' ? 'bg-blue-600' : 'bg-orange-500'}`}
          >
            {theme === t.id ? (
              <Check className={`w-3.5 h-3.5 ${t.id === "white" ? "text-slate-800" : "text-white"}`} />
            ) : (
              <span className={`w-1.5 h-1.5 rounded-full ${t.id === "white" ? "bg-slate-400" : "bg-white/60"}`} />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`p-4 rounded-xl text-left border transition-all duration-200 relative overflow-hidden group cursor-pointer ${
              isActive
                ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white shadow-md dark:bg-slate-900/40"
                : "border-slate-200 hover:border-slate-300 bg-white/50 hover:bg-white"
            }`}
            style={{ borderColor: isActive ? undefined : styles.border }}
          >
            {/* Background theme preview indicator */}
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 transition-transform group-hover:scale-110" 
              style={{ backgroundColor: t.id === 'dark' ? '#4F46E5' : t.id === 'white' ? '#CBD5E1' : t.id === 'blue' ? '#3B82F6' : '#F97316' }}
            />
            
            <div className="flex items-center justify-between relative z-10">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                t.id === "dark" ? "bg-slate-950" : t.id === "blue" ? "bg-blue-600" : t.id === "white" ? "bg-slate-100" : "bg-orange-500"
              }`}>
                {t.icon}
              </div>
              {isActive && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                  <Check className="w-3.5 h-3.5" />
                  Active
                </span>
              )}
            </div>

            <div className="mt-4 relative z-10">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.label}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.id === "dark" && "Deep space dark black palette with glassmorphism glows."}
                {t.id === "blue" && "Bright high-contrast corporate ocean theme."}
                {t.id === "white" && "Ultra-clean minimalist workspace styling."}
                {t.id === "orange" && "Warm amber sun energy with vibrant orange gradients."}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
