import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "dark" | "blue" | "white" | "orange";

interface ThemeStyles {
  bg: string;
  bgPage: string;
  card: string;
  cardHeader: string;
  sidebar: string;
  sidebarHeader: string;
  sidebarItem: string;
  sidebarItemActive: string;
  sidebarText: string;
  navbar: string;
  text: string;
  textMuted: string;
  textHeading: string;
  border: string;
  accent: string;
  accentText: string;
  buttonPrimary: string;
  buttonSecondary: string;
  shadow: string;
  badge: string;
  input: string;
  glass: string;
  tableHeader: string;
  tableRowHover: string;
  dialogBg: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  styles: ThemeStyles;
}

const themeConfigurations: Record<ThemeType, ThemeStyles> = {
  dark: {
    bg: "bg-[#030712]",
    bgPage: "bg-[#030712]",
    card: "bg-[#111827] border border-white/[0.06]",
    cardHeader: "border-b border-white/[0.06]",
    sidebar: "bg-[#0F172A] border-r border-white/[0.05]",
    sidebarHeader: "border-b border-white/[0.05]",
    sidebarItem: "text-slate-400 hover:text-white hover:bg-white/[0.05]",
    sidebarItemActive: "bg-white/[0.08] text-indigo-400",
    sidebarText: "text-slate-300",
    navbar: "bg-[#111827] border-b border-white/[0.06]",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    textHeading: "text-white",
    border: "border-white/[0.06]",
    accent: "bg-indigo-600 hover:bg-indigo-500",
    accentText: "text-indigo-400",
    buttonPrimary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/10",
    buttonSecondary: "bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300",
    shadow: "shadow-2xl shadow-black/80",
    badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    input: "bg-[#030712]/60 border-white/[0.08] text-white focus:border-indigo-500 placeholder-slate-600",
    glass: "backdrop-blur-md bg-opacity-70",
    tableHeader: "bg-[#111827]/80 text-slate-400 border-b border-white/[0.06]",
    tableRowHover: "hover:bg-white/[0.01]",
    dialogBg: "bg-[#111827]/95 border border-indigo-500/30",
  },
  blue: {
    bg: "bg-[#E0F2FE]",
    bgPage: "bg-[#E0F2FE]",
    card: "bg-white border border-blue-100 shadow-xl shadow-blue-900/5",
    cardHeader: "border-b border-blue-50",
    sidebar: "bg-[#2563EB] text-white border-r border-blue-700/30",
    sidebarHeader: "border-b border-blue-700/30",
    sidebarItem: "text-blue-100 hover:text-white hover:bg-blue-700/50",
    sidebarItemActive: "bg-blue-700/80 text-white",
    sidebarText: "text-blue-100",
    navbar: "bg-[#1D4ED8] text-white border-b border-blue-800",
    text: "text-slate-700",
    textMuted: "text-slate-500",
    textHeading: "text-slate-900",
    border: "border-blue-100",
    accent: "bg-blue-600 hover:bg-blue-500",
    accentText: "text-blue-600",
    buttonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20",
    buttonSecondary: "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700",
    shadow: "shadow-xl shadow-blue-900/5",
    badge: "bg-blue-50 border-blue-100 text-blue-600",
    input: "bg-slate-50 border-blue-100 text-slate-800 focus:border-blue-500 placeholder-slate-400",
    glass: "backdrop-blur-md bg-opacity-90",
    tableHeader: "bg-blue-50/50 text-slate-600 border-b border-blue-100",
    tableRowHover: "hover:bg-blue-50/30",
    dialogBg: "bg-white border border-blue-200",
  },
  white: {
    bg: "bg-[#F9FAFB]",
    bgPage: "bg-[#F9FAFB]",
    card: "bg-white border border-slate-200 shadow-sm",
    cardHeader: "border-b border-slate-200",
    sidebar: "bg-white border-r border-slate-200 text-slate-600",
    sidebarHeader: "border-b border-slate-200",
    sidebarItem: "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
    sidebarItemActive: "bg-slate-100 text-blue-600 font-bold",
    sidebarText: "text-slate-600",
    navbar: "bg-white text-slate-800 border-b border-slate-200",
    text: "text-slate-600",
    textMuted: "text-slate-500",
    textHeading: "text-slate-900",
    border: "border-slate-200",
    accent: "bg-blue-600 hover:bg-blue-500",
    accentText: "text-blue-600",
    buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm",
    buttonSecondary: "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs",
    shadow: "shadow-sm border border-slate-200",
    badge: "bg-slate-100 border-slate-200 text-slate-700",
    input: "bg-white border-slate-250 text-slate-800 focus:border-blue-500 placeholder-slate-400",
    glass: "bg-white",
    tableHeader: "bg-slate-50 text-slate-500 border-b border-slate-200",
    tableRowHover: "hover:bg-slate-50/80",
    dialogBg: "bg-white border border-slate-300",
  },
  orange: {
    bg: "bg-[#FFF7ED]",
    bgPage: "bg-[#FFF7ED]",
    card: "bg-white border border-orange-100 shadow-xl shadow-orange-950/5",
    cardHeader: "border-b border-orange-50",
    sidebar: "bg-gradient-to-b from-orange-500 to-amber-600 text-white border-r border-orange-600/20",
    sidebarHeader: "border-b border-orange-600/20",
    sidebarItem: "text-orange-50 hover:text-white hover:bg-white/10",
    sidebarItemActive: "bg-white/15 text-white font-bold",
    sidebarText: "text-orange-100",
    navbar: "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-b border-orange-600",
    text: "text-slate-700",
    textMuted: "text-slate-500",
    textHeading: "text-slate-900",
    border: "border-orange-100",
    accent: "bg-[#F97316] hover:bg-[#EA580C]",
    accentText: "text-[#F97316]",
    buttonPrimary: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20",
    buttonSecondary: "bg-white hover:bg-orange-50/50 border border-orange-100 text-slate-700",
    shadow: "shadow-lg shadow-orange-950/5",
    badge: "bg-orange-50 border-orange-100 text-orange-600",
    input: "bg-white border-orange-200 text-slate-800 focus:border-orange-500 placeholder-slate-400",
    glass: "backdrop-blur-md bg-opacity-90",
    tableHeader: "bg-orange-50/50 text-slate-600 border-b border-orange-100",
    tableRowHover: "hover:bg-orange-50/30",
    dialogBg: "bg-white border border-orange-200",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("formflow_theme");
    return (saved as ThemeType) || "dark";
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("formflow_theme", newTheme);
  };

  useEffect(() => {
    // Add theme-specific class name to HTML/body element for easy styling if needed
    const root = window.document.documentElement;
    root.classList.remove("theme-dark", "theme-blue", "theme-white", "theme-orange");
    root.classList.add(`theme-${theme}`);
    
    // Style body background according to current theme
    const body = window.document.body;
    body.className = themeConfigurations[theme].bgPage + " transition-colors duration-300";
  }, [theme]);

  const styles = themeConfigurations[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
