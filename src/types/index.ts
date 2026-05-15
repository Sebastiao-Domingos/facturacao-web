export interface PaginatedResponse<T> {
  links: { next: string | null; previous: string | null };
  total_itens: number;
  total_paginas: number;
  pagina_atual: number;
  results: T[];
}
