"use client";

import { useState } from "react";
import { HeaderPage } from "@/components/header-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiltrosRelatorio } from "@/src/components/relatorios/FiltrosRelatorio";
import { RelatorioVendas } from "@/src/components/relatorios/RelatorioVendas";
import { RelatorioProdutos } from "@/src/components/relatorios/RelatorioProdutos";
import { RelatorioClientes } from "@/src/components/relatorios/RelatorioClientes";

export function RelatoriosPage() {
  const [filtros, setFiltros] = useState({
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    dataFim: new Date(),
    filial: "",
    agrupamento: "mes",
    categoria: "",
  });

  const handleFiltrar = (novosFiltros: typeof filtros) =>
    setFiltros(novosFiltros);

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Relatórios"
        description="Análise detalhada de vendas, produtos e clientes"
      />
      <FiltrosRelatorio onFiltrar={handleFiltrar} />

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="mt-4">
          <RelatorioVendas
            dataInicio={filtros.dataInicio}
            dataFim={filtros.dataFim}
            filial={filtros.filial}
            agrupamento={filtros.agrupamento}
          />
        </TabsContent>

        <TabsContent value="produtos" className="mt-4">
          <RelatorioProdutos
            dataInicio={filtros.dataInicio}
            dataFim={filtros.dataFim}
            filial={filtros.filial}
            categoria={filtros.categoria}
          />
        </TabsContent>

        <TabsContent value="clientes" className="mt-4">
          <RelatorioClientes
            dataInicio={filtros.dataInicio}
            dataFim={filtros.dataFim}
            filial={filtros.filial}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
