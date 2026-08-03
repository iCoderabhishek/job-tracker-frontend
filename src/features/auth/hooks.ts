import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./api.auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const data = await getCurrentUser();
      return data?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
