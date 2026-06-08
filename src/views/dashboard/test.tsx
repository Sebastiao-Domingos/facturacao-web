// src/app/(dashboard)/page.tsx
"use client";

import { useState } from "react";
import {
  DollarSign,
  Package,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  UserPlus,
  RefreshCw,
  BarChart2Icon,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/src/hooks/empresa/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/error-component";
import { useRouter } from "next/navigation";
import { KPICard } from "./components/KPICard";
import { VendasChart } from "./components/endasChart";
import { TopProdutos } from "./components/TopProdutos";
import { AlertasStock } from "./components/AlertasStock";
import { UltimasMovimentacoes } from "./components/UltimasMovimentacoes";
import { HeaderPage } from "@/components/header-page";
import { Badge } from "@/components/ui/badge";

export function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // ──────────────────────────────────────────────
  // Estado de Carregamento (Loading Skeleton)
  // ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4 md:space-y-6 ">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-border pb-3 sm:pb-4 md:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-lg sm:rounded-xl shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-5 sm:h-6 md:h-7 w-28 sm:w-36 md:w-44" />
                <Skeleton className="h-3 sm:h-3.5 w-44 sm:w-56 md:w-64" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 sm:h-9 md:h-10 w-24 sm:w-28 rounded-lg" />
        </div>

        {/* KPIs Skeleton */}
        <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 sm:h-28 md:h-32 rounded-lg sm:rounded-xl"
            />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg sm:rounded-xl" />
          <Skeleton className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg sm:rounded-xl" />
        </div>

        {/* Tables Skeleton */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
          <Skeleton className="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[350px] rounded-lg sm:rounded-xl" />
          <Skeleton className="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[350px] rounded-lg sm:rounded-xl" />
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Estado de Erro
  // ──────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-3 sm:p-4 md:p-6">
        <ErrorComponent
          message="Erro ao carregar dashboard"
          description="Não foi possível carregar os dados. Verifique a sua ligação e tente novamente."
        />
      </div>
    );
  }

  const {
    kpis,
    vendas_ultimos_12_meses,
    top_produtos,
    alertas_stock,
    ultimas_movimentacoes,
  } = data;

  // Data atual formatada
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* ── Header ── */}
      <HeaderPage
        title="Dashboard"
        description={`${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)} • Visão geral do negócio`}
        Icon={<BarChart2Icon size={22} />}
      >
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-semibold"
          >
            <Zap size={12} className="text-emerald-500" />
            <span className="hidden md:inline">Dados em</span> Tempo Real
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all group"
          >
            <RefreshCw
              size={14}
              className={
                isRefreshing
                  ? "animate-spin text-primary"
                  : "group-hover:text-primary transition-colors"
              }
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>
      </HeaderPage>

      {/* ── KPIs ── */}
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <KPICard
          titulo="Faturação do Mês"
          valor={kpis.faturacao_mes}
          formato="moeda"
          variacao={kpis.variacao_mensal}
          icon={<DollarSign size={18} />}
        />
        <KPICard
          titulo="Faturação Anual"
          valor={kpis.faturacao_ano}
          formato="moeda"
          icon={<TrendingUp size={18} />}
        />
        <KPICard
          titulo="Clientes"
          valor={kpis.total_clientes}
          icon={<Users size={18} />}
        />
        <KPICard
          titulo="Produtos"
          valor={kpis.total_produtos}
          icon={<Package size={18} />}
        />
        <KPICard
          titulo="Funcionários"
          valor={kpis.total_funcionarios}
          icon={<UserPlus size={18} />}
        />
        <KPICard
          titulo="Filiais"
          valor={kpis.total_filiais}
          icon={<Building2 size={18} />}
        />
        <KPICard
          titulo="Stock Baixo"
          valor={kpis.produtos_stock_baixo}
          icon={<AlertTriangle size={18} />}
        />
        <KPICard
          titulo="Produtos Esgotados"
          valor={kpis.produtos_esgotados}
          icon={<ShoppingCart size={18} />}
        />
      </div>

      {/* ── Gráfico de Vendas + Top Produtos ── */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VendasChart data={vendas_ultimos_12_meses} />
        </div>
        <div>
          <TopProdutos data={top_produtos} />
        </div>
      </div>

      {/* ── Alertas de Stock + Últimas Movimentações ── */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
        <AlertasStock
          data={alertas_stock}
          onVerStock={() => router.push("/stock")}
        />
        <UltimasMovimentacoes data={ultimas_movimentacoes} />
      </div>
    </div>
  );
}
