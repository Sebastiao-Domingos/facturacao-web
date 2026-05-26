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

// ✅ Remove o campo documento (não é enviado no body)
export const PagamentoCreateSchema = z.object({
  valor: z.number().positive("Valor deve ser maior que zero"),
  metodo: MetodoPagamentoEnum,
  referencia: z.string().optional(),
});

export type PagamentoCreate = z.infer<typeof PagamentoCreateSchema>;

// src/schemas/empresa/facturacao/pagamento-schema.ts

export const PagamentoResponseSchema = z.object({
  id: z.string().uuid(),
  valor: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number(),
  ),
  metodo: MetodoPagamentoEnum,
  metodo_display: z.string(),
  referencia: z.string().nullable(),
  data_pagamento: z.string(),
  operador: z.string().uuid(),
  operador_nome: z.string(),
  // documento não está presente na resposta de criação
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

// src/schemas/empresa/faturacao/pagamento-schema.ts

export const PagamentoListSchema = z.object({
  id: z.string().uuid(),
  documento_id: z.string().uuid(),
  documento_numero: z.string(),
  documento_cliente_nome: z.string(),
  valor: z.number(),
  metodo: MetodoPagamentoEnum,
  metodo_display: z.string(),
  referencia: z.string().nullable(),
  data_pagamento: z.string(),
  operador_nome: z.string(),
  // campos adicionais que podem ser úteis (opcionais)
  filial_nome: z.string().optional(),
  cliente_nif: z.string().optional(),
  filial_id: z.string().uuid().optional(),
});

export type PagamentoList = z.infer<typeof PagamentoListSchema>;
