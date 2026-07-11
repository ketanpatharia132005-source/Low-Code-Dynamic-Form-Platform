import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import "./Builder.css";
import api from "../../api/api";

import FieldPalette from "./FieldPalette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import PreviewForm from "./PreviewForm";
import ConfirmationModal from "./ConfirmationModal";

import ShareLinkWidget from './ShareLinkWidget';

function BuilderLayout({ formId }) {
  const [form, setForm] = useState(null);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [loadingFieldTypes, setLoadingFieldTypes] = useState(true);
  const [loadingForm, setLoadingForm] = useState(true);

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

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
      setSaveError("Could not delete that field. Check your connection and try again.");
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
      setSaveError(err.response?.data?.detail || "Could not publish this form.");
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
      console.error("Failed to create new draft", err);
      setSaveError(err.response?.data?.detail || "Could not create a new draft.");
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // ==========================================
  // MODAL TRIGGER HANDLERS
  // ==========================================
  const publishForm = () => {
    setModalConfig({
      isOpen: true,
      title: "Publish Form",
      message: "Are you sure you want to publish this form? Published forms cannot be edited directly.",
      confirmLabel: "Publish",
      onConfirm: executePublish,
    });
  };

  const archiveForm = () => {
    setModalConfig({
      isOpen: true,
      title: "Archive Form",
      message: "Are you sure you want to archive this form? Archived forms cannot be edited or filled.",
      confirmLabel: "Archive",
      onConfirm: executeArchive,
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

  console.log("DEBUG - Form Object:", form);
console.log("DEBUG - Is Published?", form?.status?.toLowerCase() === "published");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
     <div className="builder-toolbar">
  {/* Restructured for proper flow */}
  <div className="builder-header-info">
    <h1>{form?.title || "Untitled Form"}</h1>
    {form?.description && <p className="builder-description">{form.description}</p>}
    <span className={`status-badge status-${form?.status || "draft"}`}>
      {form?.status || "draft"}
    </span>
  </div>

  <div className="builder-actions">
    <button type="button" onClick={() => setPreviewMode(!previewMode)}>
      {previewMode ? "Back to Builder" : "Preview Form"}
    </button>

    <button type="button" onClick={publishForm} disabled={!isDraft}>
      Publish
    </button>

    <button type="button" onClick={archiveForm} disabled={form?.status === "archived"}>
      Archive
    </button>

    {form?.status === "published" && (
      <button type="button" onClick={editAsNewDraft}>
        Edit as New Draft
      </button>
    )}
    
    <ShareLinkWidget 
      formId={form.id} 
      isPublished={true} 
      versionNumber={form.version} 
    />
  </div>
</div>
      {saveError && <p className="builder-error">{saveError}</p>}

<div className="version-history">
  <h2>Version History</h2>

  {versions.length === 0 ? (
    <p className="field-hint">No published versions yet.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Version</th>
          <th>Status</th>
          <th>Published At</th>
        </tr>
      </thead>
      <tbody>
        {versions.map((version) => (
          <tr key={version.id}>
            <td>v{version.version_number}</td>
            <td>{version.status}</td>
            <td>
              {version.published_at
                ? new Date(version.published_at).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
  

      {previewMode ? (
  <PreviewForm fields={fields} />
) : (
  <div className="builder-layout-wrapper">
    <div className="builder-column palette-column">
      <FieldPalette
        fieldTypes={fieldTypes}
        loading={loadingFieldTypes}
        addField={addField}
        disabled={!isDraft}
      />
    </div>

    <div className="builder-column canvas-column">
      <Canvas
        fields={fields}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
      />
    </div>

    <div className="builder-column properties-column">
      <PropertiesPanel
        selectedField={fields.find((field) => field.id === selectedFieldId)}
        updateField={updateField}
        updateFieldConfig={updateFieldConfig}
        deleteField={deleteField}
        saveField={saveField}
        disabled={!isDraft}
      />
    </div>
  </div>
)}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />
    </DndContext>
  );
}

export default BuilderLayout;
