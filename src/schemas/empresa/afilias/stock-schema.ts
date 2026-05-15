import z from "zod";

export const StockSchema = z.object({
  id: z.uuid().optional(),
  produto: z.uuid(),
  produto_nome: z.string(),
  codigo_barras: z.string(),
  filial: z.uuid(),
  filial_nome: z.string(),
  quantidade: z.string(),
  stock_minimo: z.string(),
  localizacao: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Stock = z.infer<typeof StockSchema>;
