import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pulseapi_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
