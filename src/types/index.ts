export interface User {
  userId: string;
  access_token: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}


export interface Workspace {
  id: string;
  workspaceName: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  workspaceId: string;
}

export interface FileItem {
  id: string;
  name: string;
  url: string | null;
  s3Key: string;
  size: string;
  mimetype: string;
  workspaceId: string;
  folderId: string | null;
  status: string;
  isPublic: boolean;
  thumbnailS3Key: string | null;
  deletedAt: string | null;
  uploaderId: string;
  uploader?: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface ExportJob {
  id: string;
  workspaceId: string;
  fileIds: string[];
  name?: string;
  status: "PENDING" | "PROCESSING" | "FAILED" | "DONE" | "CANCELLED";
  zipS3Key: string | null;
  createdAt: string;
  completedAt: string | null;
}
