import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Database,
  Trash2,
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Check,
  Code,
  Settings,
  Pencil,
  Tag,
  FolderOpen,
  X,
  FileText,
  Copy,
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  Activity,
  Server,
  RefreshCw,
  Sliders,
  User,
  Share2,
  FileDown,
  Upload,
  Download,
  Flame,
  ArrowUpRight,
  Workflow,
  Key,
  DatabaseZap,
  Clock,
  Menu,
  ChevronDown,
  ChevronRight,
  Brain,
  Cpu
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

// Import modular sub-components
import { DashboardStats } from "../components/DashboardStats";
import { SubmissionTrendChart, MonthlyGrowthChart, CompletionGauge } from "../components/DashboardCharts";
import { AIFormGenerator, JSONSchemaImporter, ExcelImporter, ShareToast, ShareModal } from "../components/DashboardModals";

// FormFlow pre-made templates definition
const WORKSPACE_TEMPLATES = [
  {
    title: "EPA Environmental Assessment & Compliance Form",
    description: "Standardized intake for Environmental Protection Agency facility safety, chemical emissions reporting, and regulatory safety audits.",
    category: "Regulatory Compliance (EPA)",
    tags: ["epa", "compliance", "regulatory", "audit"],
  },
  {
    title: "Net Promoter Score (NPS) Survey",
    description: "Measure customer loyalty with standard scale indexing and feedback categories.",
    category: "Customer Satisfaction (CSAT)",
    tags: ["nps", "feedback", "retention"],
  },
  {
    title: "Lead Capture & Qualification",
    description: "Automated routing for marketing qualified leads (MQL) with regex validations.",
    category: "Lead Generation",
    tags: ["sales", "pipeline", "marketing"],
  },
  {
    title: "Event RSVP & Registration Tracker",
    description: "Manage guest lists, food requirements, and custom session schedules.",
    category: "Event Registration",
    tags: ["event", "rsvp", "operational"],
  },
  {
    title: "Developer API Feedback Intake",
    description: "Gather telemetry insights and REST payload schema requests from integration developers.",
    category: "Product Feedback",
    tags: ["api", "engineering", "v2-spec"],
  },
];

export default function Dashboard() {
  const { theme, styles } = useTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Local state managers
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"directory" | "analytics" | "insights">("directory");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  // Custom interactive overlays
  const [shareToastShow, setShareToastShow] = useState(false);
  const [shareToastTitle, setShareToastTitle] = useState("");
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Share Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalFormId, setShareModalFormId] = useState<number | null>(null);
  const [shareModalFormTitle, setShareModalFormTitle] = useState("");

  // Form Creation Form States
  const [createFormTitle, setCreateFormTitle] = useState("");
  const [createFormDesc, setCreateFormDesc] = useState("");
  const [createFormCategory, setCreateFormCategory] = useState("Feedback & Experience");
  const [createFormTags, setCreateFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [createFormStatus, setCreateFormStatus] = useState<"live" | "draft">("draft");

  // Fetch all forms
  const { data: forms = [], isLoading, isError } = useQuery({
    queryKey: ["forms"],
    queryFn: api.getForms,
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.updateForm(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  // Create form mutation
  const createFormMutation = useMutation({
    mutationFn: (newFormData: {
      title: string;
      description: string;
      is_active: boolean;
      category: string;
      tags: string[];
    }) => api.createForm(newFormData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setIsCreateModalOpen(false);
      // Reset state
      setCreateFormTitle("");
      setCreateFormDesc("");
      setCreateFormCategory("Feedback & Experience");
      setCreateFormTags([]);
      setCreateFormStatus("draft");
      // Navigate directly to builder
      navigate(`/builder?id=${data.id}`);
    },
  });

  // Delete form mutation
  const deleteMutation = useMutation({
    mutationFn: api.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setDeleteId(null);
    },
  });

  // Duplicate form mutation
  const duplicateMutation = useMutation({
    mutationFn: api.duplicateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
    onError: () => {
      alert("Failed to duplicate dynamic form schema. Please verify server status.");
    }
  });

  // Tag helpers inside Create Modal
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      if (!createFormTags.includes(newTagInput.trim())) {
        setCreateFormTags([...createFormTags, newTagInput.trim()]);
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCreateFormTags(createFormTags.filter((t) => t !== tagToRemove));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormTitle.trim()) return;
    createFormMutation.mutate({
      title: createFormTitle,
      description: createFormDesc,
      is_active: createFormStatus === "live",
      category: createFormCategory,
      tags: createFormTags,
    });
  };

  // Launch pre-made template creator
  const handleLaunchTemplate = (template: typeof WORKSPACE_TEMPLATES[0]) => {
    createFormMutation.mutate({
      title: `${template.title}`,
      description: template.description,
      is_active: true,
      category: template.category,
      tags: [...template.tags, "template"],
    });
  };

  // Share a pre-made template by matching or seeding it first
  const handleShareTemplate = (template: typeof WORKSPACE_TEMPLATES[0], e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent launching template creation + navigation
    const existingForm = forms.find((f) => f.title === template.title);
    if (existingForm) {
      setShareModalFormId(existingForm.id);
      setShareModalFormTitle(existingForm.title);
      setIsShareModalOpen(true);
    } else {
      createFormMutation.mutate(
        {
          title: template.title,
          description: template.description,
          is_active: true,
          category: template.category,
          tags: [...template.tags, "template"],
        },
        {
          onSuccess: (data) => {
            setShareModalFormId(data.id);
            setShareModalFormTitle(data.title);
            setIsShareModalOpen(true);
          },
        }
      );
    }
  };

  // Simulated AI generator intake
  const handleAiGenerationSubmit = (prompt: string) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      setIsAiModalOpen(false);
      createFormMutation.mutate({
        title: `AI Generated: ${prompt.substring(0, 30)}${prompt.length > 30 ? "..." : ""}`,
        description: `Dynamically engineered based on AI prompt: "${prompt}"`,
        is_active: true,
        category: "Custom Workflow",
        tags: ["ai-agent", "autogenerated"],
      });
    }, 2200);
  };

  // Simulated JSON schema inject
  const handleJsonSchemaImport = (title: string, description: string, category: string, tags: string[]) => {
    createFormMutation.mutate({
      title,
      description,
      is_active: true,
      category,
      tags,
    });
  };

  // Real copy clipboard form direct share
  const handleShareForm = (formId: number, formTitle: string) => {
    setShareModalFormId(formId);
    setShareModalFormTitle(formTitle);
    setIsShareModalOpen(true);
  };

  // Real backup schemas export download file
  const handleExportData = () => {
    const fileContent = JSON.stringify(forms, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(fileContent);
    const exportFileName = `formflow_workspace_export_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  // Simulated backup state triggers
  const handleBackupState = () => {
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  // Helper metrics
  const totalForms = forms.length;
  const activeForms = forms.filter((f) => f.is_active).length;
  const simulatedSubmissionsCount = totalForms > 0 ? totalForms * 14 + 5 : 0;

  // Real-time schema filtering
  const filteredForms = forms.filter((form) => {
    const query = searchQuery.toLowerCase();
    return (
      form.title.toLowerCase().includes(query) ||
      (form.description && form.description.toLowerCase().includes(query)) ||
      (form.category && form.category.toLowerCase().includes(query)) ||
      (form.tags && form.tags.some(t => t.toLowerCase().includes(query)))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#030712] rounded-[24px] border border-white/[0.04] space-y-4 m-1">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
        <div className="text-center space-y-1">
          <p className="text-white font-extrabold text-sm tracking-widest uppercase font-mono animate-pulse">
            Synthesizing Enterprise Console...
          </p>
          <p className="text-slate-500 text-xs">Awaiting secure handshake tunnels</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-[#030712] min-h-[80vh] flex items-center justify-center rounded-[24px]">
        <div className="bg-[#111827]/80 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg shadow-[0_0_20px_rgba(239,68,68,0.15)] space-y-4">
          <Sliders className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h3 className="font-bold text-xl text-white">Console synchronization offline</h3>
          <p className="text-xs text-slate-400">
            Could not retrieve data from the low-code schema backend proxy. Please inspect port 3000 mapping variables.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Retry Connection Tunnel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden font-sans select-none w-full h-full ${styles.text}`}>
      {/* 1. ANIMATED BACKGROUND PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-indigo-500"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 2. GRADIENT FLOATING GLOW MESH */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none animate-pulse" />

      {/* 3. WORKSPACE TOP PANEL HEADER */}
      <div className={`relative z-10 border-b ${styles.border} pb-6 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center text-white font-extrabold text-xl font-display">
            FF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold tracking-tight ${styles.textHeading}`}>FormFlow Workspace</h2>
              <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Enterprise Workspace
              </span>
            </div>
            <p className={`text-[10px] mt-0.5 ${styles.textMuted}`}>Control panel for dynamic models, validators and relational targets</p>
          </div>
        </div>

        {/* Header Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search forms, tags, categories, audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-indigo-500/20 ${styles.input}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right Side Info Widgets */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Indicator */}
          <div className={`p-2 border rounded-xl flex items-center gap-1.5 text-[10px] font-mono font-bold ${
            theme === "dark" 
              ? "bg-slate-900 border-white/10 text-indigo-400" 
              : theme === "blue" 
              ? "bg-blue-50 border-blue-100 text-blue-600" 
              : theme === "white" 
              ? "bg-slate-100 border-slate-200 text-slate-600" 
              : "bg-orange-50 border-orange-100 text-orange-600"
          }`}>
            <Zap className="w-3.5 h-3.5" />
            <span className="capitalize">{theme} Theme</span>
          </div>
          {/* Help Center */}
          <button className={`p-2.5 border rounded-xl transition cursor-pointer ${
            theme === "dark" ? "bg-slate-900 border-white/10 hover:text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
          }`} title="Help Documentation">
            <HelpCircle className="w-4 h-4" />
          </button>
          {/* Settings */}
          <button onClick={() => navigate("/settings")} className={`p-2.5 border rounded-xl transition cursor-pointer ${
            theme === "dark" ? "bg-slate-900 border-white/10 hover:text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
          }`} title="Workspace Settings">
            <Settings className="w-4 h-4 animate-[spin_12s_linear_infinite]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: ACTIONS & TEMPLATES (col-3) */}
        {/* ========================================== */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className={`backdrop-blur-md rounded-[24px] p-5 shadow-xl space-y-4 relative overflow-hidden ${styles.card}`}>
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/[0.02] rounded-bl-full pointer-events-none" />
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${styles.textMuted}`}>
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace Actions</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${styles.buttonPrimary}`}
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Create New Form</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  theme === "dark" 
                    ? "bg-[#030712]/60 hover:bg-[#030712]/95 border-white/[0.06] text-slate-200" 
                    : "bg-indigo-50 hover:bg-indigo-100 border-indigo-100 text-indigo-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>AI Form Generator</span>
                </span>
                <span className="text-[8px] font-mono bg-indigo-500/15 text-indigo-600 px-1.5 py-0.5 rounded">Pro</span>
              </button>

              <button
                onClick={() => setIsJsonModalOpen(true)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${styles.buttonSecondary}`}
              >
                <Code className="w-4 h-4 text-purple-500" />
                <span>Import JSON Configuration</span>
              </button>

              <button
                onClick={() => setIsExcelModalOpen(true)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer ${styles.buttonSecondary}`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Import Excel / CSV</span>
              </button>
            </div>

            <div className={`pt-3 border-t ${styles.border} grid grid-cols-2 gap-2`}>
              <button
                onClick={handleExportData}
                className={`py-2 px-2.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${styles.buttonSecondary}`}
                title="Backup full schema configuration"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Data</span>
              </button>
              <button
                onClick={handleBackupState}
                className={`py-2 px-2.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${styles.buttonSecondary}`}
                title="Save snapshots in secure vault"
              >
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span>{backupSuccess ? "Backed up!" : "Backup Cloud"}</span>
              </button>
            </div>
          </div>

          {/* Core Templates Library */}
          <div className={`backdrop-blur-md rounded-[24px] p-5 shadow-xl space-y-4 ${styles.card}`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${styles.textMuted}`}>
                <Workflow className="w-3.5 h-3.5 text-indigo-500" />
                <span>Form Templates</span>
              </h3>
              <span className="text-[9px] text-indigo-500 font-mono">Real-time seed</span>
            </div>

            <div className="space-y-3.5">
              {WORKSPACE_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.title}
                  onClick={() => handleLaunchTemplate(tpl)}
                  className={`p-3 border rounded-xl transition-all duration-200 cursor-pointer group text-left ${
                    theme === "dark" 
                      ? "bg-white/[0.01] hover:bg-white/[0.04] border-white/[0.04] hover:border-indigo-500/20" 
                      : "bg-slate-50 hover:bg-indigo-50/40 border-slate-100 hover:border-indigo-300/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <p className={`text-xs font-bold transition-colors truncate max-w-[150px] ${
                      theme === "dark" ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-600"
                    }`}>
                      {tpl.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleShareTemplate(tpl, e)}
                        className={`p-1 rounded-md border text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer ${
                          theme === "dark" 
                            ? "bg-slate-900/60 border-white/[0.04] hover:bg-white/[0.05]" 
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                        title="Share this template"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition" />
                    </div>
                  </div>
                  <p className={`text-[9px] mt-1 leading-normal line-clamp-2 ${styles.textMuted}`}>
                    {tpl.description}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-600 px-1.5 py-0.25 rounded font-medium">
                      {tpl.category}
                    </span>
                    {tpl.tags.slice(0, 2).map(t => (
                      <span key={t} className={`text-[8px] px-1.5 py-0.25 rounded font-mono ${
                        theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200/55 text-slate-600"
                      }`}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ========================================== */}
        {/* CENTER COLUMN: WELCOME, STATS & MAIN LIST */}
        {/* ========================================== */}
        <section className="lg:col-span-6 space-y-8">
          
          {/* Welcome Premium Gradient Banner */}
          <div className={`p-6 rounded-[24px] shadow-2xl relative overflow-hidden border ${
            theme === "dark" 
              ? "bg-gradient-to-r from-indigo-950/60 to-purple-950/40 text-white border-white/[0.06]" 
              : theme === "blue" 
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500" 
              : theme === "white" 
              ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-200" 
              : "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400"
          }`}>
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-white/5 blur-2xl" />
            
            <div className="space-y-4 relative z-10 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-mono font-bold uppercase tracking-widest">
                <Brain className="w-3 h-3" />
                FormFlow Console Engine
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  Welcome Back, Admin 👋
                </h1>
                <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                  Manage enterprise forms, workflows, users, analytics and automation from one intelligent dashboard.
                </p>
              </div>

              {/* Action Buttons within Welcome Banner */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Form</span>
                </button>
                <button
                  onClick={() => setIsExcelModalOpen(true)}
                  className="px-4 py-2.5 bg-[#030712]/80 hover:bg-[#030712] text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/[0.06] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Import Form</span>
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 bg-[#030712]/80 hover:bg-[#030712] text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/[0.06] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Data</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("analytics-dashboard-section");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-[#030712]/80 hover:bg-[#030712] text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/[0.06] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Grid (12 Cards integrated elegantly) */}
          <div className="space-y-4">
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 text-left ${styles.textMuted}`}>
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace Infrastructure Telemetry</span>
            </h3>
            <DashboardStats
              totalForms={totalForms}
              activeForms={activeForms}
              simulatedSubmissionsCount={simulatedSubmissionsCount}
            />
          </div>

          {/* Main Workspace Navigation Tabs */}
          <div className={`flex border-b gap-6 ${styles.border}`}>
            <button
              onClick={() => setActiveTab("directory")}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === "directory" ? styles.textHeading : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span>Schema Directory ({filteredForms.length})</span>
              {activeTab === "directory" && (
                <motion.div layoutId="activeTabGlow" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === "analytics" ? styles.textHeading : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span>Performance Analytics</span>
              {activeTab === "analytics" && (
                <motion.div layoutId="activeTabGlow" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === "insights" ? styles.textHeading : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <span>AI Smart Insights</span>
              {activeTab === "insights" && (
                <motion.div layoutId="activeTabGlow" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* VIEW 1: FORMS TABLE DIRECTORY */}
            {activeTab === "directory" && (
              <motion.div
                key="directory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`backdrop-blur-md rounded-[24px] p-5 shadow-xl space-y-4 ${styles.card}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold text-xs flex items-center gap-2 uppercase tracking-widest font-mono ${styles.textHeading}`}>
                    <Database className="w-4 h-4 text-indigo-500" />
                    <span>Recent Schemas Catalog</span>
                  </h3>
                  <span className={`text-[9px] font-mono ${styles.textMuted}`}>MySQL Linked</span>
                </div>

                {filteredForms.length === 0 ? (
                  <div className="py-12 text-center max-w-sm mx-auto space-y-3">
                    <div className={`p-3 border rounded-full w-12 h-12 flex items-center justify-center mx-auto ${
                      theme === "dark" ? "bg-[#030712] border-white/10 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${styles.textHeading}`}>No workspace models located</h4>
                      <p className={`text-[10px] mt-1 ${styles.textMuted}`}>
                        Input a custom schema in the designer or trigger our instant template seeder.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b text-[9px] font-mono uppercase tracking-wider ${styles.border} ${styles.textMuted}`}>
                          <th className="pb-3 px-2 font-medium">Schema details</th>
                          <th className="pb-3 px-2 font-medium">Inputs / Version</th>
                          <th className="pb-3 px-2 font-medium">Deployment Status</th>
                          <th className="pb-3 px-2 font-medium text-right">Handshakes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredForms.map((form) => {
                          const latestVersion =
                            form.versions && form.versions.length > 0
                              ? [...form.versions].sort(
                                  (a, b) => b.version_number - a.version_number
                                )[0]
                              : null;

                          return (
                            <tr key={form.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                              <td className="py-4 px-2">
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${styles.textHeading}`}>
                                      {form.title}
                                    </span>
                                    <span className={`text-[8px] font-mono px-1.5 py-0.25 rounded border text-indigo-500 font-semibold bg-indigo-500/5 ${
                                      theme === "dark" ? "border-white/5 text-indigo-400" : "border-indigo-100 text-indigo-600"
                                    }`}>
                                      ID: {form.id}
                                    </span>
                                  </div>
                                  {form.description && (
                                    <p className={`text-[10px] truncate max-w-[280px] ${styles.textMuted}`}>
                                      {form.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {form.category && (
                                      <span className="inline-flex items-center gap-1 text-[8px] font-medium bg-indigo-500/10 border border-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.25 rounded-md">
                                        <FolderOpen className="w-2.5 h-2.5 text-indigo-500" />
                                        {form.category}
                                      </span>
                                    )}
                                    {form.tags && form.tags.map((tag) => (
                                      <span key={tag} className={`inline-flex items-center gap-0.5 text-[8px] border px-1.5 py-0.25 rounded-md font-mono ${
                                        theme === "dark" 
                                          ? "bg-[#030712] border-white/[0.04] text-slate-400" 
                                          : "bg-slate-100 border-slate-200 text-slate-500"
                                      }`}>
                                        <Tag className="w-2 h-2 text-slate-400" />
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-2 text-left">
                                {latestVersion ? (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[8px] font-extrabold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.25 rounded-md font-mono">
                                        v{latestVersion.version_number}
                                      </span>
                                      <span className={`text-[10px] ${styles.text}`}>
                                        {latestVersion.fields ? latestVersion.fields.length : 0} components
                                      </span>
                                    </div>
                                    <p className={`text-[8px] font-mono ${styles.textMuted}`}>Owner: System Admin</p>
                                  </div>
                                ) : (
                                  <span className={`text-[10px] italic ${styles.textMuted}`}>No version metadata</span>
                                )}
                              </td>

                              <td className="py-4 px-2 text-left">
                                <button
                                  onClick={() =>
                                    toggleActiveMutation.mutate({
                                      id: form.id,
                                      is_active: !form.is_active,
                                    })
                                  }
                                  disabled={toggleActiveMutation.isPending}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold border transition duration-200 cursor-pointer font-mono uppercase ${
                                    form.is_active
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${form.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-500"}`} />
                                  <span>{form.is_active ? "Live" : "Draft"}</span>
                                </button>
                              </td>

                              <td className="py-4 px-2 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Link
                                    to={`/builder?id=${form.id}`}
                                    className={`p-1.5 rounded-lg border transition ${
                                      theme === "dark" 
                                        ? "text-slate-400 hover:text-indigo-400 hover:bg-[#030712] border-white/[0.04]" 
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-slate-200"
                                    }`}
                                    title="Edit Form Canvas Fields"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Link>
                                  <button
                                    onClick={() => duplicateMutation.mutate(form.id)}
                                    disabled={duplicateMutation.isPending}
                                    className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-40 ${
                                      theme === "dark" 
                                        ? "text-slate-400 hover:text-purple-400 hover:bg-[#030712] border-white/[0.04]" 
                                        : "text-slate-500 hover:text-purple-600 hover:bg-slate-100 border-slate-200"
                                    }`}
                                    title="Duplicate Form Model Schema"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  {latestVersion && (
                                    <Link
                                      to={`/form/${latestVersion.id}`}
                                      className={`p-1.5 rounded-lg border transition ${
                                        theme === "dark" 
                                          ? "text-slate-400 hover:text-cyan-400 hover:bg-[#030712] border-white/[0.04]" 
                                          : "text-slate-500 hover:text-cyan-600 hover:bg-slate-100 border-slate-200"
                                      }`}
                                      title="Preview Layout Form"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => handleShareForm(form.id, form.title)}
                                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                      theme === "dark" 
                                        ? "text-slate-400 hover:text-indigo-400 hover:bg-[#030712] border-white/[0.04]" 
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-slate-200"
                                    }`}
                                    title="Share Form URL Link"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteId(form.id)}
                                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                      theme === "dark" 
                                        ? "text-slate-400 hover:text-red-500 hover:bg-red-500/10 border-white/[0.04]" 
                                        : "text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
                                    }`}
                                    title="Purge Schema Model"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: INTERACTIVE CHARTS */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                id="analytics-dashboard-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2">
                  <SubmissionTrendChart />
                </div>
                <MonthlyGrowthChart />
                <CompletionGauge />
              </motion.div>
            )}

            {/* VIEW 3: AI SMART INSIGHTS */}
            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`backdrop-blur-md rounded-[24px] p-6 shadow-xl space-y-6 ${styles.card}`}
              >
                <div className={`border-b pb-3 text-left ${styles.border}`}>
                  <h3 className={`font-bold text-xs flex items-center gap-2 uppercase tracking-widest font-mono ${styles.textHeading}`}>
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span>FormFlow Intelligent AI Diagnostics</span>
                  </h3>
                  <p className={`text-[10px] mt-1 ${styles.textMuted}`}>Smart suggestions and layout optimizations computed from dynamic payload stats.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Suggestion 1 */}
                  <div className={`border p-4 rounded-xl flex gap-3.5 items-start text-left ${
                    theme === "dark" ? "bg-slate-950/60 border-indigo-500/20" : "bg-indigo-50/40 border-indigo-100"
                  }`}>
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                      <Brain className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${styles.textHeading}`}>Validation Suggestion</h4>
                      <p className={`text-[10px] mt-1 leading-relaxed ${styles.textMuted}`}>
                        Add a numerical range validator to your Rating inputs. This automatically bounds collected responses between 1 and 5.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion 2 */}
                  <div className={`border p-4 rounded-xl flex gap-3.5 items-start text-left ${
                    theme === "dark" ? "bg-slate-950/60 border-purple-500/20" : "bg-purple-50/40 border-purple-100"
                  }`}>
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${styles.textHeading}`}>AI Optimization Tips</h4>
                      <p className={`text-[10px] mt-1 leading-relaxed ${styles.textMuted}`}>
                        The "Contact Email" field in your Lead Intake form has weak validation. Hardening with a regex filter raises data cleanliness by 14%.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion 3 */}
                  <div className={`border p-4 rounded-xl flex gap-3.5 items-start text-left ${
                    theme === "dark" ? "bg-slate-950/60 border-cyan-500/20" : "bg-cyan-50/40 border-cyan-100"
                  }`}>
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${styles.textHeading}`}>Duplicate Form Warning</h4>
                      <p className={`text-[10px] mt-1 leading-relaxed ${styles.textMuted}`}>
                        Identified highly overlapping fields in two active schemas: "Customer CSAT" and "Customer Feedback". Consolidating saves storage.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion 4 */}
                  <div className={`border p-4 rounded-xl flex gap-3.5 items-start text-left ${
                    theme === "dark" ? "bg-slate-950/60 border-emerald-500/20" : "bg-emerald-50/40 border-emerald-100"
                  }`}>
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <DatabaseZap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${styles.textHeading}`}>Popular Form Component</h4>
                      <p className={`text-[10px] mt-1 leading-relaxed ${styles.textMuted}`}>
                        "Ratings" and "Switches" are currently the most utilized field components. Re-use them as custom components to streamline workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Database Synced active advertisement block */}
          <div className={`rounded-[24px] p-6 border relative overflow-hidden text-left ${
            theme === "dark" 
              ? "bg-gradient-to-r from-indigo-900/40 via-slate-900/40 to-[#030712] border-white/[0.05]" 
              : theme === "blue" 
              ? "bg-blue-50/70 border-blue-100" 
              : theme === "white" 
              ? "bg-slate-50 border-slate-200" 
              : "bg-orange-50/60 border-orange-100"
          }`}>
            <div className="absolute right-0 top-0 h-full w-1/4 bg-indigo-500/[0.03] pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-[8px] font-mono font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 uppercase">
                  Engine active
                </span>
                <h3 className={`font-bold text-sm ${styles.textHeading}`}>Full-Stack Pydantic & MySQL Sync Engaged</h3>
              </div>
              <p className={`text-[10px] leading-relaxed max-w-2xl ${styles.textMuted}`}>
                All low-code schemas configured inside this terminal are dynamically mapped directly into SQL relational schemas.
                Type parsing constraints, validators, and category tagging rules are processed server-side inside our robust Express backend.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* RIGHT COLUMN: TIMELINE & STATUS (col-3) */}
        {/* ========================================== */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* System Status Metrics */}
          <div className="bg-[#111827]/50 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>System Status</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { name: "Database Schema", status: "Online", details: "MySQL Pool Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { name: "Backend API Router", status: "Healthy", details: "Express REST Proxy", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                { name: "FastAPI Connection", status: "Healthy", details: "Pydantic Compliant", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                { name: "MySQL Storage", status: "Connected", details: "Alembic Migrated", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { name: "JWT Auth Guard", status: "Secure", details: "Session Key Encrypted", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                { name: "S3 Attachment Storage", status: "Healthy", details: "Attachment blobs OK", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              ].map((sys) => (
                <div key={sys.name} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl text-left">
                  <div>
                    <p className="text-[10px] font-bold text-slate-200">{sys.name}</p>
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5">{sys.details}</p>
                  </div>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${sys.color}`}>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity / Audit Logs Timeline */}
          <div className="bg-[#111827]/50 backdrop-blur-md border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Workspace Audit Trail</span>
            </h3>

            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  {
                    title: "Admin console session authorized",
                    desc: "Handshake verified with secure BCrypt tunnel.",
                    tag: "JWT-PROXY",
                    time: "Just now",
                    icon: Key,
                    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  },
                  {
                    title: "Alembic migrations synced",
                    desc: "Pydantic entities written to MySQL schema successfully.",
                    tag: "MYSQL-DDL",
                    time: "1 hour ago",
                    icon: Database,
                    color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
                  },
                  {
                    title: "Workflow schema compiled",
                    desc: "Version v2 of Customer Feedback schema is live.",
                    tag: "COMPILER",
                    time: "4 hours ago",
                    icon: Code,
                    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                  },
                  {
                    title: "User session revoked",
                    desc: "Unauthorized OAuth token rejected from external proxy.",
                    tag: "SECURITY",
                    time: "Yesterday",
                    icon: Shield,
                    color: "text-red-400 bg-red-500/10 border-red-500/20"
                  }
                ].map((event, index, array) => {
                  const Icon = event.icon;
                  return (
                    <li key={event.title}>
                      <div className="relative pb-8 text-left">
                        {index !== array.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/[0.04]" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3 items-start">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${event.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <p className="text-[10px] font-bold text-white leading-normal">
                                {event.title}
                              </p>
                              <span className="text-[8px] font-mono text-slate-500 whitespace-nowrap">{event.time}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                              {event.desc}
                            </p>
                            <span className="inline-block text-[8px] font-mono text-slate-500 bg-[#030712] px-1.5 py-0.25 rounded border border-white/[0.03] mt-1">
                              {event.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================== */}
      {/* MODALS & PORTALS (Wired beautifully) */}
      {/* ========================================== */}

      {/* MODAL 1: AI PORTAL */}
      <AIFormGenerator
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSubmit={handleAiGenerationSubmit}
        isGenerating={isAiGenerating}
      />

      {/* MODAL 2: JSON LOADER */}
      <JSONSchemaImporter
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onImport={handleJsonSchemaImport}
      />

      {/* MODAL 3: EXCEL LOADER */}
      <ExcelImporter
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImport={handleJsonSchemaImport}
      />

      {/* MODAL 4: SHARE TOAST */}
      <ShareToast
        show={shareToastShow}
        onClose={() => setShareToastShow(false)}
        title={shareToastTitle}
      />

      {/* MODAL 5: DETAILED SHARE TEMPLATE & FORM MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formId={shareModalFormId}
        formTitle={shareModalFormTitle}
      />

      {/* CREATE NEW CUSTOM SCHEMA MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div id="create-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111827]/95 border border-white/[0.08] text-white rounded-[24px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
              
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight text-white">Configure Workspace Schema</h3>
                    <p className="text-[10px] text-slate-400">Initialize a new secure low-code model</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 relative z-10 text-left">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Form Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormTitle}
                    onChange={(e) => setCreateFormTitle(e.target.value)}
                    placeholder="e.g. Lead Qualification Questionnaire"
                    className="w-full bg-[#030712]/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-indigo-500/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Description
                  </label>
                  <textarea
                    value={createFormDesc}
                    onChange={(e) => setCreateFormDesc(e.target.value)}
                    placeholder="Provide a clear explanation of this model's analytical data collection objectives..."
                    rows={2}
                    className="w-full bg-[#030712]/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-indigo-500/30 resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Category Type
                  </label>
                  <select
                    value={createFormCategory}
                    onChange={(e) => setCreateFormCategory(e.target.value)}
                    className="w-full bg-[#030712] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition cursor-pointer"
                  >
                    <option value="Feedback & Experience">Feedback & Experience</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Customer Satisfaction (CSAT)">Customer Satisfaction (CSAT)</option>
                    <option value="Event Registration">Event Registration</option>
                    <option value="Product Feedback">Product Feedback</option>
                    <option value="Custom Workflow">Custom Workflow</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex justify-between font-mono">
                    <span>Tags / Label Flags</span>
                    <span className="text-[8px] text-slate-500 normal-case">Press Enter to lock tag</span>
                  </label>
                  <div className="w-full bg-[#030712]/60 border border-white/[0.08] rounded-xl p-2 min-h-[44px] flex flex-wrap gap-1.5 items-center">
                    {createFormTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[9px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-indigo-500/35 rounded-full p-0.5 transition cursor-pointer flex items-center justify-center"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={createFormTags.length === 0 ? "e.g. sales, client, priority" : ""}
                      className="bg-transparent text-xs placeholder-slate-600 outline-none border-none flex-1 min-w-[120px] text-white px-2 py-0.5"
                    />
                  </div>
                </div>

                {/* Status Toggle buttons */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Deployment Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCreateFormStatus("draft")}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        createFormStatus === "draft"
                          ? "bg-slate-800/80 border-slate-700 text-white shadow-md ring-1 ring-slate-700"
                          : "bg-transparent border-white/[0.08] text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span>Draft / Inactive</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateFormStatus("live")}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        createFormStatus === "live"
                          ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-md ring-1 ring-indigo-500/20"
                          : "bg-transparent border-white/[0.08] text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span>Active / Live</span>
                    </button>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-white/[0.08] hover:bg-white/[0.02] text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel Setup
                  </button>
                  <button
                    type="submit"
                    disabled={createFormMutation.isPending || !createFormTitle.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createFormMutation.isPending ? "Configuring..." : "Create Workspace"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteId !== null && (
          <div id="delete-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-red-500/20 rounded-[24px] max-w-md w-full p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl w-12 h-12 flex items-center justify-center">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-base">Permanently delete schema?</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  This action is irreversible and will purge all version metadata, field canvas mappings, and recorded submissions from the relational MySQL store.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.02] text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {deleteMutation.isPending ? "Purging..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. WORKSPACE FOOTER */}
      <footer className="mt-12 pt-6 border-t border-white/[0.04] text-[10px] text-slate-500 font-mono relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Workflow className="w-3.5 h-3.5 text-indigo-500/80" />
          <span>FormFlow v2.5 Enterprise</span>
          <span className="text-slate-700">•</span>
          <span>Workspace Console active</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            FastAPI: Connected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            MySQL: Online
          </span>
        </div>
      </footer>
    </div>
  );
}
