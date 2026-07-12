import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Form } from "../types";
import { useTheme } from "../context/ThemeContext";
import { 
  Database, 
  Layers, 
  Download, 
  Trash2, 
  Clock, 
  FileSpreadsheet, 
  ListFilter,
  BarChart3,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Responses() {
  const { theme, styles } = useTheme();
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch all forms (to populate the selection dropdown)
  const { data: forms = [], isLoading: formsLoading } = useQuery<Form[], Error>({
    queryKey: ["forms"],
    queryFn: api.getForms,
  });

  // Auto-set the first form as default when forms are loaded
  useEffect(() => {
    if (forms.length > 0 && selectedFormId === null) {
      setSelectedFormId(forms[0].id);
    }
  }, [forms, selectedFormId]);

  // 2. Fetch submissions for the selected form
  const { data: submissions = [], isLoading: subsLoading } = useQuery({
    queryKey: ["submissions", selectedFormId],
    queryFn: () => selectedFormId ? api.getFormSubmissions(selectedFormId) : Promise.resolve([]),
    enabled: selectedFormId !== null,
  });

  const selectedForm = forms.find(f => f.id === selectedFormId);
  const latestVersion = selectedForm?.versions && selectedForm.versions.length > 0
    ? [...selectedForm.versions].sort((a, b) => b.version_number - a.version_number)[0]
    : null;

  // Extract dynamic headers from the form version fields
  const tableHeaders = latestVersion?.fields || [];

  // Filter submissions by search query
  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const contentString = JSON.stringify(sub.submitted_data).toLowerCase();
    return contentString.includes(searchQuery.toLowerCase());
  });

  // Export CSV function
  const handleExportCSV = () => {
    if (tableHeaders.length === 0 || submissions.length === 0) return;

    // Create CSV content
    const headerRow = ["Submission Date", ...tableHeaders.map(h => h.label)].join(",");
    const dataRows = submissions.map(sub => {
      const dateStr = new Date(sub.created_at).toLocaleString();
      const valueCols = tableHeaders.map(header => {
        const val = sub.submitted_data[header.name];
        // Escape quotes
        return `"${String(val || "").replace(/"/g, '""')}"`;
      });
      return [dateStr, ...valueCols].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headerRow, ...dataRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedForm?.title || "responses"}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 ${styles.textPrimary}`}>
      {/* Header */}
      <div>
        <h1 className={`font-bold text-2xl tracking-tight ${styles.textHeading}`}>
          Collected Data & Submissions
        </h1>
        <p className={`text-sm mt-1 ${styles.textSecondary}`}>
          Monitor incoming submissions, filter by schema versions, and export structured datasets.
        </p>
      </div>

      {/* Control Bar: Select Form dropdown, Search, and Export */}
      <div className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between ${styles.card} ${styles.border}`}>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Form Selector Dropdown */}
          <div className="space-y-1 w-full sm:w-64">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${styles.textSecondary}`}>
              <ListFilter className="w-3.5 h-3.5" />
              <span>Target Form Schema</span>
            </label>
            <select
              value={selectedFormId || ""}
              onChange={(e) => setSelectedFormId(Number(e.target.value))}
              className={`w-full text-sm border outline-none p-2.5 rounded-md transition cursor-pointer ${
                theme === "white" 
                  ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500" 
                  : theme === "blue" 
                  ? "bg-blue-950/20 border-blue-200 text-slate-900 focus:border-blue-500" 
                  : theme === "orange" 
                  ? "bg-orange-950/10 border-orange-200 text-slate-900 focus:border-orange-500" 
                  : "bg-slate-950/60 border-white/[0.08] text-white focus:border-indigo-500"
              }`}
            >
              {formsLoading ? (
                <option className={styles.card}>Loading schemas...</option>
              ) : forms.length === 0 ? (
                <option className={styles.card}>No schemas found</option>
              ) : (
                forms.map(form => (
                  <option key={form.id} value={form.id} className={styles.card}>{form.title}</option>
                ))
              )}
            </select>
          </div>

          {/* Search bar inside submissions */}
          {selectedFormId && (
            <div className="space-y-1 w-full sm:w-64">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${styles.textSecondary}`}>
                <Search className="w-3.5 h-3.5" />
                <span>Filter Records</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search values..."
                className={`w-full text-sm border outline-none p-2.5 rounded-md transition focus:ring-1 focus:ring-indigo-500/30 ${
                  theme === "white" 
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500" 
                    : theme === "blue" 
                    ? "bg-blue-950/20 border-blue-200 text-slate-900 focus:border-blue-500" 
                    : theme === "orange" 
                    ? "bg-orange-950/10 border-orange-200 text-slate-900 focus:border-orange-500" 
                    : "bg-slate-950/60 border-white/[0.08] text-white focus:border-indigo-500"
                }`}
              />
            </div>
          )}
        </div>

        {/* Export Button */}
        {selectedFormId && submissions.length > 0 && (
          <button
            onClick={handleExportCSV}
            className={`w-full md:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-white rounded-md text-sm font-bold transition shadow-sm cursor-pointer ${
              theme === 'white' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        )}
      </div>

      {/* Response Grid Card */}
      {!selectedFormId ? (
        <div className={`p-12 text-center max-w-md mx-auto space-y-3 rounded-xl border shadow-sm ${styles.card} ${styles.border}`}>
          <Database className={`w-10 h-10 mx-auto ${styles.textSecondary}`} />
          <h3 className={`font-bold text-lg ${styles.textHeading}`}>No forms selected</h3>
          <p className={`text-sm ${styles.textSecondary}`}>
            Please register a dynamic form under the Form Builder tab first to view incoming responses.
          </p>
        </div>
      ) : subsLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-2">
          <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${
            theme === 'white' ? 'border-slate-900' : 'border-indigo-500'
          }`}></div>
          <p className={`text-xs animate-pulse font-mono ${styles.textSecondary}`}>Querying submissions database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Metrics of chosen form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`p-5 rounded-xl border shadow-sm ${styles.card} ${styles.border}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>Form Title</p>
              <p className={`text-base font-extrabold mt-1 truncate ${styles.textHeading}`}>{selectedForm?.title}</p>
            </div>
            <div className={`p-5 rounded-xl border shadow-sm ${styles.card} ${styles.border}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>Active Schema Version</p>
              <p className={`text-base font-extrabold mt-1 ${styles.textHeading}`}>
                v{latestVersion?.version_number || "None"}
              </p>
            </div>
            <div className={`p-5 rounded-xl border shadow-sm ${styles.card} ${styles.border}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>Responses Received</p>
              <p className="text-base font-extrabold text-emerald-600 mt-1 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className={theme === 'white' ? 'text-emerald-600' : 'text-emerald-400'}>{submissions.length} total</span>
              </p>
            </div>
          </div>

          {/* Submissions Datatable */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${styles.card} ${styles.border}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${styles.border}`}>
              <h3 className={`font-bold text-base ${styles.textHeading}`}>Submission Logs</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                theme === 'white' 
                  ? 'bg-slate-50 border-slate-200 text-slate-500' 
                  : 'bg-white/5 border-white/10 text-indigo-400'
              }`}>
                Pydantic JSON Serialization Active
              </span>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="px-6 py-12 text-center max-w-sm mx-auto space-y-3">
                <FileSpreadsheet className={`w-10 h-10 mx-auto ${styles.textSecondary}`} />
                <h3 className={`font-bold text-base ${styles.textHeading}`}>No responses recorded</h3>
                <p className={`text-xs ${styles.textSecondary}`}>
                  {searchQuery 
                    ? "No records match your search filter." 
                    : "No submission data has been received for this form yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                  <thead className={theme === 'white' ? 'bg-slate-50/50' : 'bg-slate-950/50'}>
                    <tr>
                      <th scope="col" className={`px-5 py-3 text-left text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>
                        Date & Time
                      </th>
                      {tableHeaders.map((header) => (
                        <th
                          key={header.name}
                          scope="col"
                          className={`px-5 py-3 text-left text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'white' ? 'divide-slate-200 bg-white' : 'divide-white/5 bg-transparent'}`}>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className={`transition duration-150 ${
                        theme === 'white' ? 'hover:bg-slate-50/40' : 'hover:bg-white/[0.02]'
                      }`}>
                        <td className="px-5 py-3 text-xs font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <Clock className={`w-3.5 h-3.5 ${styles.textSecondary}`} />
                            <span className={styles.textPrimary}>{new Date(sub.created_at).toLocaleString()}</span>
                          </div>
                        </td>
                        {tableHeaders.map((header) => {
                          const val = sub.submitted_data[header.name];
                          return (
                            <td key={header.name} className={`px-5 py-3 text-xs font-medium ${styles.textPrimary}`}>
                              {val === true ? (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  theme === 'white' 
                                    ? 'text-emerald-600 bg-emerald-50 border-emerald-150' 
                                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                }`}>
                                  True (Checked)
                                </span>
                              ) : val === false ? (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                                  theme === 'white' 
                                    ? 'text-slate-500 bg-slate-50 border-slate-150' 
                                    : 'text-slate-500 bg-slate-900/50 border-white/[0.05]'
                                }`}>
                                  False (Unchecked)
                                </span>
                              ) : val ? (
                                String(val)
                              ) : (
                                <span className="text-slate-400 italic">Empty</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
