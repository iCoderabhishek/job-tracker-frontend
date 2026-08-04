import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFolderContents, searchFolders, createFolder, renameFolder, moveFolder, deleteFolder } from "./api.folders";
import { searchFiles, getFiles } from "@/features/files/api.files";

export const FOLDER_CONTENTS_KEY = (workspaceId: string, folderId: string | null) => ["folder-contents", workspaceId, folderId];
export const SEARCH_CONTENTS_KEY = (workspaceId: string, query: string) => ["search-contents", workspaceId, query];

export function useFolderContents(workspaceId: string, folderId: string | null, searchQuery: string) {
  return useQuery({
    queryKey: searchQuery.trim().length > 0 
      ? SEARCH_CONTENTS_KEY(workspaceId, searchQuery)
      : FOLDER_CONTENTS_KEY(workspaceId, folderId),
    queryFn: async () => {
      if (searchQuery.trim().length > 0) {
        const [folderData, fileData] = await Promise.all([
          searchFolders(workspaceId, searchQuery),
          searchFiles(workspaceId, searchQuery)
        ]);
        return { folders: folderData.folders || [], files: fileData.files || [] };
      } else {
        const [folderData, allFilesData] = await Promise.all([
          fetchFolderContents(workspaceId, folderId),
          getFiles(workspaceId)
        ]);
        
        // The backend GET /folders/:workspaceId endpoint does not consistently return files.
        // Instead, we get all files for the workspace and filter them by folderId.
        const files = (allFilesData.files || []).filter(
          (f) => (folderId ? f.folderId === folderId : !f.folderId)
        );
        
        return { folders: folderData.folders || [], files };
      }
    },
    enabled: !!workspaceId,
  });
}

export function useCreateFolder(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string | null }) => createFolder(workspaceId, name, parentId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["folder-contents", workspaceId, variables.parentId || null],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            folders: [...(oldData.folders || []), data.folder],
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId, variables.parentId || null] });
    }
  });
}

export function useRenameFolder(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) => renameFolder(workspaceId, folderId, name),
    onSuccess: () => {
      // Invalidate all folders to be safe since we don't know the exact parent from the mutation variables easily
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    }
  });
}

export function useDeleteFolder(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => deleteFolder(workspaceId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    }
  });
}

export function useMoveFolder(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, newParentId }: { folderId: string; newParentId: string | null }) => moveFolder(workspaceId, folderId, newParentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
    }
  });
}
