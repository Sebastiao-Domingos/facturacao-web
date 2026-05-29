// src/schemas/empresa/compras/fornecedor-schema.ts
import { z } from "zod";

export const FornecedorSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome obrigatório"),
  nif: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  telefone: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  observacao: z.string().optional().nullable(),
  ativo: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Fornecedor = z.infer<typeof FornecedorSchema>;

export const FornecedorListSchema = FornecedorSchema.pick({
  id: true,
  nome: true,
  nif: true,
  email: true,
  telefone: true,
  ativo: true,
});
export type FornecedorList = z.infer<typeof FornecedorListSchema>;
