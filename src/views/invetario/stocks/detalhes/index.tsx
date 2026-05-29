"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Package,
  Building2,
  AlertTriangle,
  History,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/error-component";
import { useStock } from "@/src/hooks/empresa/afilia/use-stock";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { ModalMovimentarStock } from "../components/ModalMovimentarStock";
import { TabelaHistoricoStock } from "../components/TabelaHistoricoStock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function StockDetailPage() {
  const { stock: id } = useParams();
  const router = useRouter();
  const [movimentarModalOpen, setMovimentarModalOpen] = useState(false);
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);

  const { data: stock, isLoading, isError, refetch } = useStock(id as string);

  const getStatusInfo = (quantidade: number, stockMinimo: number) => {
    if (quantidade <= 0)
      return { label: "Esgotado", variant: "destructive", color: "bg-red-600" };
    if (quantidade <= stockMinimo)
      return {
        label: "Stock Mínimo",
        variant: "warning",
        color: "bg-yellow-600",
      };
    return { label: "Normal", variant: "default", color: "bg-green-600" };
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !stock) {
    return (
      <ErrorComponent
        message="Stock não encontrado"
        description="O registo de stock que procura não existe ou foi removido."
      />
    );
  }

  const quantidade = parseFloat(stock.quantidade);
  const stockMinimo = parseFloat(stock.stock_minimo);
  const status = getStatusInfo(quantidade, stockMinimo);
  const produto = stock.produto_detalhes;
  const precoVenda = parseFloat(produto ? produto?.preco_venda : "0");
  const valorTotalStock = quantidade * precoVenda;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {stock.produto_nome}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status.variant as any} className={status.color}>
                {status.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Código: {produto?.codigo_barras || "---"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setHistoricoModalOpen(true)}>
            <History size={16} className="mr-2" />
            Histórico
          </Button>
          <Button onClick={() => setMovimentarModalOpen(true)}>
            <RefreshCw size={16} className="mr-2" />
            Movimentar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package size={18} /> Informações do Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Quantidade actual</span>
              <span className="text-2xl font-bold">
                {quantidade.toFixed(3)} un
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stock mínimo</span>
              <span className="font-semibold">{stockMinimo.toFixed(3)} un</span>
            </div>
            {quantidade <= stockMinimo && quantidade > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-500/10 text-yellow-600">
                <AlertTriangle size={16} />
                <span className="text-sm">
                  Stock abaixo do mínimo recomendado
                </span>
              </div>
            )}
            {quantidade === 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-red-500/10 text-red-600">
                <AlertTriangle size={16} />
                <span className="text-sm">Produto esgotado</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações da Filial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 size={18} /> Filial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">
                {stock.filial_nome}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/configuracoes/filiais/${stock.filial}`)
              }
            >
              Ver detalhes da filial
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Produto */}
      {produto && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Produto</CardTitle>
            <CardDescription>Informações completas do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">{produto?.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Código de Barras</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {produto.codigo_barras || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Referência Interna</p>
                <p className="text-sm text-muted-foreground">
                  {produto.ref_interna || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">
                  {produto.categoria_detalhes.nome}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Unidade de Medida</p>
                <p className="text-sm text-muted-foreground">
                  {produto.unidade_detalhes.nome} (
                  {produto.unidade_detalhes.sigla})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Taxa de IVA</p>
                <p className="text-sm text-muted-foreground">
                  {produto.taxa_detalhes.descricao} (
                  {produto.taxa_detalhes.valor}
                  %)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Preço de Venda</p>
                <p className="text-sm font-mono font-semibold">
                  {formatarMoeda(precoVenda)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Valor Total em Stock</p>
                <p className="text-sm font-mono font-semibold">
                  {formatarMoeda(valorTotalStock)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Movimentação */}
      <ModalMovimentarStock
        stockId={stock.id}
        produtoNome={stock.produto_nome}
        filialNome={stock.filial_nome}
        quantidadeAtual={quantidade}
        isOpen={movimentarModalOpen}
        onClose={() => setMovimentarModalOpen(false)}
        onSuccess={() => {
          setMovimentarModalOpen(false);
          refetch();
        }}
      />

      {/* Modal de Histórico */}
      <Dialog open={historicoModalOpen} onOpenChange={setHistoricoModalOpen}>
        <DialogContent className="max-w-4xl md:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Histórico de Movimentações
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {stock.produto_nome} — {stock.filial_nome}
              </p>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <TabelaHistoricoStock stockId={stock.id} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
