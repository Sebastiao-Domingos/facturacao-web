// src/schemas/organizacao/user-schema.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nome_completo: z.string(),
  is_active: z.boolean(),
  last_login: z.string().nullable(),
  date_joined: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const ResetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, "A palavra-passe deve ter no mínimo 8 caracteres"),
});
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
