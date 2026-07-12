import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  ChevronDown,
  CheckSquare,
  CircleDot,
  Calendar,
  Star,
  UploadCloud,
  Phone,
  MapPin,
  Minus,
  Heading as HeadingIcon,
  TextQuote,
  Trash2,
  Copy,
  Settings,
  Eye,
  Save,
  Undo2,
  Redo2,
  Sparkles,
  Check,
  Plus,
  ArrowLeft,
  GripVertical,
  ChevronRight,
  Info,
  X,
  Play,
  CornerDownRight,
  Sparkle,
  FileCheck2,
  Search,
  CheckCircle,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
  Clock,
  ToggleLeft
} from "lucide-react";

// Definitions
interface FieldDraft {
  id: string; // Dynamic drag unique ID
  name: string;
  label: string;
  field_type: "text" | "number" | "select" | "radio" | "checkbox" | "textarea" | "date" | "time" | "switch" | "email" | "rating" | "file" | "phone" | "address" | "divider" | "heading" | "paragraph";
  is_required: boolean;
  placeholder: string;
  options: { label: string; value: string; order: number }[];
  description?: string;
  default_value?: string;
  validation_min?: number;
  validation_max?: number;
  validation_regex?: string;
  conditional_rules?: {
    dependent_field: string;
    operator: string;
    value: string;
    action: "show" | "hide" | "require";
  }[];
}

const REGEX_PRESETS = [
  { label: "None / Custom", value: "" },
  { label: "Email Address", value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", desc: "Validates standard email formatting" },
  { label: "Numbers Only", value: "^\\d+$", desc: "Digits only, no letters or spaces" },
  { label: "Alphanumeric", value: "^[a-zA-Z0-9]+$", desc: "Letters and numbers, no symbols" },
  { label: "US Zip Code", value: "^\\d{5}(-\\d{4})?$", desc: "Standard 5 or 9 digit zip code" },
  { label: "Website URL", value: "^https?:\\/\\/[^\\s$.?#].[^\\s]*$", desc: "Strict http/https protocol url" }
];

const FIELD_LIBRARY_CATEGORIES = [
  {
    name: "Standard Fields",
    items: [
      { type: "text", label: "Text Input", icon: Type, desc: "Single line name or values" },
      { type: "textarea", label: "Long Text", icon: AlignLeft, desc: "Paragraph responses and notes" },
      { type: "email", label: "Email Address", icon: Mail, desc: "Validated email addresses" },
      { type: "number", label: "Number Input", icon: Hash, desc: "Acreages, prices, quantities" },
      { type: "phone", label: "Phone Number", icon: Phone, desc: "Contact telephone format" }
    ]
  },
  {
    name: "Selections & Scores",
    items: [
      { type: "select", label: "Dropdown Select", icon: ChevronDown, desc: "Compact selectable picker" },
      { type: "checkbox", label: "Checkboxes", icon: CheckSquare, desc: "Choose multiple properties" },
      { type: "radio", label: "Radio Buttons", icon: CircleDot, desc: "Enforce single choice list" },
      { type: "rating", label: "Star Rating", icon: Star, desc: "NPS and visual scoring widget" },
      { type: "date", label: "Date Picker", icon: Calendar, desc: "Standard milestone calender date" },
      { type: "time", label: "Time Picker", icon: Clock, desc: "Standard hour/minute clock selector" },
      { type: "switch", label: "Yes/No Switch", icon: ToggleLeft, desc: "Simple yes or no binary toggle" }
    ]
  },
  {
    name: "Media & Structures",
    items: [
      { type: "file", label: "File Upload", icon: UploadCloud, desc: "Documents and visual uploads" },
      { type: "address", label: "Address Block", icon: MapPin, desc: "City, state, zip box grouping" },
      { type: "heading", label: "Section Heading", icon: HeadingIcon, desc: "Visual title block splitter" },
      { type: "paragraph", label: "Paragraph Block", icon: TextQuote, desc: "Custom HTML notes and details" },
      { type: "divider", label: "Visual Divider", icon: Minus, desc: "Thin layout horizontal lines" }
    ]
  }
];

export default function FormBuilder() {
  const { theme, styles } = useTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Parse form ID from search params
  const queryParams = new URLSearchParams(window.location.search);
  const formIdStr = queryParams.get("id");
  const formId = formIdStr ? parseInt(formIdStr) : null;

  // General Form Meta
  const [title, setTitle] = useState("Untitled Premium Survey");
  const [description, setDescription] = useState("Tell us about your preferences to configure your workflow workspace.");
  
  // Fields state
  const [fields, setFields] = useState<FieldDraft[]>([
    {
      id: "text_initial_1",
      name: "fullname",
      label: "Full Name",
      field_type: "text",
      is_required: true,
      placeholder: "e.g. Jane Doe",
      options: [],
      description: "Please enter your first and last name"
    },
    {
      id: "email_initial_2",
      name: "email",
      label: "Work Email",
      field_type: "email",
      is_required: true,
      placeholder: "e.g. jane@company.com",
      options: [],
      description: "We will send your analytics workflow credentials here"
    }
  ]);

  // Selected field index for configuration pane
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"general" | "validation" | "choices" | "logic">("general");

  // History Stacks (Undo & Redo)
  const [history, setHistory] = useState<FieldDraft[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Preview Mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>({});
  const [previewFiles, setPreviewFiles] = useState<Record<string, File[]>>({});
  const [previewSuccess, setPreviewSuccess] = useState(false);

  // Studio and FAB states
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "idle">("saved");

  // Success state for publish toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Fetch form query if editing
  const { data: loadedForm, isLoading: isFormLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => (formId ? api.getForm(formId) : null),
    enabled: !!formId,
  });

  // Initialize from loaded Form
  useEffect(() => {
    if (loadedForm) {
      setTitle(loadedForm.title || "Untitled Premium Survey");
      setDescription(loadedForm.description || "");
      if (loadedForm.versions && loadedForm.versions.length > 0) {
        const latestVer = [...loadedForm.versions].sort(
          (a, b) => b.version_number - a.version_number
        )[0];
        if (latestVer && latestVer.fields) {
          const mapped: FieldDraft[] = latestVer.fields.map((f: any) => ({
            id: f.id ? String(f.id) : `loaded_${f.name}_${Date.now()}`,
            name: f.name,
            label: f.label || "Untitled",
            field_type: f.field_type,
            is_required: !!f.is_required,
            placeholder: f.placeholder || "",
            options: f.options || [],
            description: f.validation_rules?.description || f.description || "",
            default_value: f.validation_rules?.default_value || f.default_value || "",
            validation_min: f.validation_rules?.min,
            validation_max: f.validation_rules?.max,
            validation_regex: f.validation_rules?.regex
          }));
          setFields(mapped);
          setHistory([JSON.parse(JSON.stringify(mapped))]);
          setHistoryIndex(0);
        }
      }
    }
  }, [loadedForm]);

  // Simulate autosave syncing animations
  useEffect(() => {
    if (fields.length > 0) {
      setSaveState("saving");
      const t = setTimeout(() => {
        setSaveState("saved");
      }, 700);
      return () => clearTimeout(t);
    }
  }, [fields, title, description]);

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoids breaking click events on inputs
      },
    })
  );

  // Generate system slug from label
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 30);
  };

  // State undo/redo push helper
  const updateFieldsAndHistory = (newFields: FieldDraft[]) => {
    setFields(newFields);
    const prunedHistory = history.slice(0, historyIndex + 1);
    prunedHistory.push(JSON.parse(JSON.stringify(newFields)));
    setHistory(prunedHistory);
    setHistoryIndex(prunedHistory.length - 1);
  };

  // Initialize history on start
  useEffect(() => {
    if (history.length === 0 && fields.length > 0) {
      setHistory([JSON.parse(JSON.stringify(fields))]);
      setHistoryIndex(0);
    }
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setFields(JSON.parse(JSON.stringify(history[prevIndex])));
      if (selectedIdx >= history[prevIndex].length) {
        setSelectedIdx(Math.max(0, history[prevIndex].length - 1));
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setFields(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  // Add field helper
  const addField = (type: FieldDraft["field_type"]) => {
    const defaultLabel = `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const newField: FieldDraft = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: slugify(`${defaultLabel}_${fields.length + 1}`),
      label: defaultLabel,
      field_type: type,
      is_required: false,
      placeholder: type === "select" ? "Choose an option..." : "",
      options: ["select", "radio", "checkbox"].includes(type)
        ? [
            { label: "Option A", value: "option_a", order: 0 },
            { label: "Option B", value: "option_b", order: 1 }
          ]
        : [],
      description: ""
    };

    const updated = [...fields, newField];
    updateFieldsAndHistory(updated);
    setSelectedIdx(updated.length - 1);

    // Switch tab correctly
    if (["select", "radio", "checkbox"].includes(type)) {
      setActiveTab("choices");
    } else {
      setActiveTab("general");
    }
  };

  // Delete field
  const handleDeleteField = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = [...fields];
    copy.splice(idx, 1);
    updateFieldsAndHistory(copy);
    
    if (copy.length === 0) {
      setSelectedIdx(0);
    } else if (selectedIdx >= copy.length) {
      setSelectedIdx(copy.length - 1);
    }
  };

  // Duplicate field
  const handleDuplicateField = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const source = fields[idx];
    const duplicated: FieldDraft = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.field_type}_dup_${Date.now()}`,
      name: slugify(`${source.name}_copy`),
      label: `${source.label} (Copy)`
    };

    const copy = [...fields];
    copy.splice(idx + 1, 0, duplicated);
    updateFieldsAndHistory(copy);
    setSelectedIdx(idx + 1);
  };

  // Update specific field properties safely
  const updateFieldProp = (idx: number, key: keyof FieldDraft, value: any) => {
    const copy = [...fields];
    const field = { ...copy[idx] };

    if (key === "label") {
      // Keep name slug in sync if not manually locked
      if (field.name === slugify(field.label) || field.name === slugify(`${field.label}_${idx + 1}`)) {
        field.name = slugify(value);
      }
      field.label = value;
    } else {
      (field as any)[key] = value;
    }

    copy[idx] = field;
    // Don't push to history on every single keystroke; trigger on value changes or debounce
    // To ensure full high-fidelity undo we push directly here
    setFields(copy);
  };

  // Commit field change to history stack on blur (prevents massive lag in typing)
  const commitFieldProps = () => {
    updateFieldsAndHistory(fields);
  };

  // Choice Options Builder helpers
  const handleAddOption = (fieldIdx: number) => {
    const copy = [...fields];
    const field = copy[fieldIdx];
    const letter = String.fromCharCode(65 + field.options.length);
    field.options.push({
      label: `Option ${letter}`,
      value: slugify(`Option ${letter}`),
      order: field.options.length
    });
    updateFieldsAndHistory(copy);
  };

  const handleUpdateOption = (fieldIdx: number, optIdx: number, key: "label" | "value", val: string) => {
    const copy = [...fields];
    const opt = copy[fieldIdx].options[optIdx];
    opt[key] = val;
    if (key === "label") {
      opt.value = slugify(val);
    }
    setFields(copy);
  };

  const handleRemoveOption = (fieldIdx: number, optIdx: number) => {
    const copy = [...fields];
    copy[fieldIdx].options.splice(optIdx, 1);
    updateFieldsAndHistory(copy);
  };

  // Logic Rules helpers
  const handleAddLogicRule = () => {
    const copy = [...fields];
    const field = { ...copy[selectedIdx] };
    if (!field.conditional_rules) {
      field.conditional_rules = [];
    }
    field.conditional_rules.push({
      dependent_field: "",
      operator: "equals",
      value: "",
      action: "show"
    });
    copy[selectedIdx] = field;
    updateFieldsAndHistory(copy);
  };

  const handleUpdateLogicRule = (ruleIdx: number, key: string, val: any) => {
    const copy = [...fields];
    const field = { ...copy[selectedIdx] };
    if (field.conditional_rules && field.conditional_rules[ruleIdx]) {
      const rule = { ...field.conditional_rules[ruleIdx] };
      (rule as any)[key] = val;
      field.conditional_rules[ruleIdx] = rule;
      copy[selectedIdx] = field;
      setFields(copy);
    }
  };

  const handleRemoveLogicRule = (ruleIdx: number) => {
    const copy = [...fields];
    const field = { ...copy[selectedIdx] };
    if (field.conditional_rules) {
      field.conditional_rules.splice(ruleIdx, 1);
      copy[selectedIdx] = field;
      updateFieldsAndHistory(copy);
    }
  };

  // dnd-kit Drag reorder logic
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      
      const reordered = arrayMove(fields, oldIndex, newIndex) as FieldDraft[];
      updateFieldsAndHistory(reordered);
      setSelectedIdx(newIndex);
    }
  };

  // Create Form Mutation calling Express database proxy
  const createFormMutation = useMutation({
    mutationFn: api.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate("/dashboard");
      }, 1800);
    },
    onError: () => {
      alert("Failed to publish workflow schema. Please check server status.");
    }
  });

  const updateFormMutation = useMutation({
    mutationFn: async ({
      id,
      meta,
      fieldsData,
    }: {
      id: number;
      meta: { title: string; description: string };
      fieldsData: any[];
    }) => {
      await api.updateForm(id, meta);
      await api.createFormVersion(id, { is_published: true, fields: fieldsData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate("/dashboard");
      }, 1800);
    },
    onError: () => {
      alert("Failed to update form schema. Please check server status.");
    },
  });

  const handlePublishForm = () => {
    if (!title.trim()) {
      alert("Form title is required to publish workspace.");
      return;
    }
    if (fields.length === 0) {
      alert("Please configure at least one active form field.");
      return;
    }

    // Format fields for backend storage requirements
    const cleanedFields = fields.map((f, idx) => ({
      name: f.name || `field_${idx}`,
      label: f.label || "Untitled Field",
      field_type: f.field_type,
      is_required: f.is_required,
      placeholder: f.placeholder || "",
      validation_rules: {
        description: f.description || "",
        default_value: f.default_value || "",
        min: f.validation_min,
        max: f.validation_max,
        regex: f.validation_regex,
        conditional_rules: f.conditional_rules || []
      },
      order: idx,
      options: f.options
    }));

    if (formId) {
      updateFormMutation.mutate({
        id: formId,
        meta: { title, description },
        fieldsData: cleanedFields,
      });
    } else {
      createFormMutation.mutate({
        title,
        description,
        is_active: true,
        initial_fields: cleanedFields
      });
    }
  };

  // Live Preview Form Interaction & Validations
  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      // Exclude visual elements from submissions
      if (["heading", "paragraph", "divider"].includes(field.field_type)) {
        return;
      }

      const { isHidden, isRequired } = evaluateFieldVisibilityAndRequirement(field, previewValues);
      if (isHidden) {
        return;
      }

      const val = previewValues[field.name];

      // Required validations
      if (isRequired) {
        if (field.field_type === "checkbox") {
          const checkedCount = Object.values(val || {}).filter(Boolean).length;
          if (checkedCount === 0) {
            errors[field.name] = "At least one option must be selected.";
          }
        } else if (field.field_type === "file") {
          const files = previewFiles[field.name] || [];
          if (files.length === 0) {
            errors[field.name] = "File attachment is required.";
          }
        } else if (val === undefined || val === null || val === "" || (typeof val === "number" && isNaN(val))) {
          errors[field.name] = "This field is required.";
        }
      }

      // Numeric validations
      if (field.field_type === "number" && val !== undefined && val !== "") {
        const num = Number(val);
        if (field.validation_min !== undefined && num < field.validation_min) {
          errors[field.name] = `Value cannot be less than ${field.validation_min}.`;
        }
        if (field.validation_max !== undefined && num > field.validation_max) {
          errors[field.name] = `Value cannot be greater than ${field.validation_max}.`;
        }
      }

      // Text length validations
      if (["text", "textarea", "email"].includes(field.field_type) && val) {
        const textVal = String(val);
        if (field.validation_min !== undefined && textVal.length < field.validation_min) {
          errors[field.name] = `Response must be at least ${field.validation_min} characters.`;
        }
        if (field.validation_max !== undefined && textVal.length > field.validation_max) {
          errors[field.name] = `Response cannot exceed ${field.validation_max} characters.`;
        }
      }

      // Custom regex presets validations
      if (field.validation_regex && val) {
        try {
          const regex = new RegExp(field.validation_regex);
          if (!regex.test(String(val))) {
            errors[field.name] = "Response format is invalid.";
          }
        } catch (err) {
          // Bad regex config, skip
        }
      }
    });

    setPreviewErrors(errors);

    if (Object.keys(errors).length === 0) {
      setPreviewSuccess(true);
      setTimeout(() => {
        setPreviewSuccess(false);
        setPreviewValues({});
        setPreviewFiles({});
      }, 3500);
    }
  };

  // Helper star renderer for star rating selection
  const handleStarClick = (fieldName: string, rating: number) => {
    setPreviewValues({ ...previewValues, [fieldName]: rating });
  };

  // File drag & drop mock uploader helpers
  const handleFileChange = (fieldName: string, filesList: FileList | null) => {
    if (!filesList) return;
    const currentFiles = previewFiles[fieldName] || [];
    const addedFiles = Array.from(filesList);
    setPreviewFiles({
      ...previewFiles,
      [fieldName]: [...currentFiles, ...addedFiles]
    });
  };

  const removeFileAttachment = (fieldName: string, fileIdx: number) => {
    const currentFiles = previewFiles[fieldName] || [];
    const updated = [...currentFiles];
    updated.splice(fileIdx, 1);
    setPreviewFiles({
      ...previewFiles,
      [fieldName]: updated
    });
  };

  // Static helper to get component visual icon
  const getFieldIcon = (type: string) => {
    const found = FIELD_LIBRARY_CATEGORIES.flatMap((c) => c.items).find((i) => i.type === type);
    return found ? found.icon : Type;
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col selection:bg-indigo-600 selection:text-white font-sans transition-colors duration-300 ${styles.bgPage} ${styles.textPrimary}`}>
      
      {/* 1. TOP CONTROL BAR */}
      <header className={`h-14 border-b px-6 flex items-center justify-between shadow-xs sticky top-0 z-30 transition-colors duration-300 ${styles.border} ${styles.card}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className={`p-1.5 rounded-lg transition cursor-pointer ${theme === 'white' ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
            title="Back to workspace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className={`h-4 w-px ${theme === 'white' ? 'bg-slate-200' : 'bg-white/10'}`} />
          
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider font-mono ${theme === 'white' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <Sparkles className="w-3 h-3 fill-current" />
              v1.2 Studio
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`font-bold text-sm bg-transparent outline-none px-2 py-1 rounded transition max-w-[280px] md:max-w-md ${styles.textHeading}`}
              placeholder="Give your form a title..."
            />
          </div>

          <div className={`h-4 w-px ${theme === 'white' ? 'bg-slate-200' : 'bg-white/10'}`} />

          {/* Glowing autosave state indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border ${theme === 'white' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${saveState === "saving" ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />
            <span>{saveState === "saving" ? "Syncing..." : "Autosaved"}</span>
          </div>
        </div>

        {/* Studio Actions Toolbar */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo Stacks */}
          <div className={`flex items-center p-1 rounded-lg ${theme === 'white' ? 'bg-slate-100' : 'bg-white/5'}`}>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 disabled:opacity-40 rounded transition cursor-pointer ${theme === 'white' ? 'text-slate-500 hover:text-slate-900 hover:bg-white disabled:hover:bg-transparent' : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:hover:bg-transparent'}`}
              title="Undo Action (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 disabled:opacity-40 rounded transition cursor-pointer ${theme === 'white' ? 'text-slate-500 hover:text-slate-900 hover:bg-white disabled:hover:bg-transparent' : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:hover:bg-transparent'}`}
              title="Redo Action (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className={`h-4 w-px mx-1 ${theme === 'white' ? 'bg-slate-200' : 'bg-white/10'}`} />

          {/* Preview State Toggle */}
          <button
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              setPreviewErrors({});
              setPreviewSuccess(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              isPreviewMode
                ? (theme === 'white' 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/50" 
                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20")
                : (theme === 'white' 
                    ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700" 
                    : "bg-slate-900 border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-200")
            }`}
          >
            {isPreviewMode ? (
              <>
                <Settings className={`w-4 h-4 animate-spin ${theme === 'white' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <span>Designer Studio</span>
              </>
            ) : (
              <>
                <Eye className={`w-4 h-4 ${theme === 'white' ? 'text-slate-600' : 'text-slate-400'}`} />
                <span>Live Preview</span>
              </>
            )}
          </button>

          {/* Save & Publish Form */}
          <button
            onClick={handlePublishForm}
            disabled={createFormMutation.isPending || updateFormMutation.isPending}
            className={`px-4 py-1.5 rounded-lg font-semibold text-sm shadow-sm hover:shadow flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 text-white ${
              theme === 'white' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>
              {createFormMutation.isPending || updateFormMutation.isPending
                ? "Deploying..."
                : formId
                ? "Update Form"
                : "Deploy Form"}
            </span>
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* SUCCESS FLY-OUT TOAST */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-16 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3.5 rounded-xl shadow-xl font-medium flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">Workflow Deployed Successfully</p>
                <p className="text-xs text-slate-400">Database & versions schemas synchronized.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isPreviewMode ? (
          
          /* =================== PREVIEW LIVE RENDERING CANVAS =================== */
          <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center bg-slate-100 relative">
            
            {/* DEVICE PREVIEW TOGGLE BAR */}
            <div className="mb-4 flex items-center bg-white border border-slate-200/60 p-1 rounded-xl shadow-xs gap-1 relative z-10">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-blue-50 text-blue-600 border border-blue-100/50 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  previewDevice === "tablet"
                    ? "bg-blue-50 text-blue-600 border border-blue-100/50 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-blue-50 text-blue-600 border border-blue-100/50 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`bg-white transition-all duration-300 relative overflow-hidden ${
                previewDevice === "desktop"
                  ? "max-w-2xl w-full rounded-2xl border border-slate-200 shadow-lg p-10 mt-2"
                  : previewDevice === "tablet"
                  ? "w-[768px] rounded-3xl border-8 border-slate-800 shadow-2xl p-8 mt-2 max-h-[80vh] overflow-y-auto"
                  : "w-[375px] rounded-[3rem] border-12 border-slate-900 shadow-2xl p-6 mt-2 max-h-[70vh] overflow-y-auto relative bg-white"
              }`}
            >
              {/* Success Screen Overlay */}
              <AnimatePresence>
                {previewSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-6"
                    >
                      <Check className="w-8 h-8 stroke-[3]" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-slate-900">Response Registered!</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">
                      Your response compiled with zero schema errors. Validation rules verified successfully.
                    </p>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left w-full max-w-md max-h-[220px] overflow-y-auto">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Submitted Key-Value Payloads</p>
                      <pre className="text-xs font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-100 overflow-x-auto">
                        {JSON.stringify(previewValues, null, 2)}
                      </pre>
                    </div>

                    <button
                      onClick={() => setPreviewSuccess(false)}
                      className="mt-6 text-xs text-blue-600 hover:text-blue-800 font-bold tracking-wide uppercase transition hover:underline"
                    >
                      Fill Out Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Branding Header */}
              <div className="border-b border-slate-150 pb-6 mb-8">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{title || "Untitled Questionnaire"}</h1>
                {description && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>}
              </div>

              {/* Interactive Inputs */}
              <form onSubmit={handlePreviewSubmit} className="space-y-6">
                {fields.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
                    <Sparkles className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
                    <p className="font-semibold text-slate-600">This Form is Empty</p>
                    <p className="text-xs max-w-xs mt-1">Please return to the Designer Studio and add custom fields to render.</p>
                  </div>
                ) : (
                  fields.map((field) => {
                    const { isHidden, isRequired } = evaluateFieldVisibilityAndRequirement(field, previewValues);
                    if (isHidden) {
                      return null;
                    }

                    const hasError = previewErrors[field.name];

                    // Visual-only element blocks
                    if (field.field_type === "divider") {
                      return <hr key={field.id} className="border-t border-slate-200 my-8" />;
                    }
                    if (field.field_type === "heading") {
                      return (
                        <div key={field.id} className="pt-4 pb-2">
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{field.label}</h2>
                          {field.description && <p className="text-xs text-slate-400 mt-0.5">{field.description}</p>}
                        </div>
                      );
                    }
                    if (field.field_type === "paragraph") {
                      return (
                        <div key={field.id} className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-xl">
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{field.label}</p>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block tracking-wide">
                          {field.label}
                          {isRequired && <span className="text-rose-500 ml-1 font-extrabold">*</span>}
                        </label>
                        {field.description && (
                          <p className="text-xs text-slate-400">{field.description}</p>
                        )}

                        {/* Rendering different live form controls */}
                        {field.field_type === "text" && (
                          <input
                            type="text"
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            placeholder={field.placeholder || "Enter response..."}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "textarea" && (
                          <textarea
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            placeholder={field.placeholder || "Describe details..."}
                            rows={4}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "email" && (
                          <input
                            type="email"
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            placeholder={field.placeholder || "e.g. user@domain.com"}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "number" && (
                          <input
                            type="number"
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            placeholder={field.placeholder || "0"}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "phone" && (
                          <input
                            type="tel"
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            placeholder={field.placeholder || "e.g. +1 (555) 019-2834"}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "date" && (
                          <input
                            type="date"
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          />
                        )}

                        {field.field_type === "select" && (
                          <select
                            value={previewValues[field.name] || ""}
                            onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition ${
                              hasError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-blue-600"
                            }`}
                          >
                            <option value="">{field.placeholder || "Choose an option..."}</option>
                            {field.options.map((opt, oIdx) => (
                              <option key={oIdx} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.field_type === "radio" && (
                          <div className="space-y-2 pt-1">
                            {field.options.map((opt, oIdx) => (
                              <label key={oIdx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 transition">
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={opt.value}
                                  checked={previewValues[field.name] === opt.value}
                                  onChange={() => setPreviewValues({ ...previewValues, [field.name]: opt.value })}
                                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.field_type === "checkbox" && (
                          <div className="space-y-2 pt-1">
                            {field.options.map((opt, oIdx) => {
                              const currentVals = previewValues[field.name] || {};
                              return (
                                <label key={oIdx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 transition">
                                  <input
                                    type="checkbox"
                                    checked={!!currentVals[opt.value]}
                                    onChange={(e) => {
                                      setPreviewValues({
                                        ...previewValues,
                                        [field.name]: {
                                          ...currentVals,
                                          [opt.value]: e.target.checked
                                        }
                                      });
                                    }}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {field.field_type === "rating" && (
                          <div className="flex items-center gap-1.5 pt-1.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isSelected = (previewValues[field.name] || 0) >= star;
                              return (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => handleStarClick(field.name, star)}
                                  className="p-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      isSelected
                                        ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                                        : "text-slate-200 hover:text-amber-200"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {field.field_type === "file" && (
                          <div className="space-y-2">
                            <div className="border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-xl p-6 transition flex flex-col items-center justify-center relative cursor-pointer group">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(field.name, e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition mb-2" />
                              <p className="text-xs font-semibold text-slate-700">Drag files here or click to select</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG, or DOC (Max 10MB)</p>
                            </div>

                            {/* Uploaded Mock Files */}
                            {previewFiles[field.name] && previewFiles[field.name].length > 0 && (
                              <div className="space-y-1">
                                {previewFiles[field.name].map((file, fileIdx) => (
                                  <div key={fileIdx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                                    <span className="truncate max-w-[80%] font-semibold text-slate-700">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFileAttachment(field.name, fileIdx)}
                                      className="text-slate-400 hover:text-red-500 p-1"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {field.field_type === "address" && (
                          <div className="grid grid-cols-6 gap-3 pt-1">
                            <div className="col-span-6">
                              <input
                                type="text"
                                placeholder="Street Address"
                                value={previewValues[`${field.name}_street`] || ""}
                                onChange={(e) => setPreviewValues({ ...previewValues, [`${field.name}_street`]: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-600 bg-slate-50/50"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="text"
                                placeholder="City"
                                value={previewValues[`${field.name}_city`] || ""}
                                onChange={(e) => setPreviewValues({ ...previewValues, [`${field.name}_city`]: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-600 bg-slate-50/50"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="text"
                                placeholder="State"
                                value={previewValues[`${field.name}_state`] || ""}
                                onChange={(e) => setPreviewValues({ ...previewValues, [`${field.name}_state`]: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-600 bg-slate-50/50"
                              />
                            </div>
                            <div className="col-span-1">
                              <input
                                type="text"
                                placeholder="Zip"
                                value={previewValues[`${field.name}_zip`] || ""}
                                onChange={(e) => setPreviewValues({ ...previewValues, [`${field.name}_zip`]: e.target.value })}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-600 bg-slate-50/50"
                              />
                            </div>
                          </div>
                        )}

                        {/* Validation Error Message */}
                        {hasError && (
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-rose-600 text-[10px] font-bold flex items-center gap-1 mt-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{hasError}</span>
                          </motion.p>
                        )}
                      </div>
                    );
                  })
                )}

                {fields.length > 0 && (
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition transform active:scale-[0.99] cursor-pointer mt-8"
                  >
                    Submit Premium Form Response
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        ) : (
          
          /* =================== DYNAMIC FIGMA-STYLE EDITOR STUDIO =================== */
          <>
            
            {/* A. LEFT LIBRARY PANEL */}
            <aside className={`w-80 border-r flex flex-col z-10 shrink-0 transition-colors duration-300 ${styles.card} ${styles.border}`}>
              <div className={`p-4 border-b ${theme === 'white' ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-900/40 border-white/5'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Library</p>
                <p className={`text-[10px] mt-0.5 ${styles.textSecondary}`}>Click or drag elements to start forming</p>
              </div>

              {/* Grid categories list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {FIELD_LIBRARY_CATEGORIES.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{cat.name}</h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {cat.items.map((item, iIdx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={iIdx}
                            onClick={() => addField(item.type as any)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition group shadow-2xs cursor-pointer ${
                              theme === 'white' 
                                ? 'border-slate-100 hover:border-slate-300 bg-slate-50/40 hover:bg-white' 
                                : 'border-white/[0.04] hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition shadow-3xs ${
                              theme === 'white' 
                                ? 'bg-white border-slate-100 group-hover:border-slate-300 text-slate-600 group-hover:text-blue-600' 
                                : 'bg-slate-950/40 border-white/[0.05] group-hover:border-white/10 text-slate-400 group-hover:text-indigo-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold tracking-tight ${styles.textHeading}`}>{item.label}</p>
                              <p className={`text-[10px] truncate mt-0.5 ${styles.textSecondary}`}>{item.desc}</p>
                            </div>
                            <Plus className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition ${theme === 'white' ? 'text-slate-300 group-hover:text-blue-500' : 'text-slate-600 group-hover:text-indigo-400'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* B. CENTER CANVAS WORKSPACE */}
            <main className={`flex-1 overflow-y-auto px-6 py-10 flex flex-col justify-between transition-colors duration-300 ${
              theme === 'white' ? 'bg-slate-100/60' : 'bg-transparent'
            }`}>
              
              <div className="max-w-2xl w-full mx-auto space-y-6">
                
                {/* Visual Canvas Layout */}
                <div className={`rounded-2xl border shadow-sm p-8 transition-colors duration-300 ${styles.card} ${styles.border}`}>
                  <div className={`mb-6 pb-6 border-b ${theme === 'white' ? 'border-slate-150' : 'border-white/5'}`}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`text-2xl font-bold bg-transparent border-b border-transparent focus:ring-1 focus:ring-indigo-500/30 outline-none w-full py-0.5 transition ${styles.textHeading}`}
                      placeholder="Enter Form Title"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`text-xs bg-transparent outline-none w-full mt-2 resize-none border-b border-transparent focus:ring-1 focus:ring-indigo-500/30 transition ${styles.textSecondary}`}
                      placeholder="Add a detailed description or guidance instructions..."
                      rows={2}
                    />
                  </div>

                  {/* Active List of drag-and-drop sortable items */}
                  {fields.length === 0 ? (
                    /* EMPTY CANVAS STATE */
                    <div className={`py-24 border border-dashed rounded-xl flex flex-col items-center justify-center text-center px-4 ${
                      theme === 'white' ? 'border-slate-200 bg-slate-50/50' : 'border-white/10 bg-white/[0.01]'
                    }`}>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                        <Sparkle className="w-6 h-6 stroke-[2]" />
                      </div>
                      <h4 className={`text-sm font-bold ${styles.textHeading}`}>No Fields Added Yet</h4>
                      <p className={`text-xs mt-1 max-w-sm leading-relaxed ${styles.textSecondary}`}>
                        Start assembling the ultimate layout by clicking any element from the left field library.
                      </p>
                      
                      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
                        {["text", "email", "select", "rating"].map((t) => (
                          <button
                            key={t}
                            onClick={() => addField(t as any)}
                            className={`px-2.5 py-1 text-[10px] font-bold border rounded-lg transition shadow-2xs cursor-pointer ${
                              theme === 'white' 
                                ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-blue-600' 
                                : 'bg-slate-900 text-slate-300 border-white/5 hover:border-white/10 hover:text-indigo-400'
                            }`}
                          >
                            + {t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {fields.map((field, index) => {
                            const isSelected = selectedIdx === index;
                            return (
                              <SortableFieldCard
                                key={field.id}
                                field={field}
                                index={index}
                                isSelected={isSelected}
                                onSelect={() => setSelectedIdx(index)}
                                onDelete={(e) => handleDeleteField(index, e)}
                                onDuplicate={(e) => handleDuplicateField(index, e)}
                                onUpdateLabel={(val) => updateFieldProp(index, "label", val)}
                                onUpdatePlaceholder={(val) => updateFieldProp(index, "placeholder", val)}
                                onToggleRequired={() => updateFieldProp(index, "is_required", !field.is_required)}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>

              {/* Status footer inside canvas */}
              <div className={`text-center text-[10px] font-mono mt-8 border-t pt-4 max-w-2xl w-full mx-auto flex items-center justify-between ${
                theme === 'white' ? 'border-slate-200/50 text-slate-400' : 'border-white/5 text-slate-500'
              }`}>
                <span>Schema contains {fields.length} blocks</span>
                <span>Press live preview to run validators</span>
              </div>
            </main>

            {/* C. RIGHT PROPERTIES PANEL */}
            <aside className={`w-80 border-l flex flex-col z-10 shrink-0 transition-colors duration-300 ${styles.card} ${styles.border}`}>
              <div className={`p-4 border-b flex items-center justify-between ${
                theme === 'white' ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-slate-900/40'
              }`}>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties Panel</span>
                {fields.length > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    theme === 'white' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    Field {selectedIdx + 1} of {fields.length}
                  </span>
                )}
              </div>

              {/* Check if no fields are active to show settings placeholder */}
              {fields.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Settings className="w-10 h-10 text-slate-300 mb-2 animate-spin-slow" />
                  <p className="text-xs font-semibold">Workspace Properties</p>
                  <p className="text-[10px] mt-1">Configure individual element validations, settings, and options by selecting any card.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Property Tabs Selector */}
                  <div className="flex border-b border-slate-100 p-2 bg-slate-50/20">
                    <button
                      onClick={() => setActiveTab("general")}
                      className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        activeTab === "general"
                          ? "bg-white text-blue-600 shadow-3xs border border-slate-100"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab("validation")}
                      className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        activeTab === "validation"
                          ? "bg-white text-blue-600 shadow-3xs border border-slate-100"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Validation
                    </button>
                    {["select", "radio", "checkbox"].includes(fields[selectedIdx]?.field_type) && (
                      <button
                        onClick={() => setActiveTab("choices")}
                        className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                          activeTab === "choices"
                            ? "bg-white text-blue-600 shadow-3xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Choices
                      </button>
                    )}
                    {!["divider", "heading", "paragraph"].includes(fields[selectedIdx]?.field_type) && (
                      <button
                        onClick={() => setActiveTab("logic")}
                        className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                          activeTab === "logic"
                            ? "bg-white text-blue-600 shadow-3xs border border-slate-100"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Logic
                      </button>
                    )}
                  </div>

                  {/* Tabs Scrollable Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    
                    {/* 1. GENERAL TAB SETTINGS */}
                    {activeTab === "general" && (
                      <div className="space-y-4">
                        
                        {/* Title Label */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Label</label>
                          <input
                            type="text"
                            value={fields[selectedIdx].label}
                            onChange={(e) => updateFieldProp(selectedIdx, "label", e.target.value)}
                            onBlur={commitFieldProps}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                            placeholder="Enter display label name..."
                          />
                        </div>

                        {/* Description/Help Text */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Help/Description Text</label>
                          <textarea
                            value={fields[selectedIdx].description || ""}
                            onChange={(e) => updateFieldProp(selectedIdx, "description", e.target.value)}
                            onBlur={commitFieldProps}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition resize-none"
                            placeholder="Provide hints or instructional captions..."
                            rows={3}
                          />
                        </div>

                        {/* Placeholder */}
                        {!["divider", "heading", "paragraph"].includes(fields[selectedIdx].field_type) && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placeholder Text</label>
                            <input
                              type="text"
                              value={fields[selectedIdx].placeholder || ""}
                              onChange={(e) => updateFieldProp(selectedIdx, "placeholder", e.target.value)}
                              onBlur={commitFieldProps}
                              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                              placeholder="e.g. Please enter a value..."
                            />
                          </div>
                        )}

                        {/* Default Value */}
                        {!["divider", "heading", "paragraph", "file", "rating"].includes(fields[selectedIdx].field_type) && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Value</label>
                            <input
                              type="text"
                              value={fields[selectedIdx].default_value || ""}
                              onChange={(e) => updateFieldProp(selectedIdx, "default_value", e.target.value)}
                              onBlur={commitFieldProps}
                              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
                              placeholder="Preset prefilled input values..."
                            />
                          </div>
                        )}

                        {/* System slug Column Name */}
                        <div className="space-y-1 border-t border-slate-100 pt-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Key (Database column)</label>
                          <input
                            type="text"
                            value={fields[selectedIdx].name}
                            onChange={(e) => updateFieldProp(selectedIdx, "name", e.target.value)}
                            onBlur={commitFieldProps}
                            className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 text-slate-500"
                          />
                          <p className="text-[9px] text-slate-400 leading-normal">
                            Unique alphanumeric variable key used inside response payloads.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 2. VALIDATION TAB SETTINGS */}
                    {activeTab === "validation" && (
                      <div className="space-y-4">
                        
                        {/* Enforce Required Toggle */}
                        {!["divider", "heading", "paragraph"].includes(fields[selectedIdx].field_type) && (
                          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                            <div>
                              <p className="text-xs font-bold text-slate-700">Required Field</p>
                              <p className="text-[10px] text-slate-400">Force non-empty submissions</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={fields[selectedIdx].is_required}
                              onChange={(e) => {
                                updateFieldProp(selectedIdx, "is_required", e.target.checked);
                                commitFieldProps();
                              }}
                              className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Numerical/Length Limits */}
                        {!["divider", "heading", "paragraph", "checkbox", "radio", "select", "date", "rating", "file", "address"].includes(fields[selectedIdx].field_type) && (
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {fields[selectedIdx].field_type === "number" ? "Min Number" : "Min Length"}
                              </label>
                              <input
                                type="number"
                                value={fields[selectedIdx].validation_min ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                                  updateFieldProp(selectedIdx, "validation_min", val);
                                }}
                                onBlur={commitFieldProps}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                placeholder="None"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {fields[selectedIdx].field_type === "number" ? "Max Number" : "Max Length"}
                              </label>
                              <input
                                type="number"
                                value={fields[selectedIdx].validation_max ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                                  updateFieldProp(selectedIdx, "validation_max", val);
                                }}
                                onBlur={commitFieldProps}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                placeholder="None"
                              />
                            </div>
                          </div>
                        )}

                        {/* Regex validation pattern presets */}
                        {["text", "textarea", "email"].includes(fields[selectedIdx].field_type) && (
                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Validation Pattern (Regex)</label>
                              <select
                                value={fields[selectedIdx].validation_regex || ""}
                                onChange={(e) => {
                                  updateFieldProp(selectedIdx, "validation_regex", e.target.value);
                                  commitFieldProps();
                                }}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                              >
                                {REGEX_PRESETS.map((p, idx) => (
                                  <option key={idx} value={p.value}>
                                    {p.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {fields[selectedIdx].validation_regex && (
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold text-slate-400">Raw Pattern String</label>
                                <input
                                  type="text"
                                  value={fields[selectedIdx].validation_regex || ""}
                                  onChange={(e) => updateFieldProp(selectedIdx, "validation_regex", e.target.value)}
                                  onBlur={commitFieldProps}
                                  className="w-full text-xs font-mono px-3 py-1.5 border border-slate-200 rounded-lg outline-none bg-slate-50 text-slate-600"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. CHOICE OPTIONS TAB SETTINGS */}
                    {activeTab === "choices" && ["select", "radio", "checkbox"].includes(fields[selectedIdx]?.field_type) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Option Listings</span>
                          <button
                            onClick={() => handleAddOption(selectedIdx)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Choice</span>
                          </button>
                        </div>

                        {/* Option edit list container */}
                        <div className="space-y-2">
                          {fields[selectedIdx].options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2 group/opt bg-slate-50 p-2 rounded-xl border border-slate-150">
                              <div className="cursor-grab text-slate-400 hover:text-slate-600">
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>
                              <input
                                type="text"
                                value={opt.label}
                                onChange={(e) => handleUpdateOption(selectedIdx, oIdx, "label", e.target.value)}
                                onBlur={commitFieldProps}
                                className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                                placeholder="Display Label"
                              />
                              <button
                                onClick={() => handleRemoveOption(selectedIdx, oIdx)}
                                disabled={fields[selectedIdx].options.length <= 1}
                                className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. LOGIC RULES TAB SETTINGS */}
                    {activeTab === "logic" && !["divider", "heading", "paragraph"].includes(fields[selectedIdx]?.field_type) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conditional Logic Rules</span>
                          <button
                            onClick={handleAddLogicRule}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Rule</span>
                          </button>
                        </div>

                        {(!fields[selectedIdx].conditional_rules || fields[selectedIdx].conditional_rules.length === 0) ? (
                          <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-slate-150">
                            <p className="text-xs font-semibold text-slate-600">No Rules Configured</p>
                            <p className="text-[10px] text-slate-400 mt-1">This field is always visible and required based on standard tab configuration rules.</p>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {fields[selectedIdx].conditional_rules.map((rule, rIdx) => (
                              <div key={rIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative">
                                <button
                                  onClick={() => handleRemoveLogicRule(rIdx)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Select Action</label>
                                  <select
                                    value={rule.action}
                                    onChange={(e) => handleUpdateLogicRule(rIdx, "action", e.target.value)}
                                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
                                  >
                                    <option value="show">Show Field</option>
                                    <option value="hide">Hide Field</option>
                                    <option value="require">Make Required</option>
                                  </select>
                                </div>

                                <div className="text-[10px] font-bold text-slate-500 italic pl-1">IF</div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dependent Field</label>
                                  <select
                                    value={rule.dependent_field}
                                    onChange={(e) => handleUpdateLogicRule(rIdx, "dependent_field", e.target.value)}
                                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
                                  >
                                    <option value="">Select a field...</option>
                                    {fields.filter((f, idx) => idx !== selectedIdx && !["heading", "paragraph", "divider"].includes(f.field_type)).map((f) => (
                                      <option key={f.id} value={f.name}>
                                        {f.label} ({f.name})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Operator</label>
                                  <select
                                    value={rule.operator}
                                    onChange={(e) => handleUpdateLogicRule(rIdx, "operator", e.target.value)}
                                    className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg outline-none bg-white cursor-pointer"
                                  >
                                    <option value="equals">Equals</option>
                                    <option value="not_equals">Does Not Equal</option>
                                    <option value="greater_than">Is Greater Than</option>
                                    <option value="less_than">Is Less Than</option>
                                    <option value="contains">Contains</option>
                                    <option value="is_empty">Is Empty</option>
                                    <option value="is_not_empty">Is Not Empty</option>
                                  </select>
                                </div>

                                {!["is_empty", "is_not_empty"].includes(rule.operator) && (
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Comparison Value</label>
                                    <input
                                      type="text"
                                      value={rule.value}
                                      onChange={(e) => handleUpdateLogicRule(rIdx, "value", e.target.value)}
                                      onBlur={commitFieldProps}
                                      className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg outline-none bg-white"
                                      placeholder="Comparison target..."
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

// Draggable Sortable Item visual Wrapper
interface SortableFieldCardProps {
  key?: string;
  field: FieldDraft;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onUpdateLabel: (val: string) => void;
  onUpdatePlaceholder?: (val: string) => void;
  onToggleRequired?: () => void;
}

function SortableFieldCard({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdateLabel,
  onUpdatePlaceholder,
  onToggleRequired,
}: SortableFieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text": return Type;
      case "textarea": return AlignLeft;
      case "email": return Mail;
      case "number": return Hash;
      case "select": return ChevronDown;
      case "checkbox": return CheckSquare;
      case "radio": return CircleDot;
      case "date": return Calendar;
      case "time": return Clock;
      case "switch": return ToggleLeft;
      case "rating": return Star;
      case "file": return UploadCloud;
      case "phone": return Phone;
      case "address": return MapPin;
      case "divider": return Minus;
      case "heading": return HeadingIcon;
      case "paragraph": return TextQuote;
      default: return Type;
    }
  };

  const Icon = getFieldIcon(field.field_type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      className={`group relative flex flex-col rounded-xl border p-4 bg-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
        isDragging ? "opacity-40" : ""
      } ${
        isSelected
          ? "border-blue-600 ring-2 ring-blue-600/10"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      {/* Context Menu Modal Portal */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-1.5 w-44 flex flex-col font-sans"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(e);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-white transition flex items-center justify-between cursor-pointer border-none bg-transparent"
            >
              <span>Duplicate Field</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleRequired?.();
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-white transition flex items-center justify-between cursor-pointer border-none bg-transparent"
            >
              <span>{field.is_required ? "Make Optional" : "Make Required"}</span>
            </button>
            <hr className="border-t border-slate-800 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-950/40 hover:text-rose-400 text-rose-300 transition flex items-center justify-between cursor-pointer border-none bg-transparent"
            >
              <span>Delete Field</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Grab re-ordering Handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50 transition"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Index Icon Box */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/60"
        }`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Info detail and inputs mockup */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdateLabel(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50 outline-none px-1 py-0.5 rounded transition w-full"
              placeholder="Untitled Element"
            />
            {field.is_required && (
              <span className="text-rose-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-rose-50 select-none animate-pulse" title="Required">
                *
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              {field.description}
            </p>
          )}

          {/* Render simplified dummy UI representing the control */}
          <div className="mt-3">
            {field.field_type === "divider" && (
              <hr className="border-t border-slate-200 my-4" />
            )}

            {field.field_type === "heading" && (
              <div className="border border-slate-100 bg-slate-50/50 p-2.5 rounded-lg text-xs text-slate-400 text-center font-bold">
                Section Title Display Panel
              </div>
            )}

            {field.field_type === "paragraph" && (
              <div className="border border-slate-100 bg-slate-50/50 p-2.5 rounded-lg text-[10px] text-slate-400 text-center leading-normal italic">
                Informative Paragraph Block Content
              </div>
            )}

            {["text", "email", "phone"].includes(field.field_type) && (
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdatePlaceholder?.(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Type here to edit placeholder..."
                className="w-full text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition"
              />
            )}

            {field.field_type === "textarea" && (
              <textarea
                value={field.placeholder || ""}
                onChange={(e) => onUpdatePlaceholder?.(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Type here to edit placeholder..."
                rows={2}
                className="w-full text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition resize-none"
              />
            )}

            {field.field_type === "number" && (
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdatePlaceholder?.(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="0.00 (Prefilled default)"
                className="w-2/5 text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition"
              />
            )}

            {field.field_type === "date" && (
              <div className="w-3/5 flex items-center justify-between text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-slate-300">
                <span>Select Date...</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}

            {field.field_type === "time" && (
              <div className="w-2/5 flex items-center justify-between text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-slate-300">
                <span>Select Time...</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}

            {field.field_type === "switch" && (
              <div className="flex items-center gap-2 text-[10px] text-slate-550 pointer-events-none select-none">
                <ToggleLeft className="w-7 h-7 text-slate-300" />
                <span>Default inactive toggle switch</span>
              </div>
            )}

            {field.field_type === "select" && (
              <div className="w-full flex items-center justify-between text-[10px] bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-slate-400">
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdatePlaceholder?.(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Choose option..."
                  className="bg-transparent border-none outline-none w-full text-[10px] text-slate-700"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}

            {["radio", "checkbox"].includes(field.field_type) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {field.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <div className={`w-3 h-3 border border-slate-300 ${field.field_type === "radio" ? "rounded-full" : "rounded"}`} />
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            )}

            {field.field_type === "rating" && (
              <div className="flex items-center gap-1 pointer-events-none select-none">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4.5 h-4.5 text-slate-250" />
                ))}
              </div>
            )}

            {field.field_type === "file" && (
              <div className="border border-dashed border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center text-[9px] text-slate-400 bg-slate-50/50 pointer-events-none select-none">
                <UploadCloud className="w-5 h-5 mb-1 text-slate-300" />
                <span>Drag to attach files</span>
              </div>
            )}

            {field.field_type === "address" && (
              <div className="grid grid-cols-3 gap-2 pointer-events-none select-none">
                <div className="col-span-3 h-6 bg-slate-50 border border-slate-200 rounded-md" />
                <div className="col-span-2 h-6 bg-slate-50 border border-slate-200 rounded-md" />
                <div className="col-span-1 h-6 bg-slate-50 border border-slate-200 rounded-md" />
              </div>
            )}
          </div>
        </div>

        {/* Hover Action Controls */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(e);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Duplicate Field"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            title="Delete Field"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function evaluateConditionalRule(
  rule: { dependent_field: string; operator: string; value: string; action: string },
  formValues: Record<string, any>
): { hide: boolean; make_required?: boolean } {
  const depVal = formValues[rule.dependent_field];
  const compVal = rule.value;
  let match = false;

  switch (rule.operator) {
    case "equals":
      match = String(depVal ?? "") === String(compVal);
      break;
    case "not_equals":
      match = String(depVal ?? "") !== String(compVal);
      break;
    case "greater_than":
      match = Number(depVal || 0) > Number(compVal || 0);
      break;
    case "less_than":
      match = Number(depVal || 0) < Number(compVal || 0);
      break;
    case "contains":
      match = String(depVal ?? "").toLowerCase().includes(String(compVal).toLowerCase());
      break;
    case "is_empty":
      match = depVal === undefined || depVal === null || depVal === "" || (Array.isArray(depVal) && depVal.length === 0) || (typeof depVal === "object" && Object.keys(depVal).filter(k => depVal[k]).length === 0);
      break;
    case "is_not_empty":
      match = !(depVal === undefined || depVal === null || depVal === "" || (Array.isArray(depVal) && depVal.length === 0) || (typeof depVal === "object" && Object.keys(depVal).filter(k => depVal[k]).length === 0));
      break;
    default:
      break;
  }

  if (match) {
    if (rule.action === "hide") {
      return { hide: true };
    }
    if (rule.action === "show") {
      return { hide: false };
    }
    if (rule.action === "require") {
      return { hide: false, make_required: true };
    }
  } else {
    if (rule.action === "show") {
      return { hide: true };
    }
  }

  return { hide: false };
}

export function evaluateFieldVisibilityAndRequirement(
  field: any,
  formValues: Record<string, any>
): { isHidden: boolean; isRequired: boolean } {
  let isHidden = false;
  let isRequired = !!field.is_required;

  const rules = field.conditional_rules || field.validation_rules?.conditional_rules || [];

  for (const rule of rules) {
    if (!rule.dependent_field) continue;
    const res = evaluateConditionalRule(rule, formValues);
    if (res.hide) {
      isHidden = true;
    }
    if (res.make_required) {
      isRequired = true;
    }
  }

  return { isHidden, isRequired };
}
