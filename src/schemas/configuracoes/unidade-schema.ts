import z from "zod";

export const UnidadeSchema = z.object({
  id: z.uuid().optional(),
  sigla: z
    .string()
    .min(1, "No mínimo 1 caracter!")
    .max(5, "No máximo 5 caracteres"),
  nome: z
    .string()
    .min(2, "No mínimo 2 caracteres")
    .max(20, "No máximo 20 caracteres"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Unidade = z.infer<typeof UnidadeSchema>;
