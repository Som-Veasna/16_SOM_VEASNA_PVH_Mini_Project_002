import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Full name needs at least 2 characters"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  birthdate: z.string().min(1, "Birthdate is required"),
});