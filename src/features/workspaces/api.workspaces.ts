import { apiClient } from "@/lib/client";
import { Workspace } from "@/types";

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const { data } = await apiClient.get<{ workspaces: Workspace[] }>("/workspace/all");
  return data.workspaces;
}

export async function getWorkspaces(): Promise<{ workspaces: Workspace[] }> {
  const { data } = await apiClient.get<{ workspaces: Workspace[] }>("/workspace/all");
  return data;
}

export async function getWorkspace(workspaceId: string): Promise<{ workspace: Workspace }> {
  const { data } = await apiClient.get<{ workspace: Workspace }>(`/workspace/${workspaceId}`);
  return data;
}

export async function createWorkspace(workspaceName: string): Promise<{ workspace: Workspace }> {
  const { data } = await apiClient.post<{ workspace: Workspace }>("/workspace/create", { workspaceName });
  return data;
}

export async function updateWorkspace(workspaceId: string, workspaceName: string): Promise<{ workspace: Workspace }> {
  const { data } = await apiClient.patch<{ workspace: Workspace }>(`/workspace/update/${workspaceId}`, { workspaceName });
  return data;
}

export async function deleteWorkspace(workspaceId: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<{ deleted: boolean }>(`/workspace/delete/${workspaceId}`);
  return data;
}

export async function inviteToWorkspace(workspaceId: string, email: string): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(`/workspace/invite/${workspaceId}`, { email });
  return data;
}

export async function acceptInvite(token: string): Promise<{ joined: boolean; workspaceId: string }> {
  const { data } = await apiClient.post<{ joined: boolean; workspaceId: string }>("/workspace/accept-invite", { token });
  return data;
}

export async function getAllMembers(workspaceId: string, role?: string): Promise<{ members: any[] }> {
  const params = role ? { role } : {};
  const { data } = await apiClient.get<{ members: any[] }>(`/workspace/${workspaceId}/members/all`, { params });
  return data;
}

export async function searchWorkspaces(query: string): Promise<{ workspaces: Workspace[] }> {
  const { data } = await apiClient.get<{ workspaces: Workspace[] }>(`/workspace/search?q=${encodeURIComponent(query)}`);
  return data;
}

export async function searchMembers(workspaceId: string, query: string): Promise<{ members: any[] }> {
  const { data } = await apiClient.get<{ members: any[] }>(`/workspace/${workspaceId}/members/search?q=${encodeURIComponent(query)}`);
  return data;
}
