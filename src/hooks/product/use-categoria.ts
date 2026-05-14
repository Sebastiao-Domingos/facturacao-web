// src/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "@/src/types";
import { Categoria } from "@/src/schemas/product-schema";
import { CategoriaService } from "@/src/services/faturacao/categoria";

const service = new CategoriaService();

export function useCategorias({
  page,
  search,
}: { page?: number; search?: string } = {}) {
  return useQuery<PaginatedResponse<Categoria>>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await service.getCategorias();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}
