export interface FieldOption {
  id?: number;
  field_id?: number;
  label: string;
  value: string;
  order: number;
}

export interface Field {
  id?: number;
  form_version_id?: number;
  name: string;
  label: string;
  field_type: "text" | "number" | "select" | "radio" | "checkbox" | "textarea" | "date" | "time" | "switch" | "email" | "rating" | "file" | "phone" | "address" | "divider" | "heading" | "paragraph";
  is_required: boolean;
  placeholder?: string;
  validation_rules?: Record<string, any> | null;
  order: number;
  options?: FieldOption[];
}

export interface FormVersion {
  id: number;
  form_id: number;
  version_number: number;
  is_published: boolean;
  created_at: string;
  fields: Field[];
}

export interface Form {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  versions: FormVersion[];
}

export interface Submission {
  id: number;
  form_id?: number;
  form_version_id: number;
  form_name?: string;
  submitted_data: Record<string, any>;
  response_json?: Record<string, any>;
  submitted_by?: string;
  status?: string;
  created_at: string;
}
