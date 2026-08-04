import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  requestUpload, 
  uploadToS3, 
  confirmUpload, 
  moveFile, 
  togglePublic, 
  deleteFile,
  getStorageQuota
} from "./api.files";
import { useQuery } from "@tanstack/react-query";

export function useUploadFile(workspaceId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      file,
      folderId,
      onProgress,
    }: {
      file: File;
      folderId?: string | null;
      onProgress?: (progress: number) => void;
    }) => {
      // Step 1: Request URL
      const { fileId, uploadId, urls } = await requestUpload(workspaceId, {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        folderId: folderId || undefined,
      });

      // Step 2: PUT chunks to S3
      const parts = await uploadToS3(urls, file, onProgress);

      // Step 3: Confirm
      const { file: confirmedFile } = await confirmUpload(workspaceId, fileId, uploadId, parts);
      
      return confirmedFile;
    },
    onSuccess: (confirmedFile, variables) => {
      queryClient.setQueryData(
        ["folder-contents", workspaceId, variables.folderId || null],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            files: [...(oldData.files || []), confirmedFile],
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId, variables.folderId || null] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    },
  });
}

export function useMoveFile(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, folderId }: { fileId: string; folderId: string | null }) => moveFile(workspaceId, fileId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    }
  });
}

export function useTogglePublicStatus(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, isPublic }: { fileId: string; isPublic: boolean }) => togglePublic(workspaceId, fileId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    }
  });
}

export function useDeleteFile(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteFile(workspaceId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["search-contents", workspaceId] });
    }
  });
}

export function useStorageQuota(workspaceId: string) {
  return useQuery({
    queryKey: ["storage-quota", workspaceId],
    queryFn: () => getStorageQuota(workspaceId),
    enabled: !!workspaceId,
  });
}
