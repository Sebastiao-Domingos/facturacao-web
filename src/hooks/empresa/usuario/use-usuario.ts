// src/hooks/empresa/use-users.ts
import { userService } from "@/src/services/empresa/usuarios/user-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
};

export const useUsers = (filters?: {
  search?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userService.list(filters),
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ newPassword }: { newPassword: string }) =>
      userService.resetPassword(newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Palavra-passe alterada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erro ao alterar palavra-passe",
      );
    },
  });
};
