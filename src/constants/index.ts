export const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "video/mp4",
] as const;

export const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB
export const WORKSPACE_QUOTA_BYTES = 500 * 1024 * 1024; // 500 MB
