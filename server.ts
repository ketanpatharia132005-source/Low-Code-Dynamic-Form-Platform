import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Path to file database
const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Helper functions to read/write JSON database
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      // Create empty db
      const initialDb = { forms: [], submissions: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { forms: [], submissions: [] };
  }
}

function writeDb(data: any) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware for safety
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API ROUTERS & CONTROLLERS (FASTAPI EQUIVALENT ENDPOINTS) ---

  // 1. Health check API
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "Low-Code Dynamic Form Workflow Platform (Express Proxy Mode)",
      database: "connected (db.json)"
    });
  });

  // 2. Forms - Retrieve all
  app.get("/api/v1/forms", (req, res) => {
    const db = readDb();
    res.json(db.forms);
  });

  // 3. Forms - Retrieve by ID
  app.get("/api/v1/forms/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const form = db.forms.find((f: any) => f.id === id);
    if (!form) {
      return res.status(404).json({ detail: "Form not found" });
    }
    res.json(form);
  });

  // 4. Forms - Create form (with automatic Version 1 creation)
  app.post("/api/v1/forms", (req, res) => {
    const db = readDb();
    const { title, description, is_active, category, tags, initial_fields } = req.body;

    if (!title) {
      return res.status(400).json({ detail: "Title is required" });
    }

    const formId = db.forms.length > 0 ? Math.max(...db.forms.map((f: any) => f.id)) + 1 : 1;
    const versionId = Date.now(); // Simple unique ID for mock version

    const newForm = {
      id: formId,
      title,
      description: description || "",
      is_active: is_active !== undefined ? is_active : true,
      category: category || "General",
      tags: tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: [
        {
          id: versionId,
          form_id: formId,
          version_number: 1,
          is_published: true,
          created_at: new Date().toISOString(),
          fields: (initial_fields || []).map((field: any, index: number) => ({
            id: Date.now() + index,
            form_version_id: versionId,
            name: field.name || `field_${index}`,
            label: field.label || "Untitled Field",
            field_type: field.field_type || "text",
            is_required: !!field.is_required,
            placeholder: field.placeholder || "",
            validation_rules: field.validation_rules || null,
            order: field.order !== undefined ? field.order : index,
            options: (field.options || []).map((opt: any, optIdx: number) => ({
              id: Date.now() + index + optIdx + 100,
              field_id: Date.now() + index,
              label: opt.label || `Option ${optIdx + 1}`,
              value: opt.value || `option_${optIdx + 1}`,
              order: opt.order !== undefined ? opt.order : optIdx
            }))
          }))
        }
      ]
    };

    db.forms.push(newForm);
    writeDb(db);
    res.status(201).json(newForm);
  });

  // 5. Forms - Update metadata
  app.put("/api/v1/forms/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const formIndex = db.forms.findIndex((f: any) => f.id === id);

    if (formIndex === -1) {
      return res.status(404).json({ detail: "Form not found" });
    }

    const { title, description, is_active, category, tags } = req.body;
    const updatedForm = { ...db.forms[formIndex] };

    if (title !== undefined) updatedForm.title = title;
    if (description !== undefined) updatedForm.description = description;
    if (is_active !== undefined) updatedForm.is_active = is_active;
    if (category !== undefined) updatedForm.category = category;
    if (tags !== undefined) updatedForm.tags = tags;
    updatedForm.updated_at = new Date().toISOString();

    db.forms[formIndex] = updatedForm;
    writeDb(db);
    res.json(updatedForm);
  });

  // 6. Forms - Delete form
  app.delete("/api/v1/forms/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const formIndex = db.forms.findIndex((f: any) => f.id === id);

    if (formIndex === -1) {
      return res.status(404).json({ detail: "Form not found" });
    }

    db.forms.splice(formIndex, 1);
    writeDb(db);
    res.sendStatus(204);
  });

  // 6b. Forms - Duplicate form
  app.post("/api/v1/forms/:id/duplicate", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const form = db.forms.find((f: any) => f.id === id);

    if (!form) {
      return res.status(404).json({ detail: "Form not found" });
    }

    const formId = db.forms.length > 0 ? Math.max(...db.forms.map((f: any) => f.id)) + 1 : 1;
    const versionId = Date.now();

    // Deep copy form versions
    const duplicatedVersions = (form.versions || []).map((ver: any, vIdx: number) => {
      const newVerId = versionId + vIdx;
      return {
        ...ver,
        id: newVerId,
        form_id: formId,
        created_at: new Date().toISOString(),
        fields: (ver.fields || []).map((field: any, fIdx: number) => {
          const newFieldId = Date.now() + fIdx + vIdx * 1000;
          return {
            ...field,
            id: newFieldId,
            form_version_id: newVerId,
            options: (field.options || []).map((opt: any, optIdx: number) => ({
              ...opt,
              id: Date.now() + fIdx + optIdx + vIdx * 1000 + 100,
              field_id: newFieldId
            }))
          };
        })
      };
    });

    const duplicatedForm = {
      ...form,
      id: formId,
      title: `${form.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: duplicatedVersions
    };

    db.forms.push(duplicatedForm);
    writeDb(db);
    res.status(201).json(duplicatedForm);
  });

  // 7. Forms - Add a new workflow version
  app.post("/api/v1/forms/:id/versions", (req, res) => {
    const db = readDb();
    const formId = parseInt(req.params.id);
    const formIndex = db.forms.findIndex((f: any) => f.id === formId);

    if (formIndex === -1) {
      return res.status(404).json({ detail: "Form not found" });
    }

    const { is_published, fields } = req.body;
    const form = db.forms[formIndex];
    const latestVersionNum = form.versions.length > 0 
      ? Math.max(...form.versions.map((v: any) => v.version_number)) 
      : 0;

    const versionId = Date.now();
    const newVersion = {
      id: versionId,
      form_id: formId,
      version_number: latestVersionNum + 1,
      is_published: is_published !== undefined ? is_published : false,
      created_at: new Date().toISOString(),
      fields: (fields || []).map((field: any, index: number) => ({
        id: Date.now() + index,
        form_version_id: versionId,
        name: field.name || `field_${index}`,
        label: field.label || "Untitled Field",
        field_type: field.field_type || "text",
        is_required: !!field.is_required,
        placeholder: field.placeholder || "",
        validation_rules: field.validation_rules || null,
        order: field.order !== undefined ? field.order : index,
        options: (field.options || []).map((opt: any, optIdx: number) => ({
          id: Date.now() + index + optIdx + 100,
          field_id: Date.now() + index,
          label: opt.label || `Option ${optIdx + 1}`,
          value: opt.value || `option_${optIdx + 1}`,
          order: opt.order !== undefined ? opt.order : optIdx
        }))
      }))
    };

    form.versions.push(newVersion);
    form.updated_at = new Date().toISOString();
    writeDb(db);
    res.status(201).json(newVersion);
  });

  // 8. Submissions - Create Submission
  app.post("/api/v1/submissions/version/:form_version_id", (req, res) => {
    const db = readDb();
    const formVersionId = parseInt(req.params.form_version_id);
    const { submitted_data, submitted_by, status } = req.body;

    if (!submitted_data) {
      return res.status(400).json({ detail: "submitted_data is required" });
    }

    // Find the associated version and form to validate fields
    let foundVersion: any = null;
    let foundForm: any = null;
    for (const form of db.forms) {
      const v = form.versions?.find((version: any) => version.id === formVersionId);
      if (v) {
        foundVersion = v;
        foundForm = form;
        break;
      }
    }

    if (!foundVersion || !foundForm) {
      return res.status(404).json({ detail: "Form or form version not found" });
    }

    // Quick fields validation (required check)
    for (const field of foundVersion.fields) {
      if (field.is_required && (submitted_data[field.name] === undefined || submitted_data[field.name] === "")) {
        return res.status(400).json({ detail: `Field '${field.label}' is required.` });
      }
    }

    const submissionId = db.submissions.length > 0 
      ? Math.max(...db.submissions.map((s: any) => s.id)) + 1 
      : 2001;

    const newSubmission = {
      id: submissionId,
      form_id: foundForm.id,
      form_version_id: formVersionId,
      form_name: foundForm.title,
      submitted_data,
      response_json: submitted_data,
      submitted_by: submitted_by || "Anonymous",
      status: status || "Completed",
      created_at: new Date().toISOString()
    };

    db.submissions.push(newSubmission);
    writeDb(db);
    res.status(201).json(newSubmission);
  });

  // 9. Submissions - Retrieve by Form Version
  app.get("/api/v1/submissions/version/:form_version_id", (req, res) => {
    const db = readDb();
    const formVersionId = parseInt(req.params.form_version_id);
    const subs = db.submissions.filter((s: any) => s.form_version_id === formVersionId);
    res.json(subs);
  });

  // 10. Submissions - Retrieve by Form
  app.get("/api/v1/submissions/form/:form_id", (req, res) => {
    const db = readDb();
    const formId = parseInt(req.params.form_id);
    
    // Find version IDs belonging to this form
    const form = db.forms.find((f: any) => f.id === formId);
    if (!form) {
      return res.status(404).json({ detail: "Form not found" });
    }

    const versionIds = form.versions.map((v: any) => v.id);
    const subs = db.submissions.filter((s: any) => versionIds.includes(s.form_version_id));
    res.json(subs);
  });

  // 10b. Submissions - Get all submissions (across all forms)
  app.get("/api/v1/submissions", (req, res) => {
    const db = readDb();
    const enhancedSubmissions = db.submissions.map((sub: any) => {
      let form_id = sub.form_id;
      let form_name = sub.form_name;
      if (!form_id || !form_name) {
        for (const form of db.forms) {
          const v = form.versions?.find((ver: any) => ver.id === sub.form_version_id);
          if (v) {
            form_id = form.id;
            form_name = form.title;
            break;
          }
        }
      }
      return {
        id: sub.id,
        form_id: form_id || 1,
        form_version_id: sub.form_version_id,
        form_name: form_name || "Unknown Form",
        submitted_data: sub.submitted_data,
        response_json: sub.response_json || sub.submitted_data,
        submitted_by: sub.submitted_by || "Anonymous",
        status: sub.status || "Completed",
        created_at: sub.created_at
      };
    });
    // Sort descending by created_at
    enhancedSubmissions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(enhancedSubmissions);
  });

  // 10c. Submissions - Retrieve single submission by ID
  app.get("/api/v1/submissions/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const sub = db.submissions.find((s: any) => s.id === id);
    if (!sub) {
      return res.status(404).json({ detail: "Submission not found" });
    }
    
    let form_id = sub.form_id;
    let form_name = sub.form_name;
    if (!form_id || !form_name) {
      for (const form of db.forms) {
        const v = form.versions?.find((ver: any) => ver.id === sub.form_version_id);
        if (v) {
          form_id = form.id;
          form_name = form.title;
          break;
        }
      }
    }

    res.json({
      id: sub.id,
      form_id: form_id || 1,
      form_version_id: sub.form_version_id,
      form_name: form_name || "Unknown Form",
      submitted_data: sub.submitted_data,
      response_json: sub.response_json || sub.submitted_data,
      submitted_by: sub.submitted_by || "Anonymous",
      status: sub.status || "Completed",
      created_at: sub.created_at
    });
  });

  // 10d. Submissions - Update single submission by ID
  app.put("/api/v1/submissions/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const subIndex = db.submissions.findIndex((s: any) => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ detail: "Submission not found" });
    }

    const { submitted_data, submitted_by, status } = req.body;
    const sub = db.submissions[subIndex];

    if (submitted_data !== undefined) {
      sub.submitted_data = submitted_data;
      sub.response_json = submitted_data;
    }
    if (submitted_by !== undefined) {
      sub.submitted_by = submitted_by;
    }
    if (status !== undefined) {
      sub.status = status;
    }

    db.submissions[subIndex] = sub;
    writeDb(db);
    res.json(sub);
  });

  // 10e. Submissions - Delete single submission by ID
  app.delete("/api/v1/submissions/:id", (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const subIndex = db.submissions.findIndex((s: any) => s.id === id);
    if (subIndex === -1) {
      return res.status(404).json({ detail: "Submission not found" });
    }

    db.submissions.splice(subIndex, 1);
    writeDb(db);
    res.sendStatus(204);
  });

  // --- VITE INTERFACES SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Proxy Engine] Running dynamically at http://0.0.0.0:${PORT}`);
  });
}

startServer();
