// src/hooks/use-products.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/src/types";
import { Categoria } from "@/src/schemas/product-schema";
import { CategoriaService } from "@/src/services/faturacao/categoria";
import { toast } from "sonner";

const service = new CategoriaService();

export function useCategorias({
  page,
  search,
}: { page?: number; search?: string } = {}) {
  return useQuery<PaginatedResponse<Categoria>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newCategory: Categoria) => service.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: () => toast.error("Erro ao criar a categoria."),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Categoria }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria deletado!");
    },
  });

  return { createMutation, updateMutation };
}
