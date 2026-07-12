import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  HelpCircle,
  AlertCircle,
  Star,
  UploadCloud,
  X
} from "lucide-react";

export default function FormView() {
  const { theme, styles } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formVersionId = Number(id);

  // Responses form state dictionary
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formFiles, setFormFiles] = useState<Record<string, { name: string; size: number }[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (fieldName: string, files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).map((f) => ({ name: f.name, size: f.size }));
    setFormFiles((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ...list]
    }));
  };

  const removeFileAttachment = (fieldName: string, idx: number) => {
    setFormFiles((prev) => {
      const copy = [...(prev[fieldName] || [])];
      copy.splice(idx, 1);
      return { ...prev, [fieldName]: copy };
    });
  };

  const handleStarClick = (fieldName: string, rating: number) => {
    handleInputChange(fieldName, rating);
  };

  // 1. Fetch all forms to find the version matching formVersionId
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: api.getForms,
  });

  // Search forms for the specific form version
  let targetVersion: any = null;
  let targetForm: any = null;

  for (const form of forms) {
    const v = form.versions?.find(ver => ver.id === formVersionId);
    if (v) {
      targetVersion = v;
      targetForm = form;
      break;
    }
  }

  // Submission mutation
  const submitMutation = useMutation({
    mutationFn: (submittedData: Record<string, any>) =>
      api.submitForm(formVersionId, submittedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", targetForm?.id] });
      setSubmitted(true);
      setValidationError(null);
    },
    onError: (err: any) => {
      setValidationError(err.response?.data?.detail || "An error occurred during submission.");
    }
  });

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Dynamic front-end validation
    if (!targetVersion) return;

    for (const field of targetVersion.fields) {
      const { isHidden, isRequired } = evaluateFieldVisibilityAndRequirement(field, formData);
      if (isHidden) {
        continue;
      }

      const val = formData[field.name];
      if (isRequired) {
        if (field.field_type === "file") {
          const attachments = formFiles[field.name] || [];
          if (attachments.length === 0) {
            setValidationError(`"${field.label}" file attachment is required.`);
            return;
          }
        } else if (field.field_type === "checkbox") {
          // If checkbox has multiple options
          if (field.options && field.options.length > 0) {
            const isAnyChecked = Array.isArray(val) && val.length > 0;
            if (!isAnyChecked) {
              setValidationError(`At least one option must be selected for "${field.label}".`);
              return;
            }
          } else {
            // Single checkbox
            if (!val) {
              setValidationError(`"${field.label}" must be checked.`);
              return;
            }
          }
        } else if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          setValidationError(`"${field.label}" is required.`);
          return;
        }
      }
    }

    submitMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading form instance...</p>
      </div>
    );
  }

  if (!targetVersion || !targetForm) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Form Version Not Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              The link appears to be invalid or the requested form workflow version does not exist.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${styles.bgPage} ${styles.textPrimary}`}>
      {/* Back button to builder */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => navigate("/")}
          className={`inline-flex items-center space-x-1.5 text-sm font-semibold transition ${
            theme === 'white' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Preview Form</span>
        </button>
      </div>

      <div className={`max-w-2xl mx-auto rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${styles.card} ${styles.border}`}>
        {/* Banner */}
        <div className={`p-6 text-white relative ${
          theme === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
          theme === 'blue' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
          theme === 'white' ? 'bg-slate-900' : 'bg-slate-950 border-b border-white/5'
        }`}>
          <div className="absolute top-4 right-4 bg-blue-500/10 border border-blue-500/20 rounded px-2.5 py-0.5 flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-300 font-bold">Public Demo Active</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white mb-2">{targetForm.title}</h1>
          {targetForm.description && (
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">{targetForm.description}</p>
          )}
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-6 text-center space-y-6">
            <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-sm border ${
              theme === 'white' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className={`font-bold text-xl ${styles.textHeading}`}>Submission Received</h2>
              <p className={`text-sm max-w-sm mx-auto ${styles.textSecondary}`}>
                Thank you! Your responses have been validated against our database schema constraints and recorded successfully.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setFormData({});
                  setSubmitted(false);
                }}
                className={`px-4 py-2 font-bold rounded-md text-xs transition ${
                  theme === 'white' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Submit another response
              </button>
              <button
                onClick={() => navigate("/")}
                className={`px-4 py-2 text-white font-bold rounded-md text-xs transition shadow-sm ${
                  theme === 'white' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                Go to Workspace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Display validation errors if any */}
            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-4">
              {targetVersion.fields.map((field: any) => {
                const { isHidden, isRequired } = evaluateFieldVisibilityAndRequirement(field, formData);
                if (isHidden) {
                  return null;
                }

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
                    <label className="text-xs font-bold text-slate-700 flex items-center">
                      <span>{field.label}</span>
                      {isRequired && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-xs text-slate-400">{field.description}</p>
                    )}

                    {field.field_type === "text" && (
                      <input
                        type="text"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "Enter text..."}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "textarea" && (
                      <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "Enter details..."}
                        required={isRequired}
                        rows={4}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "email" && (
                      <input
                        type="email"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "e.g. user@domain.com"}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "number" && (
                      <input
                        type="number"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "0"}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "phone" && (
                      <input
                        type="tel"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder || "e.g. +1 (555) 019-2834"}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "date" && (
                      <input
                        type="date"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "time" && (
                      <input
                        type="time"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                      />
                    )}

                    {field.field_type === "select" && (
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={isRequired}
                        className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md bg-white transition cursor-pointer"
                      >
                        <option value="">{field.placeholder || "Select an option..."}</option>
                        {field.options?.map((opt: any, oIdx: number) => (
                          <option key={oIdx} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}

                    {field.field_type === "radio" && (
                      <div className="space-y-2 pt-1">
                        {field.options?.map((opt: any, oIdx: number) => (
                          <label key={oIdx} className="flex items-center space-x-3.5 text-sm text-slate-600 cursor-pointer">
                            <input
                              type="radio"
                              name={field.name}
                              value={opt.value}
                              checked={formData[field.name] === opt.value}
                              onChange={() => handleInputChange(field.name, opt.value)}
                              required={isRequired}
                              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {field.field_type === "checkbox" && (
                      <div className="space-y-2 pt-1">
                        {field.options?.map((opt: any, oIdx: number) => {
                          const currentSelections = formData[field.name] || [];
                          const isChecked = currentSelections.includes(opt.value);
                          
                          const handleCheckboxChange = () => {
                            let updatedSelections = [...currentSelections];
                            if (isChecked) {
                              updatedSelections = updatedSelections.filter(v => v !== opt.value);
                            } else {
                              updatedSelections.push(opt.value);
                            }
                            handleInputChange(field.name, updatedSelections);
                          };

                          return (
                            <label key={oIdx} className="flex items-center space-x-3.5 text-sm text-slate-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                        {/* Single boolean checkbox if no options are declared */}
                        {(!field.options || field.options.length === 0) && (
                          <label className="flex items-center space-x-3.5 text-sm text-slate-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData[field.name]}
                                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                                required={isRequired}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span>Confirm checkbox condition</span>
                          </label>
                        )}
                      </div>
                    )}

                    {field.field_type === "switch" && (
                      <div className="pt-1.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleInputChange(field.name, !formData[field.name])}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                            formData[field.name] ? "bg-blue-600" : "bg-slate-200"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              formData[field.name] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs text-slate-500">
                          {formData[field.name] ? "Yes" : "No"}
                        </span>
                      </div>
                    )}

                    {field.field_type === "rating" && (
                      <div className="flex items-center gap-1.5 pt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isSelected = (formData[field.name] || 0) >= star;
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
                                    : "text-slate-250 hover:text-amber-300"
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

                        {formFiles[field.name] && formFiles[field.name].length > 0 && (
                          <div className="space-y-1">
                            {formFiles[field.name].map((file, fileIdx) => (
                              <div key={fileIdx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                                <span className="truncate max-w-[80%] font-semibold text-slate-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFileAttachment(field.name, fileIdx)}
                                  className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
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
                            value={formData[`${field.name}_street`] || ""}
                            onChange={(e) => handleInputChange(`${field.name}_street`, e.target.value)}
                            className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={formData[`${field.name}_city`] || ""}
                            onChange={(e) => handleInputChange(`${field.name}_city`, e.target.value)}
                            className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="State"
                            value={formData[`${field.name}_state`] || ""}
                            onChange={(e) => handleInputChange(`${field.name}_state`, e.target.value)}
                            className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            placeholder="ZIP"
                            value={formData[`${field.name}_zip`] || ""}
                            onChange={(e) => handleInputChange(`${field.name}_zip`, e.target.value)}
                            className="w-full text-sm border border-slate-200 focus:border-blue-600 outline-none p-2 rounded-md transition bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className={`w-full py-3 text-white rounded-lg text-sm font-bold transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer ${
                theme === 'white' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{submitMutation.isPending ? "Submitting secure response..." : "Submit Form Response"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function evaluateConditionalRule(
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

function evaluateFieldVisibilityAndRequirement(
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
