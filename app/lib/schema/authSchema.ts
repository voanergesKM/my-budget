import { z } from "zod";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters long")
  .max(20, "Password must be no more than 20 characters")
  .refine(password => /[A-Z]/.test(password), "Must contain at least one uppercase letter")
  .refine(password => /[a-z]/.test(password), "Must contain at least one lowercase letter")
  .refine(password => /[0-9]/.test(password), "Must contain at least one number")
  .refine(password => /[!@#$%^&*]/.test(password), "Must contain at least one special character");

 export const SignUpSchema = z.object({
    name: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: passwordSchema,
  });