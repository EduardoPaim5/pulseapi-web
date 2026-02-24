import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { clearToken, getToken, setToken } from "../auth/tokenStore";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authClient = axios.create({
  baseURL,
  withCredentials: true,
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status as number | undefined;
    const isRefreshCall = typeof originalRequest?.url === "string" && originalRequest.url.includes("/api/v1/auth/refresh");

    if (!originalRequest || status !== 401 || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await authClient.post<{ accessToken: string }>("/api/v1/auth/refresh");
      if (!data?.accessToken) {
        clearToken();
        return Promise.reject(error);
      }
      setToken(data.accessToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearToken();
      return Promise.reject(refreshError);
    }
  }
);
