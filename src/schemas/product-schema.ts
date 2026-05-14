// src/schemas/product-schema.ts
import { z } from "zod";

// Detalhes aninhados que vêm do Django
export const CategoriaDetalhesSchema = z.object({
  id: z.uuid().nullable(),
  nome: z.string(),
  descricao: z.string(),
});

const UnidadeDetalhesSchema = z.object({
  id: z.uuid(),
  sigla: z.string(),
  nome: z.string(),
});

// O Produto Real
export const productSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  tipo: z.string(),
  categoria: z.string(),
  unidade_medida: z.string(),
  taxa_iva: z.string(),
  imagem: z.instanceof(File).optional().or(z.url().optional()),
  thumbnail: z.url().nullable(),
  preco_venda: z.string(), // Django manda como string "123000.00"
  codigo_barras: z.string().nullable(),
  ref_interna: z.string(),
  ativo: z.boolean(),
  categoria_detalhes: CategoriaDetalhesSchema,
  unidade_detalhes: UnidadeDetalhesSchema,
  // ... podes adicionar taxa_detalhes se precisares na UI
});

export type Product = z.infer<typeof productSchema>;

export type ProductValues = z.infer<typeof productSchema>;

export type Categoria = z.infer<typeof CategoriaDetalhesSchema>;

export type Unidade = z.infer<typeof UnidadeDetalhesSchema>;

export const productSchemaCreate = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().nullable().optional(),
  imagem: z.instanceof(File).optional().or(z.string().optional()),
  categoria: z.string().nullable().optional(),
  unidade_medida: z.string().nullable().optional(),
  taxa_iva: z.number().nullable().optional(),
  preco_venda: z.number().nullable().optional(),
  ref_interna: z.string().optional(),
  ativo: z.boolean(),
});

// Tipo derivado automaticamente do Zod (melhor prática)
export type ProductFormData = z.infer<typeof productSchemaCreate>;

// Resposta Paginada do Django
