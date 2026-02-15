import { z } from "zod";

/**
 * Validation schemas for API requests
 */

// Auth validation schemas
export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const GoogleOAuthSchema = z.object({
  token: z.string().optional(),
  idToken: z.string().optional(),
});

export const GithubOAuthSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().min(1, "State is required"),
});

// Conversation validation schemas
export const CreateConversationSchema = z.object({
  title: z.string().optional(),
});

export const AddMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  role: z.enum(["user", "assistant"]).optional().default("user"),
  intent: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const UpdateConversationTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

// Profile image: data URL (base64) or URL string, max ~500KB base64
export const ProfileImageSchema = z.object({
  profileImage: z.string().max(700_000).optional(),
});

// Type exports for runtime validation
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type GoogleOAuthInput = z.infer<typeof GoogleOAuthSchema>;
export type GithubOAuthInput = z.infer<typeof GithubOAuthSchema>;
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type AddMessageInput = z.infer<typeof AddMessageSchema>;
export type UpdateConversationTitleInput = z.infer<typeof UpdateConversationTitleSchema>;
export type ProfileImageInput = z.infer<typeof ProfileImageSchema>;
