export interface Categoria {
  id: string;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
  user: string;
  filial_nome: string;
  preco_venda: number;
  imagem: string | null;
  thumbnail: string | null;
  codigo_barras: string;
  papel?: string;
  ativo: boolean;
  categoria_detalhes?: Categoria;
}

export interface PaginatedResponse<T> {
  links: { next: string | null; previous: string | null };
  total_itens: number;
  total_paginas: number;
  pagina_atual: number;
  results: T[];
}
