import { apiClient } from "@/lib/client";
import { Folder, FileItem } from "@/types";

export async function fetchFolderContents(workspaceId: string, parentId?: string | null) {
  const url = parentId ? `/folders/${workspaceId}?parentId=${parentId}` : `/folders/${workspaceId}`;
  const { data } = await apiClient.get<{ folders: Folder[]; files: FileItem[] }>(url);
  return data;
}

export async function getFolders(
  workspaceId: string,
  parentId?: string
): Promise<{ folders: Folder[]; files: FileItem[] }> {
  const query = parentId ? `?parentId=${parentId}` : "";
  const { data } = await apiClient.get<{ folders: Folder[]; files: FileItem[] }>(
    `/folders/${workspaceId}${query}`
  );
  return data;
}

export async function getFolder(
  workspaceId: string,
  folderId: string
): Promise<{ folder: Folder }> {
  const { data } = await apiClient.get<{ folder: Folder }>(
    `/folders/${workspaceId}/${folderId}`
  );
  return data;
}

export async function createFolder(
  workspaceId: string,
  name: string,
  parentId?: string | null
): Promise<{ folder: Folder }> {
  const { data } = await apiClient.post<{ folder: Folder }>(
    `/folders/${workspaceId}`,
    { name, parentId }
  );
  return data;
}

export async function renameFolder(
  workspaceId: string,
  folderId: string,
  name: string
): Promise<{ folder: Folder }> {
  const { data } = await apiClient.patch<{ folder: Folder }>(
    `/folders/${workspaceId}/${folderId}/rename`,
    { name }
  );
  return data;
}

export async function moveFolder(
  workspaceId: string,
  folderId: string,
  newParentId: string | null
): Promise<{ folder: Folder }> {
  const { data } = await apiClient.patch<{ folder: Folder }>(
    `/folders/${workspaceId}/${folderId}/move`,
    { newParentId }
  );
  return data;
}

export async function deleteFolder(
  workspaceId: string,
  folderId: string
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/folders/${workspaceId}/${folderId}`
  );
  return data;
}

export async function searchFolders(
  workspaceId: string,
  query: string
): Promise<{ folders: Folder[] }> {
  const { data } = await apiClient.get<{ folders: Folder[] }>(
    `/folders/${workspaceId}/search?q=${encodeURIComponent(query)}`
  );
  return data;
}
