import {
  Funcionario,
  FuncionarioCreate,
} from "@/src/schemas/empresa/afilias/funcionario-schema";
import { FuncionarioService } from "@/src/services/empresa/funcionario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const service = new FuncionarioService();

export function useFuncionario() {
  return useQuery({
    queryKey: ["funcionarios"],
    queryFn: async () => {
      const response = await service.get();
      return response;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
  });
}

export function useFuncionarioMutations() {
  const queryClient = useQueryClient();

  // Criar Produto
  const createMutation = useMutation({
    mutationFn: (newData: Funcionario) => service.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionario criado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar o Funcionario.", {
        description: error.message,
      }),
  });

  // Atualizar Produto
  const updateMutation = useMutation({
    mutationFn: ({ data }: { data: Funcionario }) => service.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionario atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar o Funcionario!", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionario Eliminado!");
    },
    onError: (error) => {
      toast.error("Erro ao eliminar o Funcionario!", {
        description: error.message,
      });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
