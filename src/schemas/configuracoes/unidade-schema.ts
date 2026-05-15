import z from "zod";

export const UnidadeSchema = z.object({
  id: z.uuid().optional(),
  sigla: z.string(),
  nome: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Unidade = z.infer<typeof UnidadeSchema>;
