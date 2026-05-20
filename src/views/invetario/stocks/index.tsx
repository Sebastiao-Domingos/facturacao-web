// src/app/(dashboard)/stock/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Package,
  TrendingUp,
  AlertTriangle,
  PackageOpen,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderPage } from "@/components/header-page";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  statusConfig,
  formatQuantidade,
  getStatusInfo,
  Stock,
} from "@/src/schemas/empresa/afilias/stock-schema";
import { useStocks } from "@/src/hooks/empresa/afilia/use-stock";
import { ModalMovimentarStock } from "./components/ModalMovimentarStock";
import { TabelaHistoricoStock } from "./components/TabelaHistoricoStock";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type VisualizacaoType = "tabela" | "cards";

const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: "codigo_barras",
    header: "Cód. Barras",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <span className="font-mono text-xs text-muted-foreground">
        {String(value)}
      </span>
    ),
  },
  {
    accessorKey: "produto_nome",
    header: "Artigo",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <span className="font-semibold text-foreground">{String(value)}</span>
    ),
  },
  {
    accessorKey: "filial_nome",
    header: "Filial / Ponto de Venda",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <span className="text-xs text-muted-foreground font-medium">
        {String(value)}
      </span>
    ),
  },
  {
    accessorKey: "quantidade",
    header: "Qtd. Atual",
    sortable: true,
    cell: (value, row) => {
      const qtd = parseFloat(row.quantidade) || 0;
      const min = parseFloat(row.stock_minimo) || 0;

      return (
        <span
          className={cn(
            "font-mono font-bold text-sm",
            qtd === 0
              ? "text-rose-600"
              : qtd <= min
                ? "text-amber-600"
                : "text-foreground",
          )}
        >
          {qtd.toFixed(3)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado Fisc.",
    cell: (_, row) => {
      const qtd = parseFloat(row.quantidade) || 0;
      const min = parseFloat(row.stock_minimo) || 0;

      if (qtd === 0) {
        return (
          <Badge
            variant="outline"
            className="bg-rose-600/10 text-rose-600 border-rose-500/20 text-[10px] rounded uppercase font-semibold h-5"
          >
            Sem Stock
          </Badge>
        );
      }
      if (qtd <= min) {
        return (
          <Badge
            variant="outline"
            className="bg-amber-600/10 text-amber-600 border-amber-500/20 text-[10px] rounded uppercase font-semibold h-5"
          >
            Stock Baixo
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="bg-emerald-600/10 text-emerald-600 border-emerald-500/20 text-[10px] rounded uppercase font-semibold h-5"
        >
          Disponível
        </Badge>
      );
    },
  },
];

export function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [visualizacao, setVisualizacao] = useState<VisualizacaoType>("tabela");

  const { data: stocksData, isLoading, isError } = useStocks();
  const stocks = stocksData?.results || [];

  // Filtragem segura
  const filteredStocks = useMemo(() => {
    if (!stocks.length) return [];

    const searchLower = searchTerm.toLowerCase();

    return stocks.filter((stock) => {
      const produtoNome = stock.produto?.nome?.toLowerCase() || "";
      const produtoCodigo = stock.produto?.codigo?.toLowerCase() || "";
      const filialNome = stock.filial?.nome?.toLowerCase() || "";

      return (
        produtoNome.includes(searchLower) ||
        produtoCodigo.includes(searchLower) ||
        filialNome.includes(searchLower)
      );
    });
  }, [stocks, searchTerm]);

  // Definição das colunas para o DataTableV2

  const handleMovimentar = (stock: Stock) => {
    setSelectedStock(stock);
    setModalOpen(true);
  };

  const handleVerHistorico = (stock: Stock) => {
    setSelectedStock(stock);
    setHistoricoOpen(true);
  };

  // Renderização do Card (modo cards)
  const renderCards = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredStocks.map((stock) => {
        if (!stock.produto || !stock.filial) return null;

        const status = getStatusInfo(stock.status_stock);
        const isEstoqueBaixo =
          Number(stock.quantidade) <= Number(stock.stock_minimo) &&
          Number(stock.quantidade) > 0;
        const isEsgotado = Number(stock.quantidade) === 0;

        return (
          <Card
            key={stock.id}
            className="group overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package size={20} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {stock.produto.nome}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {stock.produto.codigo}
                    </p>
                  </div>
                </div>
                <Badge variant={status.variant as any} className="text-xs">
                  {status.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Filial</p>
                  <p className="font-medium">{stock.filial.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="text-2xl font-bold">
                    {formatQuantidade(stock.quantidade)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      un
                    </span>
                  </p>
                </div>
              </div>

              {(isEstoqueBaixo || isEsgotado) && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-2 font-bold ${isEsgotado ? "bg-red-500/10 text-red-700" : "bg-orange-500/10 text-orange-700"}`}
                >
                  <AlertTriangle size={16} />
                  <p className="text-xs">
                    {isEsgotado
                      ? "Produto esgotado. Necessita reposição."
                      : `Stock abaixo do mínimo (${formatQuantidade(stock.stock_minimo)} un)`}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleVerHistorico(stock)}
                >
                  <Eye size={14} />
                  Histórico
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleMovimentar(stock)}
                >
                  <TrendingUp size={14} />
                  Movimentar
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Renderização da Tabela (modo tabela)
  const renderTabela = () => (
    <DataTableV2
      data={filteredStocks}
      columns={columns}
      rowKey="id"
      selectable={false}
      globalSearch={false}
      showCount={true}
      density="compact"
      emptyMessage="Nenhum stock encontrado."
      actions={["view"]}
      onView={(row) => handleVerHistorico(row)}
      customActions={[
        {
          key: "movimentar",
          label: "Movimentar",
          icon: <TrendingUp size={14} />,
          variant: "default",
          onClick: handleMovimentar,
        },
      ]}
    />
  );

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar stocks"
        description="Não foi possível carregar os dados de stock. Tente novamente mais tarde."
      />
    );
  }

  const totalArtigos = stocksData ? stocksData?.results.length : 0;

  const artigosCriticos = stocksData
    ? stocksData?.results.filter((item) => {
        const q = parseFloat(item.quantidade) || 0;
        const m = parseFloat(item.stock_minimo) || 0;
        return q <= m;
      }).length
    : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <HeaderPage
        title="Gestão de Stock"
        description="Visualize e gerencie o stock de produtos por filial."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Layers size={18} />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">
              Registos em Filtro
            </span>
            <p className="font-bold text-foreground text-sm">
              {totalArtigos} Linhas de Stock
            </p>
          </div>
        </div>

        <div
          className={cn(
            "p-4 rounded-xl border flex items-center gap-3 shadow-sm transition-colors",
            artigosCriticos > 0
              ? "border-rose-500/30 bg-rose-500/5 text-rose-600"
              : "border-border bg-card",
          )}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              artigosCriticos > 0
                ? "bg-rose-500/10 text-rose-600"
                : "bg-muted text-muted-foreground",
            )}
          >
            <AlertTriangle size={18} />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">
              Atenção Requerida
            </span>
            <p
              className={cn(
                "font-bold text-sm",
                artigosCriticos > 0 ? "text-rose-600" : "text-foreground",
              )}
            >
              {artigosCriticos}{" "}
              {artigosCriticos === 1 ? "artigo crítico" : "artigos críticos"}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">
              Validação Fiscal
            </span>
            <p className="font-bold text-emerald-600 text-sm">
              Pronto para Faturação
            </p>
          </div>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Barra de pesquisa */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por produto, código ou filial..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Alternância de visualização */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Visualizar:</span>
          <ToggleGroup
            type="single"
            value={visualizacao}
            onValueChange={(value) =>
              value && setVisualizacao(value as VisualizacaoType)
            }
            className="border rounded-lg"
          >
            <ToggleGroupItem
              value="tabela"
              aria-label="Visualização em tabela"
              className="px-3"
            >
              <TableIcon size={16} className="mr-2" />
              Tabela
            </ToggleGroupItem>
            <ToggleGroupItem
              value="cards"
              aria-label="Visualização em cards"
              className="px-3"
            >
              <LayoutGrid size={16} className="mr-2" />
              Cards
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Cards ou Tabela */}
          {filteredStocks.length > 0 ? (
            visualizacao === "cards" ? (
              renderCards()
            ) : (
              renderTabela()
            )
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PackageOpen size={48} className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhum stock encontrado</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? "Não foram encontrados registos de stock para os critérios de pesquisa."
                  : "Não existem registos de stock disponíveis."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Limpar pesquisa
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de Movimentação */}
      {selectedStock && selectedStock.produto && selectedStock.filial && (
        <ModalMovimentarStock
          stockId={selectedStock.id}
          produtoNome={selectedStock.produto.nome}
          filialNome={selectedStock.filial.nome}
          quantidadeAtual={Number(selectedStock.quantidade)}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedStock(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            setSelectedStock(null);
          }}
        />
      )}

      {/* Modal de Histórico */}
      <Dialog open={historicoOpen} onOpenChange={setHistoricoOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Histórico de Movimentações
              {selectedStock && selectedStock.produto && (
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  {selectedStock.produto.nome} — {selectedStock.filial?.nome}
                </p>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {selectedStock && (
              <TabelaHistoricoStock stockId={selectedStock.id} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
