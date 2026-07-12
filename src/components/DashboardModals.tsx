import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import {
  X,
  Sparkles,
  ArrowRight,
  Code,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  Copy,
  Terminal,
  BrainCircuit,
  Database,
  Mail,
  Users,
  Lock,
  Link,
  Share2,
  Send,
  ShieldAlert,
  Check
} from "lucide-react";

interface AIFormGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export function AIFormGenerator({ isOpen, onClose, onSubmit, isGenerating }: AIFormGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setPrompt("");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="ai-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#111827]/95 border border-indigo-500/30 text-white rounded-[24px] w-full max-w-lg shadow-[0_0_35px_rgba(99,102,241,0.25)] relative z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                    FormFlow AI Assistant
                  </h3>
                  <p className="text-[10px] text-slate-400">Describe your schema to autogenerate a Pydantic model</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <BrainCircuit className="w-12 h-12 text-indigo-400 animate-bounce" />
                  <div className="flex flex-col items-center space-y-1 text-center">
                    <p className="text-sm font-bold text-white font-mono">Synthesizing structure fields...</p>
                    <p className="text-[10px] text-slate-500 max-w-[280px]">Drafting field mapping, validators, and category tagging...</p>
                  </div>
                  <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ) : success ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Schema Dispatched</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Successfully configured form with structured validation fields</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Natural Language Prompt
                    </label>
                    <textarea
                      required
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Create a developer satisfaction survey with text area for API bugs, rating 1-5 for SDK usage, and a contact email field..."
                      rows={4}
                      className="w-full bg-[#030712]/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-indigo-500/30 resize-none font-sans"
                    />
                  </div>

                  <div className="bg-[#030712]/40 border border-white/[0.04] p-3 rounded-xl flex gap-2 items-start">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div className="text-[9px] text-slate-400 leading-normal font-mono">
                      <p className="text-slate-300 font-bold">Suggested terms to include:</p>
                      <p>※ "email validation", "CSAT rating", "required parameters", "nested categories"</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 border border-white/[0.08] hover:bg-white/[0.02] text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancel Setup
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer"
                    >
                      <span>Generate Model</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface JSONSchemaImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (title: string, description: string, category: string, tags: string[]) => void;
}

export function JSONSchemaImporter({ isOpen, onClose, onImport }: JSONSchemaImporterProps) {
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(payload);
      if (!parsed.title) {
        setError("Invalid schema structure. A 'title' property is required.");
        return;
      }
      onImport(
        parsed.title,
        parsed.description || "Imported JSON Configuration",
        parsed.category || "Custom Workflow",
        parsed.tags || ["json-import"]
      );
      setPayload("");
      setError("");
      onClose();
    } catch (err) {
      setError("Syntactical parsing error. Please check your JSON indentation.");
    }
  };

  const loadExample = () => {
    const example = {
      title: "Alpha Feedback Model",
      description: "Synchronized REST collector for client integrations.",
      category: "Product Feedback",
      tags: ["alpha", "json-api", "engineering"]
    };
    setPayload(JSON.stringify(example, null, 2));
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="json-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#111827]/95 border border-white/[0.08] text-white rounded-[24px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <Code className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">Import JSON Configuration</h3>
                  <p className="text-[10px] text-slate-400">Instantly seed a low-code database structure</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Schema Config Block (JSON)
                </label>
                <button
                  type="button"
                  onClick={loadExample}
                  className="text-[9px] font-mono text-indigo-400 hover:underline cursor-pointer"
                >
                  Load Valid Template
                </button>
              </div>

              <textarea
                required
                value={payload}
                onChange={(e) => {
                  setPayload(e.target.value);
                  setError("");
                }}
                placeholder={`{\n  "title": "Corporate Compliance Schema",\n  "description": "Standard compliance validation schema",\n  "category": "Custom Workflow",\n  "tags": ["compliance", "audit"]\n}`}
                rows={6}
                className="w-full bg-[#030712]/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 outline-none transition focus:ring-1 focus:ring-indigo-500/30 resize-none font-mono"
              />

              {error && (
                <p className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                  ※ {error}
                </p>
              )}

              <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-white/[0.08] hover:bg-white/[0.02] text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel Setup
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Inject Schema</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ExcelImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (title: string, description: string, category: string, tags: string[]) => void;
}

export function ExcelImporter({ isOpen, onClose, onImport }: ExcelImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    triggerUpload();
  };

  const triggerUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onImport(
        "Imported Data Spreadsheet Pipeline",
        "Dynamically compiled schema generated from file cells mapping.",
        "Custom Workflow",
        ["excel", "ingest", "automated"]
      );
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="excel-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#111827]/95 border border-white/[0.08] text-white rounded-[24px] w-full max-w-md shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">Import spreadsheet data</h3>
                  <p className="text-[10px] text-slate-400">Transform xlsx, csv or numbers cell definitions</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isUploading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <Database className="w-12 h-12 text-indigo-400 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-white font-mono">Parsing excel structure...</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Creating relational table configuration mapped from cells</p>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerUpload}
                  className={`border-2 border-dashed rounded-[20px] p-10 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition duration-200 ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="p-3 bg-[#030712]/60 rounded-full border border-white/[0.04]">
                    <Upload className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Drag and drop file here</p>
                    <p className="text-[10px] text-slate-400">or click to browse local folders</p>
                  </div>
                  <span className="text-[8px] font-mono text-slate-600 bg-[#030712]/50 px-2 py-1 rounded">Supported: .csv, .xlsx, .tsv</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ShareToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
}

export function ShareToast({ show, onClose, title }: ShareToastProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-[#111827] border border-indigo-500/30 text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-[0_4px_30px_rgba(99,102,241,0.15)] max-w-sm"
        >
          <div className="p-2 bg-indigo-500/15 rounded-lg border border-indigo-500/25 flex-shrink-0 text-indigo-400">
            <Copy className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-bold text-white truncate">Link Copied</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">Direct form link for "{title}" locked to clipboard.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: number | string | null;
  formTitle: string;
}

interface Collaborator {
  email: string;
  permission: string;
  status: "Active" | "Pending";
  date: string;
}

export function ShareModal({ isOpen, onClose, formId, formTitle }: ShareModalProps) {
  const { theme, styles } = useTheme();
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("clone");
  const [message, setMessage] = useState(`Hi! Check out this template/form "${formTitle}" I created on the Low-Code Dynamic Form Platform. You can access and use it directly.`);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { email: "madhanmohan01107@gmail.com", permission: "Owner (You)", status: "Active", date: new Date().toISOString().split('T')[0] }
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      
      const permissionLabel = 
        permission === "clone" ? "Can Clone & Use Template" : 
        permission === "submit" ? "Can Submit Responses" : "Co-Editor (Manage Schema)";

      setCollaborators(prev => [
        ...prev,
        {
          email: email.trim(),
          permission: permissionLabel,
          status: "Pending",
          date: new Date().toISOString().split('T')[0]
        }
      ]);
      
      setEmail("");
      
      setTimeout(() => {
        setSendSuccess(false);
      }, 3000);
    }, 1000);
  };

  const directLink = `${window.location.origin}/form/${formId || "temp"}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="share-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`w-full max-w-2xl rounded-[24px] border shadow-2xl relative z-10 overflow-hidden text-left flex flex-col md:flex-row max-h-[90vh] md:max-h-none ${
              theme === "dark" 
                ? "bg-[#111827]/95 border-indigo-500/30 text-white" 
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Left Section: Active Form Details & Live Link */}
            <div className={`p-6 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r ${
              theme === "dark" ? "border-white/[0.06] bg-slate-900/40" : "border-slate-100 bg-slate-50/50"
            }`}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">Share System</span>
                    <h3 className={`text-sm font-black tracking-tight ${styles.textHeading}`}>Distribute Schema</h3>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${
                  theme === "dark" ? "bg-slate-950/40 border-white/[0.06]" : "bg-white border-slate-200 shadow-3xs"
                }`}>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Schema/Template</p>
                  <p className={`text-xs font-bold truncate ${styles.textHeading}`}>{formTitle}</p>
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
                    UUID: {formId || "SYSTEM_TEMP"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className={`text-[10px] font-mono font-bold uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Direct Clipboard Link</p>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    Friends and colleagues can access this form directly using the unique URL link to clone, test, or fill answers.
                  </p>
                </div>
              </div>

              {/* Copy Link Section */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={directLink}
                    className={`flex-1 text-[10px] font-mono px-3 py-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500/30 ${styles.input}`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
                      copied 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                        : styles.buttonSecondary
                    }`}
                    title="Copy unique link to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section: Share Form & Collaborator Handshakes */}
            <div className="p-6 md:w-7/12 flex flex-col justify-between min-h-0 overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h4 className={`text-base font-bold tracking-tight ${styles.textHeading}`}>Share with another user</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Send a secure invitation to your friend to view, clone, or co-author.</p>
                </div>

                <form onSubmit={handleSendInvite} className="space-y-4">
                  {/* Friend Email */}
                  <div className="space-y-1.5 text-left">
                    <label className={`text-[10px] font-mono font-bold uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Friend's Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. friend@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition focus:ring-2 focus:ring-indigo-500/20 ${styles.input}`}
                      />
                    </div>
                  </div>

                  {/* Permissions Selection */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1.5 col-span-2">
                      <label className={`text-[10px] font-mono font-bold uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Choose Access Permission</label>
                      <select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${styles.input}`}
                      >
                        <option value="clone">Can Clone & Use Template (Cloning Mode)</option>
                        <option value="submit">Can Fill Responses Only (Intake Mode)</option>
                        <option value="edit">Can Edit Schema & Layout (Collaboration Mode)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5 text-left">
                    <label className={`text-[10px] font-mono font-bold uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Custom Message</label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-[10px] outline-none transition focus:ring-2 focus:ring-indigo-500/20 resize-none ${styles.input}`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSending || !email}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
                        sendSuccess 
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                          : styles.buttonPrimary
                      }`}
                    >
                      {isSending ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Invite...</span>
                        </>
                      ) : sendSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Invitation Sent!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Invitation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Simulated Handshakes/Collaborators List */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-mono font-bold uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Workspace Members & Guests</label>
                    <span className="text-[8px] font-mono text-slate-400 uppercase">2-Way Secure Handshake</span>
                  </div>

                  <div className={`border rounded-xl divide-y divide-slate-100 dark:divide-white/5 max-h-40 overflow-y-auto ${
                    theme === "dark" ? "border-white/[0.06] bg-[#030712]/40" : "border-slate-150 bg-slate-50/20"
                  }`}>
                    {collaborators.map((user, i) => (
                      <div key={i} className="flex justify-between items-center p-2 px-3 text-[10px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                            user.status === "Active" ? "bg-indigo-500/15 text-indigo-400" : "bg-amber-500/10 text-amber-500 animate-pulse"
                          }`}>
                            {user.email.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0 text-left">
                            <p className={`font-semibold truncate ${styles.textHeading}`}>{user.email}</p>
                            <p className="text-[8px] text-slate-400">{user.permission} • Invited {user.date}</p>
                          </div>
                        </div>

                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold ${
                          user.status === "Active" 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
