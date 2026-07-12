import axios from "axios";
import { Form, FormVersion, Submission } from "../types";

// Base URL is relative to origin to leverage Express proxy and run within the container's port 3000 mapping
const API_BASE = "/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Get all forms
  getForms: async (): Promise<Form[]> => {
    const response = await apiClient.get<Form[]>("/forms");
    return response.data;
  },

  // Get a single form by ID
  getForm: async (id: number): Promise<Form> => {
    const response = await apiClient.get<Form>(`/forms/${id}`);
    return response.data;
  },

  // Create a new form with default version 1
  createForm: async (formData: {
    title: string;
    description: string;
    is_active?: boolean;
    initial_fields?: any[];
  }): Promise<Form> => {
    const response = await apiClient.post<Form>("/forms", formData);
    return response.data;
  },

  // Update form metadata
  updateForm: async (
    id: number,
    formData: { title?: string; description?: string; is_active?: boolean }
  ): Promise<Form> => {
    const response = await apiClient.put<Form>(`/forms/${id}`, formData);
    return response.data;
  },

  // Delete a form
  deleteForm: async (id: number): Promise<void> => {
    await apiClient.delete(`/forms/${id}`);
  },

  // Duplicate a form
  duplicateForm: async (id: number): Promise<Form> => {
    const response = await apiClient.post<Form>(`/forms/${id}/duplicate`);
    return response.data;
  },

  // Create a new version of a form
  createFormVersion: async (
    formId: number,
    versionData: { is_published: boolean; fields: any[] }
  ): Promise<FormVersion> => {
    const response = await apiClient.post<FormVersion>(`/forms/${formId}/versions`, versionData);
    return response.data;
  },

  // Submit data for a form version
  submitForm: async (
    formVersionId: number,
    submittedData: Record<string, any>
  ): Promise<Submission> => {
    const response = await apiClient.post<Submission>(`/submissions/version/${formVersionId}`, {
      submitted_data: submittedData,
    });
    return response.data;
  },

  // Get submissions for a form version
  getVersionSubmissions: async (formVersionId: number): Promise<Submission[]> => {
    const response = await apiClient.get<Submission[]>(`/submissions/version/${formVersionId}`);
    return response.data;
  },

  // Get all submissions for a form (across all versions)
  getFormSubmissions: async (formId: number): Promise<Submission[]> => {
    const response = await apiClient.get<Submission[]>(`/submissions/form/${formId}`);
    return response.data;
  },

  // Get all submissions across all forms
  getSubmissions: async (): Promise<Submission[]> => {
    const response = await apiClient.get<Submission[]>("/submissions");
    return response.data;
  },

  // Get single submission by ID
  getSubmission: async (id: number): Promise<Submission> => {
    const response = await apiClient.get<Submission>(`/submissions/${id}`);
    return response.data;
  },

  // Update submission by ID
  updateSubmission: async (
    id: number,
    data: { submitted_data?: Record<string, any>; submitted_by?: string; status?: string }
  ): Promise<Submission> => {
    const response = await apiClient.put<Submission>(`/submissions/${id}`, data);
    return response.data;
  },

  // Delete submission by ID
  deleteSubmission: async (id: number): Promise<void> => {
    await apiClient.delete(`/submissions/${id}`);
  },
};
