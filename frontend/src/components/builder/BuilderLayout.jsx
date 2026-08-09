import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  LayoutTemplate,
  Eye,
  Rocket,
  Archive,
  History,
  Pencil,
  Wand2,
  GitBranch,
  Clock3,

} from "lucide-react";

import "./Builder.css";
import api from "../../api/api";

import FieldPalette from "./FieldPalette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import PreviewForm from "./PreviewForm";
import ConfirmationModal from "./ConfirmationModal";
import RuleBuilder from "./RuleBuilder"; // Import your new Day 7 rule UI panel

import ShareLinkWidget from './ShareLinkWidget';
import FormNavigation from "./FormNavigation";


function BuilderLayout({ formId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [loadingFieldTypes, setLoadingFieldTypes] = useState(true);
  const [loadingForm, setLoadingForm] = useState(true);

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("design"); // "design" or "logic" tab state
  const [saveError, setSaveError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
    shareLink: "",
  });
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  

  const isDraft = form?.status === "draft";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    let cancelled = false;

    api
      .get("/field-types/")
      .then((res) => {
        if (!cancelled) setFieldTypes(res.data);
      })
      .catch((err) => console.error("Failed to load field types", err))
      .finally(() => {
        if (!cancelled) setLoadingFieldTypes(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/forms/${formId}/versions`);
      setVersions(res.data);
    } catch (err) {
      console.error("Failed to load versions", err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/forms/${formId}`)
      .then((res) => {
        if (cancelled) return;

        const sortedFields = [...(res.data.fields || [])]
          .sort((a, b) => a.display_order - b.display_order)
          .map((field) => ({ ...field, dirty: false }));

        setForm(res.data);
        setFields(sortedFields);
        fetchVersions();
      })
      .catch((err) => {
        console.error("Failed to load form", err);
        if (!cancelled) setSaveError("Could not load this form.");
      })
      .finally(() => {
        if (!cancelled) setLoadingForm(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  const addField = async (type) => {
    const fieldType = fieldTypes.find((ft) => ft.type === type);
    if (!fieldType) return;

    const payload = {
      label: fieldType.label,
      field_type: type,
      config: JSON.parse(JSON.stringify(fieldType.config)),
      display_order: fields.length,
    };

    try {
      const res = await api.post(`/forms/${formId}/fields`, payload);
      setFields((prev) => [...prev, { ...res.data, dirty: false }]);
      setSelectedFieldId(res.data.id);
      setSaveError(null);
    } catch (err) {
      console.error("Failed to add field", err);
      setSaveError("Could not add that field. Check your connection and try again.");
    }
  };

  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value, dirty: true } : field
      )
    );
  };

  const updateFieldConfig = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? { ...field, config: { ...field.config, [key]: value }, dirty: true }
          : field
      )
    );
  };

  const saveField = async (id) => {
    const field = fields.find((f) => f.id === id);
    if (!field) return;

    try {
      const res = await api.patch(`/forms/${formId}/fields/${id}`, {
        label: field.label,
        config: field.config,
      });
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...res.data, dirty: false } : f))
      );
      setSaveError(null);
    } catch (err) {
      console.error("Failed to save field", err);
      setSaveError("Could not save changes. Check your connection and try again.");
    }
  };

  const deleteField = async (id) => {
    try {
      await api.delete(`/forms/${formId}/fields/${id}`);
      setFields((prev) => prev.filter((field) => field.id !== id));
      if (selectedFieldId === id) setSelectedFieldId(null);
      setSaveError(null);
     } catch (err) {
  console.error("Failed to delete field", err);

  setSaveError(
    err.response?.data?.detail ||
      "Could not delete that field."
  );
}
  };

  const persistOrder = async (orderedFields) => {
    const items = orderedFields.map((field, index) => ({
      field_id: field.id,
      display_order: index,
    }));

    try {
      await api.patch(`/forms/${formId}/fields/reorder`, items);
      setSaveError(null);
    } catch (err) {
      console.error("Failed to save new order", err);
      setSaveError("Could not save the new field order.");
    }
  };

  // ==========================================
  // CORE API EXECUTORS
  // ==========================================
  const executePublish = async () => {
  try {
    const res = await api.post(`/forms/${formId}/publish`);

    setForm((prev) => ({ ...prev, status: res.data.status }));
    setSaveError(null);
    fetchVersions();

   

  } catch (err) {
    console.error("Failed to publish form", err);

    const message =
      err.response?.data?.detail || "Could not publish this form.";

    setSaveError(message);
    

  } finally {
    closeModal();
  }
};

  const executeArchive = async () => {
    try {
      const res = await api.post(`/forms/${formId}/archive`);
      setForm((prev) => ({ ...prev, status: res.data.status }));
      setSaveError(null);
    } catch (err) {
      console.error("Failed to archive form", err);
      setSaveError(err.response?.data?.detail || "Could not archive this form.");
    } finally {
      closeModal();
    }
  };

  const executeNewDraft = async () => {
    try {
      const res = await api.post(`/forms/${formId}/new-draft`);
      setForm((prev) => ({ ...prev, status: res.data.status }));
      setSaveError(null);
     } catch (err) {
       console.error(
       "Failed to add field:",
       err.response?.status,
       err.response?.data || err.message
      );

      setSaveError(
        err.response?.data?.detail ||
        "Could not add that field. Check your connection and try again."
      );
    
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
  setModalConfig({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
    shareLink: "",
  });
};

  // ==========================================
  // MODAL TRIGGER HANDLERS
  // ==========================================
  const publishForm = () => {
  setModalConfig({
    isOpen: true,
    title: "Publish Form",
    message:
      "Are you sure you want to publish this form? Published forms cannot be edited directly.",
    confirmLabel: "Publish",
    onConfirm: () => {
      closeModal();
      executePublish();
    },
  });
};

  const archiveForm = () => {
    setModalConfig({
      isOpen: true,
      title: "Archive Form",
      message: "Are you sure you want to archive this form? Archived forms cannot be edited or filled.",
      confirmLabel: "Archive",
      onConfirm: () =>{
        closeModal();
        executeArchive();
      },
    });
  };

  const editAsNewDraft = () => {
    setModalConfig({
      isOpen: true,
      title: "Create New Draft",
      message: "Do you want to shift this form status back to an editable draft? Older history snapshots remain intact.",
      confirmLabel: "Create Draft",
      onConfirm: executeNewDraft,
    });
  };

  const handleDragEnd = (event) => {
    if (!isDraft) return;

    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.fromPalette) {
      if (over.id === "canvas-drop-zone") {
        addField(active.data.current.fieldType);
      }
      return;
    }

    if (active.id === over.id) return;

    setFields((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return items;

      const reordered = arrayMove(items, oldIndex, newIndex).map((field, index) => ({
        ...field,
        display_order: index,
      }));
      persistOrder(reordered);
      return reordered;
    });
  };

  if (loadingForm) {
    return <p style={{ padding: 20 }}>Loading form...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
       <FormNavigation
      formId={formId}
      onRulesClick={() => setActiveTab("logic")}
    />

      <div className="builder-toolbar">
      <div className="builder-toolbar-left">

  <div className="builder-header-info">

    <h1 className="builder-title">
      <LayoutTemplate size={28} strokeWidth={2.2} />
      {form?.title || "Untitled Form"}
    </h1>

    {form?.description && (
      <p className="builder-description">
        {form.description}
      </p>
    )}

    <div className="builder-meta-row">

      <span className={`status-badge status-${form?.status || "draft"}`}>
        {form?.status || "draft"}
      </span>

      <span className="builder-version">
        Version {form?.version || 1}
      </span>

    </div>

  </div>

  {!previewMode && (
    <div className="builder-tab-switcher">

      <button
        type="button"
        className={
          activeTab === "design"
            ? "tab-btn builder-btn active"
            : "tab-btn builder-btn"
        }
        onClick={() => setActiveTab("design")}
      >
        <Wand2 size={18} />
        Form Designer
      </button>

      <button
        type="button"
        className={
          activeTab === "logic"
            ? "tab-btn builder-btn active"
            : "tab-btn builder-btn"
        }
        onClick={() => setActiveTab("logic")}
      >
        <GitBranch size={18} />
        Conditional Logic
      </button>

    </div>
  )}

</div>

  <div className="builder-actions">

    <button
  type="button"
  className="secondary-btn builder-btn"
  onClick={() => setPreviewMode(!previewMode)}
>
  <Eye size={18} />
  {previewMode ? "Back to Editor" : "Preview"}
</button>

<button
  type="button"
  className="secondary-btn builder-btn"
  onClick={() => navigate(`/forms/${formId}/retention`)}
>
  <Clock3 size={18} />
  Retention Policy
</button>

    <button
      type="button"
      className="success-btn builder-btn"
      onClick={publishForm}
      disabled={!isDraft}
    >
      <Rocket size={18}/>
       Publish
    </button>

    <button
      type="button"
      className="danger-btn builder-btn"
      onClick={archiveForm}
      disabled={form?.status === "archived"}
    >
      <Archive size={18}/>
      Archive
    </button>

    {form?.status === "published" && (
      <button
        type="button"
        className="primary-btn builder-btn"
        onClick={editAsNewDraft}
      >
        <Pencil size={18}/>
        Edit Draft
      </button>
    )}

    <ShareLinkWidget
  formId={form.id}
  isPublished={true}
  versionNumber={form.version}
  onLinkGenerated={(data) => {
    setModalConfig({
      isOpen: true,
      title: "Share Form",
      message: "",
      confirmLabel: "",
      onConfirm: () => {},
      shareLink: data.url,
    });
  }}
/>

  </div>

 

</div>
      {saveError && <p className="builder-error">{saveError}</p>}

       <div className="version-history">

  <div className="version-history-header">
    <h2>
      <History size={24}/>
      Version History</h2>
    <span>{versions.length} Versions</span>
  </div>

  {versions.length === 0 ? (

    <div className="version-empty">
      No published versions yet.
    </div>

  ) : (

    <div className="version-grid">

      {versions.map((version) => (

        <div
          key={version.id}
          className="version-card"
        >

          <div className="version-card-top">

            <h3>
              Version {version.version_number}
            </h3>

            <span className={`version-status ${version.status}`}>
              {version.status}
            </span>

          </div>

          <div className="version-date">

            Published:

            {" "}

            {version.published_at
              ? new Date(version.published_at).toLocaleString()
              : "-"}

          </div>

        </div>

      ))}

    </div>

  )}

</div>

      {/* Main Workspace Frame Switcher */}
      {previewMode ? (
  <PreviewForm fields={fields} />
) : activeTab === "logic" ? (
  <div
    className="rule-builder-container"
    style={{
      width: "100%",
      padding: "20px",
      boxSizing: "border-box",
      overflowY: "auto",
      overflowX: "hidden",
      minHeight: "calc(100vh - 180px)",
    }}
  >
    <RuleBuilder
      formId={formId}
      fields={fields}
    />
  </div>
) : (
        /* Render standard Design drag-and-drop workspace */
        <div className="builder-workspace">

  <aside className="workspace-sidebar">

    <div className="workspace-card">

      <div className="workspace-card-header">
        <h3>
          <LayoutTemplate size={20}/>
           Components</h3>
        <p>Drag or click to build your form</p>
      </div>

      <FieldPalette
        fieldTypes={fieldTypes}
        loading={loadingFieldTypes}
        addField={addField}
        disabled={!isDraft}
      />

    </div>

  </aside>

  <main className="workspace-main">

    <div className="workspace-card">

      <div className="workspace-card-header">
        <h3>
          <LayoutTemplate size={20}/>
           Form Canvas</h3>
        <p>Arrange and customize your form fields</p>
      </div>

      <Canvas
        fields={fields}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
      />

    </div>

  </main>

  <aside className="workspace-properties">

    <div className="workspace-card">

      <div className="workspace-card-header">
        <h3>
          <Pencil size={20}/>
             Field Properties</h3>
        <p>Configure the selected field</p>
      </div>

      <PropertiesPanel
        selectedField={fields.find(
          (field) => field.id === selectedFieldId
        )}
        updateField={updateField}
        updateFieldConfig={updateFieldConfig}
        deleteField={deleteField}
        saveField={saveField}
        disabled={!isDraft}
      />

    </div>

  </aside>

</div>
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
        shareLink={modalConfig.shareLink}
      />
    </DndContext>
  );
}

export default BuilderLayout;