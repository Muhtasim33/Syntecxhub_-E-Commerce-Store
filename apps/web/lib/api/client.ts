import { useAuthStore } from '@/store/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // sends refresh token cookie
  });

  // Handle 401 Unauthorized with automatic silent token refresh
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
        }
        return fetch(url, { ...options, headers, credentials: 'include' }).then((res) =>
          res.json()
        );
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error('Refresh token expired or invalid');
      }

      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.data?.accessToken;

      if (newAccessToken) {
        useAuthStore.getState().setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Retry the original request
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      }
    } catch (refreshErr) {
      processQueue(refreshErr as Error, null);
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    (error as unknown as { status: number; data: unknown }).status = response.status;
    (error as unknown as { status: number; data: unknown }).data = data;
    throw error;
  }

  return data as T;
}
