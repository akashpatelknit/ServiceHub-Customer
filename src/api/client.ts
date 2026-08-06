import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiErrorEnvelope } from './types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

/**
 * Backend (service-hub-backend) issues the access token BOTH as an httpOnly cookie
 * and in the JSON response body (src/features/auth/controllers/auth.controller.js).
 * withCredentials lets the cookie flow automatically for same-site dev; the request
 * interceptor also attaches it as a Bearer header (mirrors service-hub-admin's
 * apis/client.js) so auth keeps working if customer/backend ever end up on different
 * subdomains in production, where a SameSite=Strict cookie would otherwise be dropped.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export interface NormalizedApiError {
  status: number;
  message: string;
  errors?: { field: string; message: string }[];
}

// Backend rotates refresh tokens (one active refresh token per user) — concurrent
// 401s must share a single in-flight refresh call, not each fire their own (the
// second refresh would invalidate the first and strand that request in a loop).
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ data: { accessToken: string; refreshToken: string } }>(
        `${API_BASE_URL}/auth/user/refresh`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response.data?.data,
  async (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorEnvelope>(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes('/auth/user/refresh') ?? false;

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(originalRequest);
      }
    }

    const normalized: NormalizedApiError = {
      status: status ?? 0,
      message: error.response?.data?.message ?? error.message ?? 'Something went wrong',
      errors: error.response?.data?.errors,
    };
    return Promise.reject(normalized);
  },
);

// The response interceptor above unwraps `{statusCode,data,message,success}` down to
// just `data`, so at runtime apiClient.get/post/etc. already resolve to the payload —
// these helpers just correct the return type to match (axios's own types don't know
// about the interceptor rewrite).
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get(url, config) as unknown as Promise<T>;
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.post(url, body, config) as unknown as Promise<T>;
}

export async function apiPatch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.patch(url, body, config) as unknown as Promise<T>;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete(url, config) as unknown as Promise<T>;
}
