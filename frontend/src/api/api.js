import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored JWT to every outgoing request, if one exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If a request comes back unauthorized/expired, clear the stale token
// and send the user back to login instead of failing silently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const getFormRules = (formId) =>
  api.get(`/forms/${formId}/rules`);

export const createFormRule = (formId, ruleData) =>
  api.post(`/forms/${formId}/rules`, ruleData);

export const deleteFormRule = (formId, ruleId) =>
  api.delete(`/forms/${formId}/rules/${ruleId}`);

// ===============================
// Public Form APIs
// ===============================

// Fetch a published form using its share token
export const getPublicForm = (shareToken) =>
  api.get(`/public/forms/${shareToken}`);

// Submit a public form response
//export const submitPublicForm = (shareToken, responses) =>
  //api.post(`/forms/share/${shareToken}/submit`, {
  //  responses,
 // });
 export const submitPublicForm = (shareToken, responses) => {
  console.log("===== submitPublicForm =====");
  console.log("Share Token:", shareToken);
  console.log("Responses:", responses);

  return api.post(`/forms/share/${shareToken}/submit`, {
    responses,
  });
};

export const getFormSubmissions = (formId) =>
  api.get(`/submissions/form/${formId}`);