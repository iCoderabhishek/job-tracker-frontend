import { z } from "zod";
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES } from "../../constants";

export const workspaceNameSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(60, "Workspace name must be less than 60 characters"),
});

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const uploadFileSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.enum(ALLOWED_MIME_TYPES as any, {
    message: "File type not supported",
  }),
  size: z
    .number()
    .min(1)
    .max(MAX_FILE_BYTES, "File exceeds the 100MB size limit"),
});
