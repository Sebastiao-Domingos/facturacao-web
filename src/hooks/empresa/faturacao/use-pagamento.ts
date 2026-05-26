// src/hooks/empresa/use-pagamento.ts
import { documentoService } from "@/src/services/faturacao/documento-service";
import { useQuery } from "@tanstack/react-query";

export const pagamentoKeys = {
  all: ["pagamentos"] as const,
  lists: () => [...pagamentoKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...pagamentoKeys.lists(), filters] as const,
};

export const usePagamentos = (filters?: {
  documento?: string;
  metodo?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: pagamentoKeys.list(filters || {}),
    queryFn: () => documentoService.getPagamentos(filters),
  });
};
