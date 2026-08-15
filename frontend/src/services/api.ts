import axios from "axios";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";

const normalizedBaseUrl =
  configuredBaseUrl.replace(/\/+$/, "");

const apiBaseUrl =
  normalizedBaseUrl.endsWith("/api/v1")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api/v1`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ??
      error?.message ??
      "An unexpected API error occurred.";

    return Promise.reject(
      new Error(message),
    );
  },
);

export default api;