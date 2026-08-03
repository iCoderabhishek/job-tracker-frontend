import { apiClient } from "@/lib/client";
import { User } from "@/types";


export async function getCurrentUser(): Promise<{ user: User } | null> {
  try {
    const { data } = await apiClient.get<{ user: User }>("/auth/me");
    return data;
  } catch (err) {
    return null;
  }
}

export async function logout(): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/auth/logout");
  return data;
}
