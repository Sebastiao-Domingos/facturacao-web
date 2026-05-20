// src/schemas/empresa/afilias/stock-schema.ts
import { z } from "zod";

// ============ ENUMS ============
export const TipoMovimentacaoEnum = z.enum(["E", "S"]);
export type TipoMovimentacao = z.infer<typeof TipoMovimentacaoEnum>;

export const StatusStockEnum = z.enum(["NORMAL", "STOCK_MINIMO", "ESGOTADO"]);
export type StatusStock = z.infer<typeof StatusStockEnum>;

// ============ PRODUTO (aninhado) ============
export const StockProdutoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  codigo: z.string(),
  preco_venda: z.number().nonnegative(),
});

export type StockProduto = z.infer<typeof StockProdutoSchema>;

// ============ FILIAL (aninhada) ============
export const StockFilialSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, "Nome da filial é obrigatório"),
});

export type StockFilial = z.infer<typeof StockFilialSchema>;

// ============ STOCK ============
export const StockSchema = z.object({
  id: z.string().uuid(),
  produto: StockProdutoSchema,
  filial: StockFilialSchema,
  quantidade: z.string().regex(/^\d+(\.\d{1,3})?$/),
  stock_minimo: z.string().regex(/^\d+(\.\d{1,3})?$/),
  status_stock: StatusStockEnum,
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Stock = z.infer<typeof StockSchema>;

// ============ PAYLOAD DE MOVIMENTAÇÃO ============
export const MovimentacaoPayloadSchema = z.object({
  tipo: TipoMovimentacaoEnum,
  quantidade: z
    .number()
    .positive("A quantidade deve ser maior que zero")
    .max(999999.999, "Quantidade muito grande"),
  origem_destino: z
    .string()
    .min(3, "O motivo/justificação deve ter pelo menos 3 caracteres")
    .max(255, "O motivo/justificação deve ter no máximo 255 caracteres"),
});

export type MovimentacaoPayload = z.infer<typeof MovimentacaoPayloadSchema>;

// ============ OPERADOR DETALHES ============
export const OperadorDetalhesSchema = z
  .object({
    id: z.string().uuid(),
    nome: z.string(),
  })
  .nullable();

export type OperadorDetalhes = z.infer<typeof OperadorDetalhesSchema>;

// ============ MOVIMENTAÇÃO RESPONSE ============
export const MovimentacaoResponseSchema = z.object({
  id: z.string().uuid(),
  stock_filial: z.string().uuid(),
  tipo: TipoMovimentacaoEnum,
  tipo_display: z.string(),
  quantidade: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, "Formato de quantidade inválido"),
  origem_destino: z.string(),
  operador_detalhes: OperadorDetalhesSchema,
  data: z.string().datetime(),
});

export type MovimentacaoResponse = z.infer<typeof MovimentacaoResponseSchema>;

// ============ LISTA DE MOVIMENTAÇÕES (paginada) ============
export const MovimentacaoListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(MovimentacaoResponseSchema),
});

export type MovimentacaoListResponse = z.infer<
  typeof MovimentacaoListResponseSchema
>;

// ============ FILTROS ============
export const StockFiltersSchema = z.object({
  filial: z.string().uuid().optional(),
  produto: z.string().uuid().optional(),
  status: StatusStockEnum.optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  page_size: z.number().int().positive().max(100).default(20),
});

export type StockFilters = z.infer<typeof StockFiltersSchema>;

// ============ DADOS PARA FORMULÁRIO ============
// src/schemas/empresa/afilias/stock-schema.ts

// ... resto do código ...

// ============ DADOS PARA FORMULÁRIO ============
// ✅ CORRIGIDO: tipo é obrigatório
export const MovimentacaoFormSchema = z.object({
  tipo: z.enum(["E", "S"]),
  quantidade: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .regex(/^\d+(\.\d{1,3})?$/, "Use até 3 casas decimais (ex: 1.500)"),
  origem_destino: z
    .string()
    .min(3, "Motivo é obrigatório")
    .max(255, "Máximo 255 caracteres"),
});

export type MovimentacaoFormData = z.infer<typeof MovimentacaoFormSchema>;

// ============ VALORES PADRÃO ============
export const defaultMovimentacaoForm: MovimentacaoFormData = {
  tipo: "E",
  quantidade: "",
  origem_destino: "",
};

// ... resto do código ...

// ============ CONSTANTES PARA UI ============
export const statusConfig = {
  NORMAL: {
    label: "Normal",
    variant: "default",
    color: "bg-green-500",
    icon: "✅",
  },
  STOCK_MINIMO: {
    label: "Stock Mínimo",
    variant: "warning",
    color: "bg-yellow-500",
    icon: "⚠️",
  },
  ESGOTADO: {
    label: "Esgotado",
    variant: "destructive",
    color: "bg-red-500",
    icon: "❌",
  },
} as const;

export const tipoMovimentacaoConfig = {
  E: {
    label: "Entrada",
    icon: "▲",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  S: {
    label: "Saída",
    icon: "▼",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
} as const;

// ============ HELPER FUNCTIONS ============
export const formatQuantidade = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0,000";
  return num.toFixed(3).replace(".", ",");
};

export const parseQuantidade = (value: string): number => {
  return parseFloat(value.replace(",", "."));
};

export const getStatusInfo = (status: StatusStock) => {
  return statusConfig[status] || statusConfig.NORMAL;
};

export const getTipoMovimentacaoInfo = (tipo: TipoMovimentacao) => {
  return tipoMovimentacaoConfig[tipo];
};

export const validarQuantidadeDisponivel = (
  quantidade: number,
  disponivel: number,
): boolean => {
  return quantidade <= disponivel;
};
