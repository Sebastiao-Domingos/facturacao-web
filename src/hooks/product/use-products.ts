// src/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query";
import { ProdutoService } from "@/src/services/faturacao/produto";
import { PaginatedResponse } from "@/src/types";
import { Product } from "@/src/schemas/product-schema";

const service = new ProdutoService();

export function useProducts({
  page,
  search,
}: { page?: number; search?: string } = {}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await service.getProdutos({ page, search });
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}
