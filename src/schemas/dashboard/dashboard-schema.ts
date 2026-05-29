// src/schemas/empresa/dashboard/dashboard-schema.ts
import { z } from "zod";

// ============ KPI ============
export const KPISchema = z.object({
  faturacao_mes: z.number(),
  faturacao_ano: z.number(),
  variacao_mensal: z.number(),
  total_clientes: z.number(),
  total_produtos: z.number(),
  total_funcionarios: z.number(),
  total_filiais: z.number(),
  produtos_stock_baixo: z.number(),
  produtos_esgotados: z.number(),
});

export type KPI = z.infer<typeof KPISchema>;

// ============ Venda por Período ============
export const VendaPeriodoSchema = z.object({
  periodo: z.string(),
  total: z.number(),
  quantidade: z.number(),
});

export type VendaPeriodo = z.infer<typeof VendaPeriodoSchema>;

// ============ Top Produto ============
export const TopProdutoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  codigo: z.string(),
  total_vendido: z.number(),
  quantidade: z.number(),
  imagem: z.string().nullable(),
});

export type TopProduto = z.infer<typeof TopProdutoSchema>;

// ============ Alerta Stock ============
export const AlertaStockSchema = z.object({
  id: z.string(),
  produto_nome: z.string(),
  produto_codigo: z.string(),
  filial_nome: z.string(),
  quantidade_atual: z.number(),
  stock_minimo: z.number(),
  status: z.enum(["STOCK_MINIMO", "ESGOTADO"]),
});

export type AlertaStock = z.infer<typeof AlertaStockSchema>;

// ============ Movimentação Recente ============
export const MovimentacaoRecenteSchema = z.object({
  id: z.string(),
  produto_nome: z.string(),
  filial_nome: z.string(),
  tipo: z.enum(["E", "S"]),
  tipo_display: z.string(),
  quantidade: z.number(),
  data: z.string(),
  operador: z.string().nullable(),
});

export type MovimentacaoRecente = z.infer<typeof MovimentacaoRecenteSchema>;

// ============ Resumo Filial ============
export const ResumoFilialSchema = z.object({
  id: z.string(),
  nome: z.string(),
  total_faturado: z.number(),
  total_clientes: z.number(),
  total_funcionarios: z.number(),
  total_produtos_stock: z.number(),
});

export type ResumoFilial = z.infer<typeof ResumoFilialSchema>;

// ============ Dashboard Completo ============
export const DashboardDataSchema = z.object({
  kpis: KPISchema,
  vendas_ultimos_12_meses: z.array(VendaPeriodoSchema),
  top_produtos: z.array(TopProdutoSchema),
  alertas_stock: z.array(AlertaStockSchema),
  ultimas_movimentacoes: z.array(MovimentacaoRecenteSchema),
  resumo_filiais: z.array(ResumoFilialSchema),
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;

// ============ Filtros ============
export const DashboardFiltersSchema = z.object({
  filial: z.string().optional(),
  periodo: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
});

export type DashboardFilters = z.infer<typeof DashboardFiltersSchema>;

// ============ CONSTANTES PARA UI ============
export const statusConfig = {
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
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

export const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat("pt-AO").format(valor);
};

export const getStatusInfo = (status: "STOCK_MINIMO" | "ESGOTADO") => {
  return statusConfig[status];
};

export const getTipoMovimentacaoInfo = (tipo: "E" | "S") => {
  return tipoMovimentacaoConfig[tipo];
};

export const formatarVariacao = (variacao: number): string => {
  const sinal = variacao > 0 ? "+" : "";
  return `${sinal}${variacao.toFixed(1)}%`;
};

// ============ RELATÓRIO DE VENDAS POR PERÍODO ============
export const VendaPeriodoFlexivelSchema = z.object({
  periodo: z.string(),
  total: z.number(),
  quantidade: z.number(),
});
export type VendaPeriodoFlexivel = z.infer<typeof VendaPeriodoFlexivelSchema>;

// ============ RELATÓRIO DE PRODUTOS ============
export const RelatorioProdutoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  codigo: z.string(),
  quantidade: z.number(),
  total_vendido: z.number(),
  valor_iva: z.number(),
});
export type RelatorioProduto = z.infer<typeof RelatorioProdutoSchema>;

// ============ RELATÓRIO DE CLIENTES ============
export const RelatorioClienteSchema = z.object({
  id: z.string(),
  nome: z.string(),
  nif: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  total_compras: z.number(),
  quantidade_documentos: z.number(),
});
export type RelatorioCliente = z.infer<typeof RelatorioClienteSchema>;
