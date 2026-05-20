// src/services/empresa/dashboard-service.ts
import { api } from "../api";
import {
  DashboardData,
  DashboardDataSchema,
  DashboardFilters,
  KPI,
  VendaPeriodo,
  TopProduto,
  AlertaStock,
  MovimentacaoRecente,
  ResumoFilial,
  KPISchema,
  VendaPeriodoSchema,
  TopProdutoSchema,
  AlertaStockSchema,
  MovimentacaoRecenteSchema,
  ResumoFilialSchema,
} from "../../schemas/dashboard/dashboard-schema";

import { z } from "zod";

const DASHBOARD_URL = "/dashboard";

export class DashboardService {
  // GET /api/v1/dashboard/ - Dashboard completo
  async getDashboard(filters?: DashboardFilters): Promise<DashboardData> {
    const response = await api.get(`${DASHBOARD_URL}/`, { params: filters });
    return DashboardDataSchema.parse(response.data);
  }

  // GET /api/v1/dashboard/kpis/ - Apenas KPIs
  async getKPIs(filters?: DashboardFilters): Promise<KPI> {
    const response = await api.get(`${DASHBOARD_URL}/kpis/`, {
      params: filters,
    });
    return KPISchema.parse(response.data);
  }

  // GET /api/v1/dashboard/vendas/ - Vendas por período
  async getVendas(filters?: DashboardFilters): Promise<VendaPeriodo[]> {
    const response = await api.get(`${DASHBOARD_URL}/vendas/`, {
      params: filters,
    });
    return z.array(VendaPeriodoSchema).parse(response.data);
  }

  // GET /api/v1/dashboard/top-produtos/ - Top produtos
  async getTopProdutos(
    filters?: DashboardFilters & { limit?: number },
  ): Promise<TopProduto[]> {
    const response = await api.get(`${DASHBOARD_URL}/top-produtos/`, {
      params: filters,
    });
    return z.array(TopProdutoSchema).parse(response.data);
  }

  // GET /api/v1/dashboard/alertas/ - Alertas de stock
  async getAlertas(filters?: DashboardFilters): Promise<AlertaStock[]> {
    const response = await api.get(`${DASHBOARD_URL}/alertas/`, {
      params: filters,
    });
    return z.array(AlertaStockSchema).parse(response.data);
  }

  // GET /api/v1/dashboard/movimentacoes/ - Últimas movimentações
  async getMovimentacoes(
    filters?: DashboardFilters & { limit?: number },
  ): Promise<MovimentacaoRecente[]> {
    const response = await api.get(`${DASHBOARD_URL}/movimentacoes/`, {
      params: filters,
    });
    return z.array(MovimentacaoRecenteSchema).parse(response.data);
  }

  // GET /api/v1/dashboard/resumo-filiais/ - Resumo por filial
  async getResumoFiliais(): Promise<ResumoFilial[]> {
    const response = await api.get(`${DASHBOARD_URL}/resumo-filiais/`);
    return z.array(ResumoFilialSchema).parse(response.data);
  }
}

export const dashboardService = new DashboardService();
