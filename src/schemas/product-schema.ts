// src/schemas/product-schema.ts
import { z } from "zod";

// Detalhes aninhados que vêm do Django
const CategoriaDetalhesSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  descricao: z.string().nullable(),
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
  imagem: z.url().nullable(),
  thumbnail: z.url().nullable(),
  preco_venda: z.string(), // Django manda como string "123000.00"
  codigo_barras: z.string().nullable(),
  ref_interna: z.string().nullable(),
  ativo: z.boolean(),
  categoria_detalhes: CategoriaDetalhesSchema,
  unidade_detalhes: UnidadeDetalhesSchema,
  // ... podes adicionar taxa_detalhes se precisares na UI
});

export type Product = z.infer<typeof productSchema>;

export type Categoria = z.infer<typeof CategoriaDetalhesSchema>;

export type Unidade = z.infer<typeof UnidadeDetalhesSchema>;

// Resposta Paginada do Django
