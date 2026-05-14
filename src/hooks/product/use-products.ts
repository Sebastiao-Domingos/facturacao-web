// src/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query";
import { ProdutoService } from "@/src/services/faturacao/produto";
import { PaginatedResponse } from "@/src/types";
import { Product } from "@/src/schemas/product-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Ou o teu componente de notificação

const service = new ProdutoService();

// src/hooks/product/use-products.ts (Adicionar isto)

export function useProductMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newProduct: Product) => service.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar produto."),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto deletado!");
    },
  });

  return { createMutation, updateMutation };
}

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
