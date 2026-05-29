// src/schemas/empresa/afilias/funcionario-schema.ts
import { z } from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";
import { AfiliasSchema } from "../afilias/afilia-schema";

// ============ RESPONSE SCHEMA ============
export const FuncionarioResponseSchema = z.object({
  id: z.string().uuid(),
  user: z.string().uuid(),
  user_name: z.string(),
  first_name_read: z.string(),
  last_name_read: z.string(),
  nome_completo: z.string(),
  user_email: z.string().email(),
  telemovel: z.string(),
  bi: z.string(),
  cargo: z.string(),
  papel: z.string(),
  filial_detalhes: AfiliasSchema.optional(),
  filial_nome: z.string(),
  empresa_nome: z.string(),
  ativo: z.boolean(),
  endereco: EnderecoSchema.nullable().optional(), // pode ser null ou objecto
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_active: z.boolean(),
  status_display: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
});

export type FuncionarioResponse = z.infer<typeof FuncionarioResponseSchema>;

// ============ LIST SCHEMA (simplificado para listagem) ============
export const FuncionarioListSchema = FuncionarioResponseSchema.pick({
  id: true,
  nome_completo: true,
  email: true,
  bi: true,
  cargo: true,
  papel: true,
  ativo: true,
  telemovel: true,
  filial_nome: true,
  created_at: true,
  status_display: true,
});

export type FuncionarioList = z.infer<typeof FuncionarioListSchema>;
