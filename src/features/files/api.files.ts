import { apiClient } from "@/lib/client";
import { FileItem, ExportJob } from "@/types";

import axios from "axios";

export async function requestUpload(
  workspaceId: string,
  payload: { fileName: string; mimeType: string; size: number; folderId?: string }
): Promise<{ fileId: string; uploadId: string; key: string; urls: string[] }> {
  const { data } = await apiClient.post(
    `/files/${workspaceId}/request-upload`,
    payload
  );
  return data;
}

export async function getFiles(workspaceId: string): Promise<{ files: FileItem[] }> {
  const { data } = await apiClient.get<{ files: FileItem[] }>(
    `/files/${workspaceId}/all`
  );
  return data;
}

export async function uploadToS3(
  urls: string[],
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ PartNumber: number; ETag: string }[]> {
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const parts: { PartNumber: number; ETag: string }[] = [];

  let uploadedBytes = 0;

  for (let i = 0; i < urls.length; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const res = await axios.put(urls[i], chunk, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.loaded && onProgress) {
          const totalUploaded = uploadedBytes + progressEvent.loaded;
          const percentCompleted = Math.round((totalUploaded * 100) / file.size);
          onProgress(Math.min(percentCompleted, 100));
        }
      },
    });

    uploadedBytes += chunk.size;
    let etag = res.headers.etag;
    if (etag) {
      etag = etag.replace(/"/g, '');
    }

    parts.push({ PartNumber: i + 1, ETag: etag });
  }

  return parts;
}

export async function confirmUpload(
  workspaceId: string,
  fileId: string,
  uploadId: string,
  parts: { PartNumber: number; ETag: string }[]
): Promise<{ file: FileItem }> {
  const { data } = await apiClient.post(
    `/files/${workspaceId}/confirm-upload/${fileId}`,
    { uploadId, parts }
  );
  return data;
}

export async function moveFile(
  workspaceId: string,
  fileId: string,
  folderId: string | null
): Promise<{ file: FileItem }> {
  const { data } = await apiClient.patch<{ file: FileItem }>(
    `/files/${workspaceId}/move/${fileId}`,
    { folderId }
  );
  return data;
}

export async function getDownloadUrl(
  workspaceId: string,
  fileId: string,
  action?: "download" | "thumbnail"
): Promise<{ url: string }> {
  const query = action ? `?action=${action}` : "";
  const { data } = await apiClient.get<{ url: string }>(
    `/files/${workspaceId}/download/${fileId}${query}`
  );
  return data;
}

export async function deleteFile(workspaceId: string, fileId: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/files/${workspaceId}/delete/${fileId}`);
  return data;
}

export async function searchFiles(workspaceId: string, query: string) {
  const { data } = await apiClient.get<{ files: FileItem[] }>(`/files/${workspaceId}/search?q=${encodeURIComponent(query)}`);
  return data;
}

export async function getTrash(workspaceId: string) {
  const { data } = await apiClient.get<{ files: FileItem[] }>(`/files/${workspaceId}/trash`);
  return data;
}

export async function restoreFile(workspaceId: string, fileId: string) {
  const { data } = await apiClient.patch<{ success: boolean; file: FileItem }>(`/files/${workspaceId}/trash/${fileId}/restore`);
  return data;
}

export async function permanentlyDeleteFile(workspaceId: string, fileId: string) {
  const { data } = await apiClient.delete<{ success: boolean; file: FileItem }>(`/files/${workspaceId}/trash/${fileId}`);
  return data;
}

export async function togglePublic(workspaceId: string, fileId: string, isPublic: boolean) {
  const { data } = await apiClient.patch<{ success: true; file: FileItem }>(`/files/${workspaceId}/public/${fileId}`, { isPublic });
  return data.file;
}

export async function createExport(workspaceId: string, fileIds: string[]) {
  const { data } = await apiClient.post<{ job: ExportJob }>(`/files/${workspaceId}/exports`, { fileIds });
  return data;
}

export async function getExports(workspaceId: string) {
  const { data } = await apiClient.get<{ exports: ExportJob[] }>(`/files/${workspaceId}/exports/all`);
  return data;
}

export async function getExportStatus(workspaceId: string, jobId: string) {
  const { data } = await apiClient.get<{ status: string; downloadUrl?: string }>(`/files/${workspaceId}/exports/${jobId}`);
  return data;
}

export async function cancelExport(workspaceId: string, jobId: string) {
  const { data } = await apiClient.delete<{ success: boolean; job: ExportJob }>(`/files/${workspaceId}/exports/${jobId}`);
  return data;
}

export async function getStorageQuota(workspaceId: string) {
  const { data } = await apiClient.get<{ used: string; limit: string }>(`/files/${workspaceId}/quota`);
  return data;
}