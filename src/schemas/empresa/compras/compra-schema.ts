// src/schemas/empresa/compras/compra-schema.ts
import { z } from "zod";

export const LinhaCompraSchema = z.object({
  produto_id: z.string().uuid(),
  quantidade: z.number().positive(),
  preco_unitario: z.number().positive(),
});
export type LinhaCompra = z.infer<typeof LinhaCompraSchema>;

export const CompraCreateSchema = z.object({
  fornecedor_id: z.string().uuid(),
  filial_id: z.string().uuid(),
  observacao: z.string().optional(),
  linhas: z.array(LinhaCompraSchema).min(1),
});
export type CompraCreate = z.infer<typeof CompraCreateSchema>;

export const CompraResponseSchema = z.object({
  id: z.string().uuid(),
  fornecedor: z.object({ id: z.string().uuid(), nome: z.string() }),
  filial: z.object({ id: z.string().uuid(), nome: z.string() }),
  data_compra: z.string(),
  estado: z.enum(["RASCUNHO", "CONFIRMADA", "CANCELADA"]),
  total: z.number(),
  observacao: z.string().nullable(),
  linhas: z.array(
    z.object({
      id: z.string().uuid(),
      produto: z.string().uuid(),
      produto_nome: z.string(),
      produto_codigo: z.string().nullable(),
      quantidade: z.number(),
      preco_unitario: z.number(),
      total: z.number(),
    }),
  ),
});
export type CompraResponse = z.infer<typeof CompraResponseSchema>;

export const CompraListSchema = z.object({
  id: z.string().uuid(),
  fornecedor_nome: z.string(),
  filial_nome: z.string(),
  data_compra: z.string(),
  estado: z.enum(["RASCUNHO", "CONFIRMADA", "CANCELADA"]),
  total: z.number(),
});
export type CompraList = z.infer<typeof CompraListSchema>;
