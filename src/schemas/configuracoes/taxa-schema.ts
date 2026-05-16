import z from "zod";

export const TaxaSchema = z.object({
  id: z.uuid().optional(),
  codigo: z.string().min(3, "No mínimo 3 caracteres!"),
  valor: z.string().or(z.number()),
  descricao: z.string().refine((value) => {
    return value.length > 5;
  }, "A descrição é obrigatória"),
  motivo_isencao: z.string().optional(),
  codigo_isencao_agt: z
    .string()
    .max(10, "No máximo só pode ter 10 caracteres!")
    .optional(),
});

export type Taxa = z.infer<typeof TaxaSchema>;
