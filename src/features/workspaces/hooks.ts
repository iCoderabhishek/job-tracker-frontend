import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMembers, inviteToWorkspace } from "./api.workspaces";

export function useWorkspaceMembers(workspaceId: string | null) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return { members: [] };
      const data = await getAllMembers(workspaceId);
      return data;
    },
    enabled: !!workspaceId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, email }: { workspaceId: string; email: string }) => 
      inviteToWorkspace(workspaceId, email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", variables.workspaceId] });
    }
  });
}
