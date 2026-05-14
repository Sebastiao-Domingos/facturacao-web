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

// Resposta Paginada do Django
export interface PaginatedResponse<T> {
  links: {
    next: string | null;
    previous: string | null;
  };
  total_itens: number;
  total_paginas: number;
  pagina_atual: number;
  results: T[];
}
