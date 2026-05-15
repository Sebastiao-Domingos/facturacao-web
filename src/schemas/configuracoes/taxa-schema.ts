import z from "zod";

export const TaxaSchema = z.object({
  id: z.uuid().optional(),
  codigo: z.string(),
  valor: z.string(),
  descricao: z.string().refine((value) => {
    return value.length > 0;
  }, "A descrição é obrigatória"),
  motivo_isencao: z.string().nullable(),
  codigo_isencao_agt: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Taxa = z.infer<typeof TaxaSchema>;
