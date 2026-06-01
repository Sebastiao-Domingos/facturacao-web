import { Empresa } from "@/src/schemas/empresa/empresa-schema";
import { EmpresaService } from "@/src/services/empresa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new EmpresaService();

export function useEmpres() {
  return useQuery({
    queryKey: ["empresa"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useEmpresaMutations() {
  const queryClient = useQueryClient();

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: string }) =>
      service.update({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresa"] });
      toast.success("Empresa atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar a Empresa!", {
        description: error.message,
      });
    },
  });

  return { updateMutation };
}

// src/hooks/empresa/use-empresa.ts

export const empresaKeys = {
  me: () => ["empresa", "me"] as const,
};

export const useMinhaEmpresa = () => {
  return useQuery({
    queryKey: empresaKeys.me(),
    queryFn: () => service.getMinhaEmpresa(),
  });
};
