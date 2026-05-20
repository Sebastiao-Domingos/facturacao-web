// src/hooks/empresa/use-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/src/services/empresa/dashboard-service";
import { DashboardFilters } from "../../schemas/dashboard/dashboard-schema";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  detail: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "detail", filters] as const,
  kpis: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "kpis", filters] as const,
  vendas: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "vendas", filters] as const,
  topProdutos: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "top-produtos", filters] as const,
  alertas: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "alertas", filters] as const,
  movimentacoes: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, "movimentacoes", filters] as const,
  resumoFiliais: () => [...dashboardKeys.all, "resumo-filiais"] as const,
};

// Hook para dashboard completo
export const useDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: dashboardKeys.detail(filters),
    queryFn: () => dashboardService.getDashboard(filters),
  });
};

// Hook para KPIs
export const useDashboardKPIs = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: dashboardKeys.kpis(filters),
    queryFn: () => dashboardService.getKPIs(filters),
  });
};

// Hook para vendas
export const useDashboardVendas = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: dashboardKeys.vendas(filters),
    queryFn: () => dashboardService.getVendas(filters),
  });
};

// Hook para top produtos
export const useDashboardTopProdutos = (
  filters?: DashboardFilters & { limit?: number },
) => {
  return useQuery({
    queryKey: dashboardKeys.topProdutos(filters),
    queryFn: () => dashboardService.getTopProdutos(filters),
  });
};

// Hook para alertas de stock
export const useDashboardAlertas = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: dashboardKeys.alertas(filters),
    queryFn: () => dashboardService.getAlertas(filters),
  });
};

// Hook para movimentações recentes
export const useDashboardMovimentacoes = (
  filters?: DashboardFilters & { limit?: number },
) => {
  return useQuery({
    queryKey: dashboardKeys.movimentacoes(filters),
    queryFn: () => dashboardService.getMovimentacoes(filters),
  });
};

// Hook para resumo de filiais
export const useDashboardResumoFiliais = () => {
  return useQuery({
    queryKey: dashboardKeys.resumoFiliais(),
    queryFn: () => dashboardService.getResumoFiliais(),
  });
};
