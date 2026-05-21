// src/schemas/empresa/facturacao/pagamento-schema.ts
import { z } from "zod";

export const MetodoPagamentoEnum = z.enum([
  "DINHEIRO",
  "MULTICAIXA",
  "TRANSFERENCIA",
  "CHEQUE",
  "OUTRO",
]);
export type MetodoPagamento = z.infer<typeof MetodoPagamentoEnum>;

export const PagamentoCreateSchema = z.object({
  documento_id: z.string().uuid(),
  valor: z.number().positive("Valor deve ser maior que zero"),
  metodo: MetodoPagamentoEnum,
  referencia: z.string().optional(),
});

export type PagamentoCreate = z.infer<typeof PagamentoCreateSchema>;

export const PagamentoResponseSchema = z.object({
  id: z.string().uuid(),
  documento_id: z.string().uuid(),
  valor: z.number(),
  metodo: MetodoPagamentoEnum,
  metodo_display: z.string(),
  referencia: z.string().nullable(),
  data_pagamento: z.string(),
  operador: z.object({
    id: z.string().uuid(),
    nome: z.string(),
  }),
});

export type PagamentoResponse = z.infer<typeof PagamentoResponseSchema>;

export const metodoPagamentoConfig: Record<
  MetodoPagamento,
  { label: string; icon: string }
> = {
  DINHEIRO: { label: "Dinheiro", icon: "💰" },
  MULTICAIXA: { label: "Multicaixa", icon: "💳" },
  TRANSFERENCIA: { label: "Transferência Bancária", icon: "🏦" },
  CHEQUE: { label: "Cheque", icon: "📝" },
  OUTRO: { label: "Outro", icon: "📦" },
};
