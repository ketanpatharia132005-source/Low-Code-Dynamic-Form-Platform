import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  Cpu,
  Eye,
  EyeOff,
  ShieldAlert,
  Globe,
  Laptop,
  CheckCircle2,
  Fingerprint,
  RefreshCw,
  Smartphone,
  Database,
  Server,
  Info,
  Layers,
  Activity,
  Workflow,
  MousePointer,
  Check,
  TrendingUp,
  AlertCircle,
  Zap,
  Cloud,
  Play,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ThemeSelector from "../components/ThemeSelector";

interface LoginProps {
  onLogin: (user: { email: string; name: string; role: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { theme, styles } = useTheme();

  // Theme-aware helper style overrides for the visual cards
  const innerCardBg = theme === "dark" ? "bg-[#0c1228]/85 border-white/[0.08]" : "bg-white border-slate-200/80 shadow-sm";
  const innerItemBg = theme === "dark" ? "bg-[#040816] border-white/[0.04]" : "bg-slate-50 border border-slate-100";
  const innerTextColor = theme === "dark" ? "text-slate-300" : "text-slate-700 font-medium";
  const innerTextHeading = theme === "dark" ? "text-white" : "text-slate-900";
  const innerTextMuted = theme === "dark" ? "text-slate-400" : "text-slate-500";

  // Input fields
  const [email, setEmail] = useState("admin@formflow.io");
  const [password, setPassword] = useState("••••••••");
  
  // UI settings / visibility
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLocked, setIsCapsLocked] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Security State
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(60);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  
  // Environment Detection
  const [browserInfo, setBrowserInfo] = useState("Chrome Browser • macOS");
  const [detectedIP, setDetectedIP] = useState("185.228.168.42");
  const [systemTime, setSystemTime] = useState("");

  // Email state validation helper
  const isEmailValid = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "None", color: "bg-slate-800", width: "w-0" };
    if (pass === "••••••••") return { score: 4, text: "Saved Enterprise Key", color: "bg-cyan-500", width: "w-full" };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, text: "Weak Passkey", color: "bg-rose-500", width: "w-1/4" };
    if (score === 2) return { score, text: "Fairly Secure", color: "bg-amber-500", width: "w-2/4" };
    if (score === 3) return { score, text: "Secure Profile", color: "bg-indigo-500", width: "w-3/4" };
    return { score, text: "Highly Resilient", color: "bg-emerald-500", width: "w-full" };
  };

  const pStrength = getPasswordStrength(password);

  // Lock account countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttemptCount(0);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  // Get browser information & setup dynamic times
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browser = "Chrome";
    let os = "macOS";
    if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
    if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Linux") > -1) os = "Linux";

    setBrowserInfo(`${browser} • ${os}`);

    const date = new Date();
    setSystemTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
  }, []);

  // Handle keypress caps lock checks
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setIsCapsLocked(true);
    } else {
      setIsCapsLocked(false);
    }
  };

  // Submit Credentials (Step 1)
  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!email || !isEmailValid) {
      setErrorMessage("Please enter a valid enterprise email format.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsLoading(false);

      // Simple credential verification rule:
      const isDemo = email === "demo@formflow.io" || email === "admin@formflow.io";
      const isValidPass = password === "••••••••" || password.length >= 6;

      if (isDemo && isValidPass && password !== "wrong") {
        onLogin({
          email,
          name: email === "demo@formflow.io" ? "SaaS Demo Client" : "Enterprise Administrator",
          role: email === "demo@formflow.io" ? "Authorized Auditor" : "Global System Administrator",
        });
      } else {
        const nextAttempt = attemptCount + 1;
        setAttemptCount(nextAttempt);
        setShakeTrigger(true);
        setTimeout(() => setShakeTrigger(false), 500);

        if (nextAttempt >= 5) {
          setIsLocked(true);
          setErrorMessage("Security Alert: Workstation locked due to 5 consecutive failed handshakes.");
        } else {
          setErrorMessage("Invalid Email or Password");
        }
      }
    }, 1200);
  };

  // Instant demo login bypass
  const handleInstantDemoLogin = () => {
    if (isLocked) return;
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        email: "demo@formflow.io",
        name: "SaaS Demo Client",
        role: "Authorized Auditor",
      });
    }, 800);
  };

  const featureList = [
    "Drag & Drop Builder",
    "Dynamic Forms",
    "Conditional Logic",
    "Workflow Automation",
    "AI Suggestions",
    "Analytics",
    "Audit Logs",
    "Role-Based Access",
    "FastAPI Backend",
    "MySQL Database"
  ];

  return (
    <div className={`min-h-screen ${styles.bgPage} ${styles.text} flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white`}>
      
      {/* PREMIUM GRAPHIC BACKGROUND MESH & SPHERES */}
      <div className={`absolute inset-0 ${styles.bgPage} pointer-events-none z-0`}>
        {/* Soft Indigo / Blue Mesh Orb */}
        <motion.div 
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] ${
            theme === "dark"
              ? "bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]"
              : theme === "blue"
              ? "bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)]"
              : theme === "white"
              ? "bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)]"
          }`}
        />
        {/* Soft Purple / Amber Mesh Orb */}
        <motion.div 
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] ${
            theme === "dark"
              ? "bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)]"
              : theme === "blue"
              ? "bg-[radial-gradient(circle,rgba(147,197,253,0.10)_0%,transparent_70%)]"
              : theme === "white"
              ? "bg-[radial-gradient(circle,rgba(203,213,225,0.15)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(251,191,36,0.10)_0%,transparent_70%)]"
          }`}
        />
        {/* Soft Cyan / Warm Orange Glow Orb near center split */}
        <motion.div 
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[30%] left-[40%] w-[35vw] h-[35vw] rounded-full blur-[90px] ${
            theme === "dark"
              ? "bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_75%)]"
              : theme === "blue"
              ? "bg-[radial-gradient(circle,rgba(96,165,250,0.06)_0%,transparent_75%)]"
              : theme === "white"
              ? "bg-[radial-gradient(circle,rgba(148,163,184,0.06)_0%,transparent_75%)]"
              : "bg-[radial-gradient(circle,rgba(253,186,116,0.06)_0%,transparent_75%)]"
          }`}
        />
      </div>

      {/* ----------------- LEFT SIDE (50%): ENTERPRISE PLATFORM SHOWCASE ----------------- */}
      <div className={`hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between overflow-hidden z-10 border-r ${
        theme === "dark" 
          ? "bg-[#030712]/40 border-white/[0.05]" 
          : theme === "blue"
          ? "bg-blue-600/5 border-blue-500/10"
          : theme === "white"
          ? "bg-slate-50 border-slate-200"
          : "bg-orange-500/5 border-orange-500/10"
      }`}>
        
        {/* Digital Network Pixel Grid Overlay */}
        <div className={`absolute inset-0 pointer-events-none ${
          theme === "white" 
            ? "bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)]" 
            : theme === "blue"
            ? "bg-[linear-gradient(to_right,rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.03)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]"
        } bg-[size:3.5rem_3.5rem]`} />
        
        {/* High-fidelity animated star/particle field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${theme === "white" ? "bg-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.2)]" : "bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.6)]"}`}
              style={{
                top: `${10 + i * 8}%`,
                left: `${5 + (i * 17) % 90}%`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.15, 0.85, 0.15],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 5 + (i % 4) * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* TOP BRANDING BAR WITH ACTIVE TELEMETRY */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_25px_rgba(99,102,241,0.4)]"
            >
              FF
            </motion.div>
            <div className="flex flex-col text-left">
              <span className={`font-display font-extrabold text-2xl tracking-tight leading-none ${styles.textHeading}`}>
                FormFlow
              </span>
              <span className={`text-[10px] font-bold mt-1 tracking-[0.15em] uppercase font-mono ${
                theme === "dark" ? "text-cyan-400" : "text-indigo-600"
              }`}>
                LOW-CODE ENGINE v3.0
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm border ${
            theme === "white" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${theme === "white" ? "bg-emerald-600" : "bg-emerald-400 animate-ping"}`} />
            <span>SECURE SYSTEM TUNNEL ACTIVE</span>
          </div>
        </div>

        {/* MAIN VISUAL WORKSPACE (Illustration with Drag&Drop Builder, AI Workflow, Cloud, Database and Sparklines) */}
        <div className="my-6 relative flex-1 flex flex-col justify-center">
          
          <div className={`relative w-full max-w-xl mx-auto aspect-[16/11] border rounded-3xl p-6 overflow-hidden shadow-2xl transition-all duration-300 ${
            theme === "dark" 
              ? "bg-[#090f23]/60 border-white/[0.06] shadow-black/50" 
              : theme === "blue"
              ? "bg-white/85 border-blue-100 shadow-blue-500/5"
              : theme === "white"
              ? "bg-white border-slate-200 shadow-slate-200/50"
              : "bg-white/90 border-orange-100 shadow-orange-950/5"
          }`}>
            
            {/* Satin Reflection light shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

            {/* INTEGRATED FLOWCHART LINES WITH PULSES */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Complex Flowchart paths linking cards */}
              <path d="M 170,105 L 210,105 C 240,105 240,160 270,160" stroke="url(#flowGrad1)" strokeWidth="1.5" fill="none" />
              <path d="M 270,190 C 270,240 330,240 330,280" stroke="url(#flowGrad1)" strokeWidth="1.5" fill="none" />
              <path d="M 430,270 L 480,270 C 500,270 500,160 440,160" stroke="url(#flowGrad1)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
              <path d="M 160,300 L 220,300 C 240,300 240,200 270,200" stroke="url(#flowGrad1)" strokeWidth="1.5" fill="none" />

              {/* Pulsing signal on flowchart path */}
              <motion.path
                d="M 170,105 L 210,105 C 240,105 240,160 270,160"
                stroke="url(#glowGrad)"
                strokeWidth="2.5"
                fill="none"
                initial={{ strokeDasharray: "10 50", strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -60 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M 270,190 C 270,240 330,240 330,280"
                stroke="url(#glowGrad)"
                strokeWidth="2.5"
                fill="none"
                initial={{ strokeDasharray: "12 40", strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -52 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* COMPONENT SHELF (Top Left) */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className={`absolute top-4 left-4 w-[160px] backdrop-blur-md rounded-xl p-3 shadow-lg z-10 transition-colors ${innerCardBg}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Drag & Drop Shelf</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </div>
              <div className="space-y-1">
                <div className={`p-1.5 rounded flex items-center justify-between text-[8px] ${innerItemBg} ${innerTextColor}`}>
                  <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-indigo-400" /> Input field</span>
                  <div className="w-1.5 h-1.5 rounded bg-slate-500" />
                </div>
                <div className={`p-1.5 rounded flex items-center justify-between text-[8px] ${innerItemBg} ${innerTextColor}`}>
                  <span className="flex items-center gap-1"><Smartphone className="w-2.5 h-2.5 text-cyan-400" /> Slide Switch</span>
                  <div className="w-3 h-1.5 rounded-full bg-cyan-500/20" />
                </div>
                <div className="p-1 py-1 border border-dashed border-indigo-500/30 rounded bg-indigo-500/5 text-center text-[7px] text-indigo-500 font-mono font-bold">
                  + Add Element
                </div>
              </div>
            </motion.div>

            {/* DRAG & DROP FORM BUILDER CANVAS (Center Left) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, borderColor: "rgba(6,182,212,0.25)" }}
              className={`absolute top-28 left-20 w-[190px] backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 transition-colors ${innerCardBg}`}
            >
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-black/[0.05] dark:border-white/[0.05]">
                <div className="flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-cyan-500" />
                  <span className={`text-[10px] font-bold tracking-wide ${innerTextHeading}`}>Builder Stage</span>
                </div>
                <div className="h-2 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center">
                  <span className="text-[6px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">READY</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className={`h-7 rounded-lg flex items-center justify-between px-2 text-[8px] ${innerItemBg} ${innerTextColor}`}>
                  <span className={innerTextMuted}>FullName Input</span>
                  <span className="text-[7px] font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded text-slate-500">text</span>
                </div>
                
                <div className="h-7 rounded-lg bg-indigo-500/[0.03] border border-indigo-500/20 flex items-center justify-between px-2 text-[8px] relative overflow-hidden group">
                  <span className="text-indigo-600 dark:text-indigo-300 font-medium">✓ Corporate Email</span>
                  <div className="flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </div>
                </div>

                <div className="h-7 rounded-lg border border-dashed border-cyan-500/40 bg-cyan-500/[0.02] flex items-center justify-center relative">
                  <motion.div 
                    animate={{ scale: [0.96, 1.04, 0.96] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="text-[7.5px] text-cyan-600 dark:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-cyan-500 animate-pulse" /> AI Field Suggestion
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* AI WORKFLOW SUGGESTION NODE (Center Right) */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -4, borderColor: "rgba(168,85,247,0.25)" }}
              className={`absolute top-24 right-4 w-[180px] backdrop-blur-md rounded-2xl p-4 shadow-xl z-20 transition-colors ${innerCardBg}`}
            >
              <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-black/[0.05] dark:border-white/[0.05]">
                <Zap className="w-3.5 h-3.5 text-purple-500" />
                <span className={`text-[10px] font-bold tracking-wide ${innerTextHeading}`}>AI Workflow Logic</span>
              </div>
              <p className={`text-[8px] leading-relaxed mb-2.5 ${innerTextMuted}`}>
                "On Submission, process form with FastAPI, classify with AI, and sync table in MySQL."
              </p>
              <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-[7px] font-mono">
                <span className="text-purple-600 dark:text-purple-300 font-semibold">Router Active</span>
                <Workflow className="w-3 h-3 text-purple-500 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
            </motion.div>

            {/* ANALYTICS DASHBOARD PREVIEW & AREA CHART (Bottom Right) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4, borderColor: "rgba(6,182,212,0.25)" }}
              className={`absolute bottom-4 right-4 w-[190px] backdrop-blur-md rounded-2xl p-3.5 shadow-xl z-20 transition-colors ${innerCardBg}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-500" />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${innerTextHeading}`}>Metrics Panel</span>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] text-emerald-600 font-mono font-bold bg-emerald-500/10 px-1 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>+8.4%</span>
                </div>
              </div>
              
              {/* Dynamic conversion value */}
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className={`text-xl font-extrabold ${innerTextHeading}`}>94.2%</span>
                <span className={`text-[7.5px] ${innerTextMuted}`}>Submission Rate</span>
              </div>

              {/* Area Sparkline chart using SVG */}
              <div className="h-10 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,35 Q 20,10 40,25 T 80,5 T 100,15 L 100,40 L 0,40 Z" fill="url(#areaGrad)" />
                  <motion.path 
                    d="M 0,35 Q 20,10 40,25 T 80,5 T 100,15" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <circle cx="80" cy="5" r="2.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="1" className="animate-pulse" />
                </svg>
              </div>
            </motion.div>

            {/* DURABLE DATABASE & CLOUD SYNC HUB (Bottom Left) */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className={`absolute bottom-4 left-4 w-[160px] backdrop-blur-md rounded-2xl p-3.5 shadow-xl z-20 transition-colors ${innerCardBg}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${innerTextHeading}`}>MySQL Hub</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-mono">
                  <span className={`flex items-center gap-1 ${innerTextMuted}`}><Cloud className="w-2.5 h-2.5 text-cyan-500" /> Sync:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">2ms</span>
                </div>
                
                {/* Simulated storage bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[7px] font-mono">
                    <span className={innerTextMuted}>Tables Synced</span>
                    <span className={innerTextColor}>18/20</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${innerItemBg}`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* BOTTOM METADATA & COMPREHENSIVE TEXT DETAILS */}
        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <h1 className={`font-display text-4xl font-extrabold tracking-tight leading-tight ${styles.textHeading}`}>
              FormFlow
            </h1>
            <h3 className={`text-xs font-bold uppercase tracking-widest font-mono ${
              theme === "dark" ? "text-cyan-400" : "text-indigo-600"
            }`}>
              Low-Code Dynamic Form Workflow Platform
            </h3>
            <p className={`text-xs leading-relaxed max-w-lg ${innerTextMuted}`}>
              Design, build and automate enterprise forms with AI-powered workflows, dynamic fields, analytics and secure management.
            </p>
          </div>

          {/* GRID OF FEATURE CARDS WITH CHECKMARKS AND HOVER LIFTS */}
          <div className="grid grid-cols-2 gap-2 text-left pt-2">
            {featureList.map((feat, idx) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.4 }}
                whileHover={{ y: -3, scale: 1.02, backgroundColor: theme === "white" ? "rgba(0,0,0,0.02)" : "rgba(255, 255, 255, 0.05)" }}
                className={`flex items-center gap-2.5 border px-4 py-2.5 rounded-xl transition duration-300 group cursor-default ${
                  theme === "white" 
                    ? "bg-slate-100/55 border-slate-200/80 hover:border-indigo-500/40" 
                    : "bg-white/[0.02] border-white/[0.04] hover:border-indigo-500/20"
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" strokeWidth={3} />
                </div>
                <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                  theme === "white" ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-white"
                }`}>{feat}</span>
              </motion.div>
            ))}
          </div>

          {/* Core framework / server identifiers */}
          <div className={`pt-4 border-t flex items-center justify-between text-[10px] font-mono ${styles.border} ${innerTextMuted}`}>
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" /> FastAPI Proxy Engaged
            </span>
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" /> MySQL Engine Online
            </span>
          </div>
        </div>

      </div>

      {/* ----------------- RIGHT SIDE (50%): PREMIUM GLASS LOGIN CARD ----------------- */}
      <div className={`flex-1 flex flex-col justify-center items-center px-6 py-12 lg:py-24 relative z-10 ${
        theme === "white" ? "bg-slate-500/5" : "bg-[#020617]/20"
      } lg:bg-transparent`}>
        
        {/* Dynamic ambient background glow circle */}
        <div className={`absolute w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none -z-10 ${
          theme === "dark"
            ? "bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10"
            : theme === "blue"
            ? "bg-gradient-to-tr from-blue-500/5 via-sky-500/5 to-transparent"
            : theme === "white"
            ? "bg-gradient-to-tr from-slate-200 via-indigo-50 to-transparent"
            : "bg-gradient-to-tr from-orange-500/5 via-amber-500/5 to-transparent"
        }`} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-md backdrop-blur-2xl border rounded-[28px] p-8 sm:p-10 relative overflow-hidden group transition-all duration-500 ${
            theme === "dark" 
              ? "bg-[#0a0f24]/55 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] text-white hover:border-white/[0.12]" 
              : theme === "blue"
              ? "bg-white/85 border-blue-100 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.1)] text-slate-900 hover:border-blue-200"
              : theme === "white"
              ? "bg-white border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] text-slate-900 hover:border-slate-300"
              : "bg-white/90 border-orange-100 shadow-[0_25px_50px_-12px_rgba(249,115,22,0.08)] text-slate-900 hover:border-orange-200"
          }`}
        >
          {/* Subtle satin reflection overlay that sweeps periodically */}
          <motion.div 
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 5
            }}
            className="absolute top-0 inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-12 pointer-events-none"
          />

          {/* Premium Top Glowing Line */}
          <div className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
            theme === "dark" 
              ? "via-indigo-500 to-cyan-400" 
              : theme === "blue"
              ? "via-blue-600 to-sky-400"
              : theme === "white"
              ? "via-indigo-500 to-slate-400"
              : "via-orange-500 to-amber-400"
          }`} />

          {/* SECURITY LEVEL METADATA */}
          <div className={`flex justify-between items-center mb-7 text-[9px] font-mono font-bold ${innerTextMuted}`}>
            <span className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full ${
              theme === "white" 
                ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
            }`}>
              <Shield className={`w-3 h-3 ${theme === 'white' ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span>TLS SESSION ENFORCED</span>
            </span>
            <span className={`flex items-center gap-1 border px-2.5 py-1 rounded-full ${
              theme === "white" 
                ? "bg-cyan-50 border-cyan-100 text-cyan-800" 
                : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
            }`}>
              <CheckCircle2 className={`w-3 h-3 ${theme === 'white' ? 'text-cyan-600' : 'text-cyan-400'}`} />
              <span>AES-256 SYSTEM GATE</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            
            {/* STAGE 1: CREDENTIALS */}
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-left"
            >
                <div className="space-y-1">
                  <h2 className={`font-display text-3xl font-extrabold tracking-tight ${styles.textHeading}`}>
                    Welcome Back
                  </h2>
                  <p className={`text-xs ${innerTextMuted}`}>
                    Sign in to continue to your workspace.
                  </p>
                </div>

                <form onSubmit={handleSubmitCredentials} onKeyDown={handleKeyDown} className="space-y-4">
                  
                  {/* Floating Theme Switcher inside the form card */}
                  <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04] mb-3">
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${innerTextMuted}`}>
                      WORKSPACE THEME
                    </span>
                    <ThemeSelector variant="compact" />
                  </div>

                  {/* Email Input Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest font-mono ${innerTextMuted}`}>
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-500 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40 ${
                          theme === "white" 
                            ? "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400" 
                            : theme === "blue" 
                            ? "bg-blue-50/20 text-slate-900 border-blue-200 placeholder-slate-400" 
                            : theme === "orange" 
                            ? "bg-orange-50/20 text-slate-900 border-orange-200 placeholder-slate-400" 
                            : "bg-slate-950/80 border-white/[0.08] text-white placeholder-slate-500"
                        } ${
                          !isEmailValid
                            ? "border-rose-500/40 focus:ring-rose-500/30 bg-rose-500/[0.02]"
                            : ""
                        }`}
                        placeholder="name@company.com"
                      />
                    </div>
                    {!isEmailValid && (
                      <p className="text-[10px] text-rose-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> Requires valid corporate email structure
                      </p>
                    )}
                  </div>

                  {/* Password Input Field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest font-mono ${innerTextMuted}`}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Security Notice: Automated recovery instruction sent to registered inbox of: ${email}`);
                        }}
                        className={`text-[10px] font-bold transition duration-200 ${
                          theme === "white" ? "text-indigo-600 hover:text-indigo-700" : "text-cyan-400 hover:text-cyan-300"
                        }`}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-500 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40 ${
                          theme === "white" 
                            ? "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400 focus:bg-white" 
                            : theme === "blue" 
                            ? "bg-blue-50/20 text-slate-900 border-blue-200 placeholder-slate-400 focus:bg-white" 
                            : theme === "orange" 
                            ? "bg-orange-50/20 text-slate-900 border-orange-200 placeholder-slate-400 focus:bg-white" 
                            : "bg-[#030712]/90 border-white/[0.08] text-white placeholder-slate-500 focus:bg-[#030712]"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition duration-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Caps Lock Hardware Detector Warning */}
                    {isCapsLocked && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-semibold flex items-center gap-2 shadow-sm"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>Warning: CAPS LOCK is active.</span>
                      </motion.div>
                    )}

                    {/* Password Strength Meter */}
                    {password && password !== "••••••••" && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className={innerTextMuted}>Complexity Score</span>
                          <span className={theme === "white" ? "text-indigo-600" : "text-indigo-400"}>{pStrength.text}</span>
                        </div>
                        <div className={`h-1 w-full rounded-full overflow-hidden ${innerItemBg}`}>
                          <div className={`h-full ${pStrength.width} ${pStrength.color} transition-all duration-500`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className={`w-4 h-4 rounded border text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600 cursor-pointer ${
                          theme === "white" ? "bg-slate-50 border-slate-300" : "bg-[#030712] border-white/[0.08]"
                        }`}
                      />
                      <span className={`font-medium transition-colors ${innerTextMuted} hover:text-slate-700 dark:hover:text-slate-300`}>Remember Me</span>
                    </label>
                  </div>

                  {/* Alert and Error Banner Area */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs rounded-xl flex gap-2.5 items-start font-medium"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p>{errorMessage}</p>
                        {attemptCount > 0 && attemptCount < 5 && (
                          <p className="text-[10px] text-rose-500/80 mt-0.5 font-mono">
                            Auto-locking after {5 - attemptCount} more failed handshakes.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Sign In Trigger Button & Create Link */}
                  <div className="space-y-3 pt-3">
                    <button
                      type="submit"
                      disabled={isLoading || isLocked}
                      className={`w-full relative overflow-hidden py-3 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 ${
                        theme === "white"
                          ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 hover:shadow-indigo-500/25"
                          : theme === "blue"
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:shadow-blue-500/25"
                          : theme === "orange"
                          ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20 hover:shadow-indigo-500/35"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Corporate profile setup can only be requested via Enterprise System Operations.")}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border ${
                        theme === "white" 
                          ? "text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50" 
                          : theme === "blue" 
                          ? "text-blue-700 hover:text-blue-900 border-blue-200 hover:bg-blue-50/50" 
                          : theme === "orange" 
                          ? "text-orange-700 hover:text-orange-900 border-orange-200 hover:bg-orange-50/50" 
                          : "text-slate-400 hover:text-white border-white/[0.06] hover:bg-white/[0.02]"
                      }`}
                    >
                      Create Account Link
                    </button>
                  </div>

                </form>

                {/* Secure Sign-On IDP Separation */}
                <div className="relative flex py-1.5 items-center">
                  <div className={`flex-grow border-t ${styles.border}`} />
                  <span className={`flex-shrink mx-4 text-[8px] font-bold uppercase tracking-widest font-mono ${innerTextMuted}`}>
                    Enterprise IDP Auth
                  </span>
                  <div className={`flex-grow border-t ${styles.border}`} />
                </div>

                {/* IDP SSO Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) return;
                      setIsLoading(true);
                      setErrorMessage("");
                      setTimeout(() => {
                        setIsLoading(false);
                        onLogin({
                          email: "google-sso@company.com",
                          name: "Google Enterprise Client",
                          role: "Global System Administrator",
                        });
                      }, 800);
                    }}
                    className={`py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                      theme === "white" 
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700" 
                        : theme === "blue" 
                        ? "bg-blue-50/40 hover:bg-blue-50 border-blue-200 text-slate-700" 
                        : theme === "orange" 
                        ? "bg-orange-50/40 hover:bg-orange-50 border-orange-200 text-slate-700" 
                        : "bg-[#030712] hover:bg-slate-900 border-white/[0.06] text-slate-300"
                    }`}
                  >
                    <span className="text-rose-500">G</span>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) return;
                      setIsLoading(true);
                      setErrorMessage("");
                      setTimeout(() => {
                        setIsLoading(false);
                        onLogin({
                          email: "azure-sso@company.com",
                          name: "Microsoft Enterprise Client",
                          role: "Global System Administrator",
                        });
                      }, 800);
                    }}
                    className={`py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                      theme === "white" 
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700" 
                        : theme === "blue" 
                        ? "bg-blue-50/40 hover:bg-blue-50 border-blue-200 text-slate-700" 
                        : theme === "orange" 
                        ? "bg-orange-50/40 hover:bg-orange-50 border-orange-200 text-slate-700" 
                        : "bg-[#030712] hover:bg-slate-900 border-white/[0.06] text-slate-300"
                    }`}
                  >
                    <span className="text-sky-500">M</span>
                    <span>Microsoft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) return;
                      setIsLoading(true);
                      setErrorMessage("");
                      setTimeout(() => {
                        setIsLoading(false);
                        onLogin({
                          email: "github-sso@company.com",
                          name: "GitHub Enterprise Client",
                          role: "Global System Administrator",
                        });
                      }, 800);
                    }}
                    className={`py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                      theme === "white" 
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700" 
                        : theme === "blue" 
                        ? "bg-blue-50/40 hover:bg-blue-50 border-blue-200 text-slate-700" 
                        : theme === "orange" 
                        ? "bg-orange-50/40 hover:bg-orange-50 border-orange-200 text-slate-700" 
                        : "bg-[#030712] hover:bg-slate-900 border-white/[0.06] text-slate-300"
                    }`}
                  >
                    <span className={theme === "white" ? "text-slate-900" : "text-white"}>G</span>
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Security Instant Demo Key Tunnel */}
                <div className={`border-t pt-4 text-center ${styles.border}`}>
                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    disabled={isLocked}
                    className={`w-full relative overflow-hidden py-3 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 ${
                      theme === "white"
                        ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700"
                        : theme === "blue"
                        ? "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-600"
                        : theme === "orange"
                        ? "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 text-orange-600"
                        : "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    <Fingerprint className="w-4 h-4 animate-pulse" />
                    <span>Instant Demo Sign-In (Bypass)</span>
                    <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 animate-scan pointer-events-none" style={{ animationDuration: "3s" }} />
                  </button>
                </div>

              </motion.div>

          </AnimatePresence>

          {/* Locked Overlay state */}
          {isLocked && (
            <div className={`absolute inset-0 backdrop-blur-xl flex flex-col justify-center items-center p-8 space-y-5 text-center ${
              theme === "white" ? "bg-white/98" : "bg-[#020617]/98"
            }`}>
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 animate-pulse">
                <Lock className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-2">
                <h3 className={`font-display text-lg font-bold ${innerTextHeading}`}>Console Session Suspended</h3>
                <p className={`text-xs leading-relaxed max-w-xs ${innerTextMuted}`}>
                  Submissions locked temporarily to prevent passkey brute-forcing.
                </p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/25 px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-mono font-extrabold">
                Unlocks in: {lockTimer}s
              </div>
            </div>
          )}

          {/* Secure Host and Location indicators */}
          <div className={`border-t mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] font-mono text-left ${styles.border} ${innerTextMuted}`}>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              <span>Host: {browserInfo}</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>IP: {detectedIP}</span>
            </span>
          </div>

        </motion.div>

        {/* Console logs / timestamp metadata in footer */}
        <div className={`mt-8 flex flex-col items-center gap-2 text-[9px] font-mono uppercase tracking-widest select-none ${innerTextMuted}`}>
          <p className="flex items-center gap-1.5">
            <Info className={`w-3.5 h-3.5 ${theme === 'white' ? 'text-indigo-600' : 'text-indigo-400'}`} />
            <span>Handshake: {systemTime || "July 6, 23:51 UTC"} • San Jose, CA</span>
          </p>
          <p className="opacity-60">AUTHORIZED CONSOLE ONLY • FORMFLOW PLATFORM © 2026</p>
        </div>

      </div>

    </div>
  );
}
