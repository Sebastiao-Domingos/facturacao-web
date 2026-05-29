import z from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";

export const AfiliasSchema = z.object({
  id: z.uuid().optional(),
  empresa_nome: z.string().optional(),
  endereco: EnderecoSchema,
  nome: z.string().min(3, "No mínimo 3 caracteres"),
  codigo_agt: z
    .string()
    .max(15, "No máximo 15 caracteres")
    .min(3, "No mínimo 3 caracteres"),
  e_sede: z.boolean(),
  serie_documentos: z
    .string()
    .min(1, "No mínimo 1 caracter")
    .max(5, "No máximo 5 caracteres"),
  empresa: z.uuid().optional(),
  created_at: z.date().or(z.string()).optional(),
  updated_at: z.date().or(z.string()).optional(),
});

export const AfiliasSchemaDetalhes = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  codigo_agt: z.string(),
  e_sede: z.boolean(),
  serie_documentos: z.string(),
  endereco: EnderecoSchema,

  ativo: z.boolean(),
  empresa: z.string().uuid(),
  empresa_nome: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  // Campos de métricas (retornados no detalhe)
  total_funcionarios: z.number().optional(),
  funcionarios_ativos: z.number().optional(),
  total_produtos_stock: z.number().optional(),
  produtos_com_stock_minimo: z.number().optional(),
  produtos_esgotados: z.number().optional(),
  valor_total_stock: z.number().optional(),
  funcionarios: z.array(z.any()).optional(),
  stocks: z.array(z.any()).optional(),
});

export type Afilias = z.infer<typeof AfiliasSchema>;

// Para listagem (resumo)
export const AfiliasListSchema = AfiliasSchemaDetalhes.pick({
  id: true,
  nome: true,
  codigo_agt: true,
  e_sede: true,
  ativo: true,
  empresa_nome: true,
  total_funcionarios: true,
  created_at: true,
});

export type AfiliasList = z.infer<typeof AfiliasListSchema>;

export type AfiliasDetalhes = z.infer<typeof AfiliasSchemaDetalhes>;
