import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN ? `; domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}` : "";
  document.cookie = name + "=" + (value || "")  + expires + "; path=/" + domain;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN ? `; domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}` : "";
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT" + domain;
}

export const getStoredUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("jobtracker_user_id");
  if (!stored) {
    // Fallback to check cookie if localStorage is empty
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )jobtracker_user_id=([^;]+)'));
      if (match) {
        const id = parseInt(match[2], 10);
        localStorage.setItem("jobtracker_user_id", id.toString());
        return id;
      }
    }
    return null;
  }
  return parseInt(stored, 10);
};

export const setStoredUserId = (id: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jobtracker_user_id", id.toString());
    setCookie("jobtracker_user_id", id.toString(), 30);
  }
};

export const clearStoredUserId = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jobtracker_user_id");
    deleteCookie("jobtracker_user_id");
  }
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const userId = getStoredUserId();
      if (!userId) return null;
      try {
        const user = await authApi.getUser(userId);
        return user;
      } catch (err: any) {
        // If API returns 401, 403, or 404, clear local storage
        const status = err?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          clearStoredUserId();
          return null;
        }
        // If it's a network error (backend down), we might want to return a mock user or just null without clearing
        // For now, return a placeholder so we don't forcefully log out users during backend restarts
        return { id: userId, email: "offline@local", name: "Offline User" };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return () => {
    clearStoredUserId();
    queryClient.setQueryData(["current-user"], null);
    window.location.href = "/login";
  };
}
