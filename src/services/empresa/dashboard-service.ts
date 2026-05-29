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
  VendaPeriodoFlexivel,
  VendaPeriodoFlexivelSchema,
  RelatorioProduto,
  RelatorioProdutoSchema,
  RelatorioClienteSchema,
  RelatorioCliente,
} from "../../schemas/dashboard/dashboard-schema";

import { z } from "zod";
import {
  Categoria,
  CategoriaDetalhesSchema,
} from "@/src/schemas/product-schema";

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

  async getVendasPorPeriodo(params: {
    data_inicio: string;
    data_fim: string;
    filial?: string;
    agrupamento?: "dia" | "semana" | "mes";
  }): Promise<VendaPeriodoFlexivel[]> {
    const response = await api.get(`${DASHBOARD_URL}/vendas-periodo/`, {
      params,
    });
    return z.array(VendaPeriodoFlexivelSchema).parse(response.data);
  }

  async getRelatorioProdutos(params: {
    data_inicio: string;
    data_fim: string;
    filial?: string;
    categoria?: string;
    limit?: number;
  }): Promise<RelatorioProduto[]> {
    const response = await api.get(`${DASHBOARD_URL}/relatorio-produtos/`, {
      params,
    });
    return z.array(RelatorioProdutoSchema).parse(response.data);
  }

  async getRelatorioClientes(params: {
    data_inicio: string;
    data_fim: string;
    filial?: string;
    limit?: number;
  }): Promise<RelatorioCliente[]> {
    const response = await api.get(`${DASHBOARD_URL}/relatorio-clientes/`, {
      params,
    });
    return z.array(RelatorioClienteSchema).parse(response.data);
  }

  async getCategorias(): Promise<Categoria[]> {
    const response = await api.get("/faturacao/categorias/");
    return z.array(CategoriaDetalhesSchema).parse(response.data);
  }
}

export const dashboardService = new DashboardService();
