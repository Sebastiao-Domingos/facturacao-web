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

export const EstadoDocumentoEnum = z.enum([
  "RASCUNHO",
  "EMITIDA",
  "PARCIALMENTE_PAGA",
  "PAGA",
  "ANULADA",
  "VENCIDA",
]);
export type EstadoDocumento = z.infer<typeof EstadoDocumentoEnum>;

// Helper para converter string/numero para number
const stringToNumber = z.preprocess((val) => {
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === "number") return val;
  return 0;
}, z.number());

// Helper para converter string undefined/null para string vazia
const stringOrNull = z.preprocess((val) => {
  if (val === null || val === undefined) return "";
  return String(val);
}, z.string());

// ============ LINHA DO DOCUMENTO (criação) ============
export const LinhaDocumentoSchema = z.object({
  id: z.string().uuid().optional(),
  produto: z.string().min(1, "Produto é obrigatório"),
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
  produto: string;
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

// Schema da linha na resposta (campo "produto" não "produto_id")
export const LinhaDocumentoResponseSchema = z.object({
  id: z.string().uuid(),
  produto: z.string().uuid(), // ← campo correto
  descricao: z.string(),
  produto_codigo: z.string().nullable(),
  quantidade: stringToNumber,
  preco_unitario: stringToNumber,
  desconto_pct: stringToNumber,
  taxa_iva: stringToNumber,
  subtotal: stringToNumber,
  valor_iva: stringToNumber,
  total: stringToNumber,
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
  subtotal: stringToNumber,
  total_iva: stringToNumber,
  total: stringToNumber,
  total_pago: stringToNumber,
  saldo_pendente: stringToNumber,
  data_emissao: z.string(),
  data_vencimento: z.string().nullable(),
  observacao: z.string().nullable(),
  linhas: z.array(LinhaDocumentoResponseSchema),
  pagamentos: z
    .array(
      z.object({
        id: z.string().uuid(),
        valor: stringToNumber,
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
  total: stringToNumber,
  total_pago: stringToNumber,
  saldo_pendente: stringToNumber,
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
