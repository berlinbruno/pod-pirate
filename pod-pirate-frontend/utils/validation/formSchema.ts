import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .toLowerCase()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be less than 20 characters" })
      .refine((value) => /^[a-z0-9]+$/.test(value), {
        message: "Username can only contain letters and numbers (no spaces or symbols)",
      })
      .refine((value) => (value.match(/[0-9]/g)?.length ?? 0) <= 3, {
        message: "Username can contain at most 3 numbers",
      }),

    email: z
      .string()
      .email({ message: "Invalid email format" })
      .min(1, { message: "Email is required" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must not exceed 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must not exceed 20 characters" }),

    bio: z
      .string()
      .max(100, {
        message: "Bio should not exceed 100 characters",
      })
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export const signoutSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignoutFormInputs = z.infer<typeof signoutSchema>;

export const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type EmailInputs = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must not exceed 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must not exceed 20 characters" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
  newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters" })
    .max(20, { message: "New password must not exceed 20 characters" })
    .regex(/[A-Z]/, {
      message: "New password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "New password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "New password must contain at least one number",
    })
    .regex(/[\W_]/, {
      message: "New password must contain at least one special character",
    }),
});

export type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  confirm: z.string().superRefine((value, ctx) => {
    if (value.toUpperCase() !== "DELETE") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must type DELETE to confirm",
      });
    }
  }),
});

export type DeleteAccountFormInputs = z.infer<typeof deleteAccountSchema>;

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be between 3 to 20 characters" })
    .toLowerCase()
    .refine((value) => /^(?:[a-z]*\d){0,3}[a-z]*$/.test(value), {
      message: "Username can contain lowercase letters and up to 3 digits only",
    }),
});

export type UpdateUsernameFormInputs = z.infer<typeof updateUsernameSchema>;

export const updateBioSchema = z.object({
  bio: z
    .string()
    .min(1, { message: "Bio cannot be empty" })
    .max(100, { message: "Bio should not exceed 100 characters" }),
});

export type UpdateBioFormInputs = z.infer<typeof updateBioSchema>;

export const createPodcastSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be between 10 and 300 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
});

export type CreatePodcastFormInputs = z.infer<typeof createPodcastSchema>;

export const updatePodcastSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be between 10 and 300 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
});

export type UpdatePodcastFormInputs = z.infer<typeof updatePodcastSchema>;

export const createEpisodeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be between 10 and 300 characters" }),
  durationSeconds: z.number().min(1, { message: "Duration must be at least 1 second" }),
});

export type CreateEpisodeFormInputs = z.infer<typeof createEpisodeSchema>;

export const updateEpisodeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be between 10 and 300 characters" }),
  durationSeconds: z.number().min(1, { message: "Duration must be at least 1 second" }),
});

export type UpdateEpisodeFormInputs = z.infer<typeof updateEpisodeSchema>;
