// src/hooks/empresa/use-documento.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { documentoService } from "../../services/faturacao/documento-service";
import {
  DocumentoCreate,
  DocumentoResponse,
  DocumentoList,
} from "../../schemas/empresa/faturacao/documento-schema";
import {
  PagamentoCreate,
  PagamentoResponse,
} from "@/src/schemas/empresa/faturacao/pagamento-schema";

export const documentoKeys = {
  all: ["documentos"] as const,
  lists: () => [...documentoKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...documentoKeys.lists(), filters] as const,
  details: () => [...documentoKeys.all, "detail"] as const,
  detail: (id: string) => [...documentoKeys.details(), id] as const,
};

// Hook para listar documentos
export const useDocumentos = (filters?: {
  tipo?: string;
  estado?: string;
  cliente?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  page_size?: number;
}): UseQueryResult<{ results: DocumentoList[]; count: number }> => {
  return useQuery({
    queryKey: documentoKeys.list(filters),
    queryFn: () => documentoService.listar(filters),
  });
};

// Hook para buscar documento por ID
export const useDocumento = (id: string): UseQueryResult<DocumentoResponse> => {
  return useQuery({
    queryKey: documentoKeys.detail(id),
    queryFn: () => documentoService.getById(id),
    enabled: !!id,
  });
};

// Hook para mutations
export const useDocumentoMutations = () => {
  const queryClient = useQueryClient();

  const createMutation: UseMutationResult<
    DocumentoResponse,
    Error,
    DocumentoCreate
  > = useMutation({
    mutationFn: (data: DocumentoCreate) => documentoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentoKeys.lists() });
      toast.success("Documento criado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao criar documento";
      toast.error(message);
    },
  });

  const emitirMutation: UseMutationResult<DocumentoResponse, Error, string> =
    useMutation({
      mutationFn: (id: string) => documentoService.emitir(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: documentoKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: documentoKeys.lists() });
        toast.success("Documento emitido com sucesso!");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao emitir documento";
        toast.error(message);
      },
    });

  const anularMutation: UseMutationResult<DocumentoResponse, Error, string> =
    useMutation({
      mutationFn: (id: string) => documentoService.anular(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: documentoKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: documentoKeys.lists() });
        toast.success("Documento anulado com sucesso!");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao anular documento";
        toast.error(message);
      },
    });

  const pagamentoMutation: UseMutationResult<
    PagamentoResponse,
    Error,
    { id: string; data: PagamentoCreate }
  > = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PagamentoCreate }) =>
      documentoService.registrarPagamento(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: documentoKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: documentoKeys.lists() });
      toast.success("Pagamento registado com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao registar pagamento";
      toast.error(message);
    },
  });

  const downloadPdfMutation: UseMutationResult<Blob, Error, string> =
    useMutation({
      mutationFn: (id: string) => documentoService.downloadPdf(id),
      onSuccess: (data, id) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `documento_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("PDF descarregado com sucesso!");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "Erro ao descarregar PDF";
        toast.error(message);
      },
    });

  return {
    createMutation,
    emitirMutation,
    anularMutation,
    pagamentoMutation,
    downloadPdfMutation,
  };
};
