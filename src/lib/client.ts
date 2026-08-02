import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 unauthenticated interceptor
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // If we are not already on the login page or an invite link, redirect
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/invite")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
