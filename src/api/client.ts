import axios from "axios";
import { getToken } from "../auth/tokenStore";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
