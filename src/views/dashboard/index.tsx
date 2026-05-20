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

export function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="col-span-2 h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorComponent
          message="Erro ao carregar dashboard"
          description="Não foi possível carregar os dados do dashboard. Tente novamente mais tarde."
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

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <HeaderPage
        title="Dashboard"
        description="Visão geral do negócio e métricas em tempo real"
        Icon={<BarChart2Icon></BarChart2Icon>}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-1"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Actualizar
        </Button>
      </HeaderPage>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Gráficos e Listas */}
      <div className="grid gap-6 lg:grid-cols-3">
        <VendasChart data={vendas_ultimos_12_meses} />
        <TopProdutos data={top_produtos} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AlertasStock
          data={alertas_stock}
          onVerStock={() => router.push("/stock")}
        />
        <UltimasMovimentacoes data={ultimas_movimentacoes} />
      </div>
    </div>
  );
}
