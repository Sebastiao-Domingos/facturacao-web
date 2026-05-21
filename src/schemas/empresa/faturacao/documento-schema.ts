import { z } from "zod";

// ============ ENUMS ============
export const TipoDocumentoEnum = z.enum([
  "FACTURA",
  "PRO_FORMA",
  "NOTA_CREDITO",
  "NOTA_DEBITO",
  "RECIBO",
]);
export type TipoDocumento = z.infer<typeof TipoDocumentoEnum>;

// ... resto do código mantém igual

export const EstadoDocumentoEnum = z.enum([
  "RASCUNHO",
  "EMITIDA",
  "PARCIALMENTE_PAGA",
  "PAGA",
  "ANULADA",
  "VENCIDA",
]);
export type EstadoDocumento = z.infer<typeof EstadoDocumentoEnum>;

// ============ LINHA DO DOCUMENTO - TODOS OS CAMPOS OBRIGATÓRIOS ============
export const LinhaDocumentoSchema = z.object({
  id: z.string().uuid().optional(),
  produto_id: z.string().min(1, "Produto é obrigatório"),
  descricao: z.string().optional(),
  quantidade: z.number().positive("Quantidade deve ser maior que zero"),
  preco_unitario: z.number().positive("Preço deve ser maior que zero"),
  desconto_pct: z.number().min(0).max(100).default(0),
  taxa_iva: z.number().min(0).max(100).default(14),
  subtotal: z.number().optional(),
  valor_iva: z.number().optional(),
  total: z.number().optional(),
});

export type LinhaDocumento = z.infer<typeof LinhaDocumentoSchema>;

// ============ TIPO PARA O FORMULÁRIO (COM CAMPOS OPCIONAIS) ============
export type LinhaFormData = {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  desconto_pct?: number;
  taxa_iva?: number;
};

// ============ CRIAÇÃO DE DOCUMENTO ============
export const DocumentoCreateSchema = z.object({
  cliente_id: z.string().min(1, "Cliente é obrigatório"),
  filial_id: z.string().min(1, "Filial é obrigatória"),
  tipo: TipoDocumentoEnum,
  data_vencimento: z.string().optional(),
  observacao: z.string().optional(),
  linhas: z.array(LinhaDocumentoSchema).min(1, "Adicione pelo menos um item"),
});

export type DocumentoCreate = z.infer<typeof DocumentoCreateSchema>;

// ============ RESPOSTA DA API ============
export const ClienteInfoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  nif: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
});

export const FilialInfoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const LinhaDocumentoResponseSchema = z.object({
  id: z.string().uuid(),
  produto_id: z.string().uuid(),
  descricao: z.string(),
  produto_codigo: z.string().nullable(),
  quantidade: z.number(),
  preco_unitario: z.number(),
  desconto_pct: z.number(),
  taxa_iva: z.number(),
  subtotal: z.number(),
  valor_iva: z.number(),
  total: z.number(),
});

export const DocumentoResponseSchema = z.object({
  id: z.string().uuid(),
  numero: z.string(),
  tipo: TipoDocumentoEnum,
  tipo_display: z.string(),
  estado: EstadoDocumentoEnum,
  estado_display: z.string(),
  cliente: ClienteInfoSchema,
  filial: FilialInfoSchema,
  subtotal: z.number(),
  total_iva: z.number(),
  total: z.number(),
  total_pago: z.number(),
  saldo_pendente: z.number(),
  data_emissao: z.string(),
  data_vencimento: z.string().nullable(),
  observacao: z.string().nullable(),
  linhas: z.array(LinhaDocumentoResponseSchema),
  pagamentos: z
    .array(
      z.object({
        id: z.string().uuid(),
        valor: z.number(),
        metodo: z.string(),
        metodo_display: z.string(),
        referencia: z.string().nullable(),
        data_pagamento: z.string(),
        operador_nome: z.string(),
      }),
    )
    .optional(),
  created_at: z.string(),
});

export type DocumentoResponse = z.infer<typeof DocumentoResponseSchema>;

// ============ LISTAGEM (SIMPLIFICADA) ============
export const DocumentoListSchema = z.object({
  id: z.string().uuid(),
  numero: z.string(),
  tipo: TipoDocumentoEnum,
  tipo_display: z.string(),
  estado: EstadoDocumentoEnum,
  estado_display: z.string(),
  cliente: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    nif: z.string().nullable(),
  }),
  filial: z.object({
    id: z.string().uuid(),
    nome: z.string(),
  }),
  total: z.number(),
  total_pago: z.number(),
  saldo_pendente: z.number(),
  data_emissao: z.string(),
});

export type DocumentoList = z.infer<typeof DocumentoListSchema>;

// ============ HELPER FUNCTIONS ============
export const getEstadoColor = (estado: EstadoDocumento): string => {
  const cores: Record<EstadoDocumento, string> = {
    RASCUNHO: "bg-gray-500",
    EMITIDA: "bg-blue-500",
    PARCIALMENTE_PAGA: "bg-yellow-500",
    PAGA: "bg-green-500",
    ANULADA: "bg-red-500",
    VENCIDA: "bg-orange-500",
  };
  return cores[estado];
};

export const getEstadoLabel = (estado: EstadoDocumento): string => {
  const labels: Record<EstadoDocumento, string> = {
    RASCUNHO: "Rascunho",
    EMITIDA: "Emitida",
    PARCIALMENTE_PAGA: "Parcialmente Paga",
    PAGA: "Paga",
    ANULADA: "Anulada",
    VENCIDA: "Vencida",
  };
  return labels[estado];
};

export const formatarNumeroDocumento = (numero: string): string => {
  return numero;
};
