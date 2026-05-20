// src/components/stock/TabelaHistoricoStock.tsx
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { TrendingUp, TrendingDown, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistoricoStock } from "@/src/hooks/empresa/afilia/use-stock";
import {
  formatQuantidade,
  MovimentacaoResponse,
} from "@/src/schemas/empresa/afilias/stock-schema";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";

interface TabelaHistoricoStockProps {
  stockId: string;
}

export function TabelaHistoricoStock({ stockId }: TabelaHistoricoStockProps) {
  const { data: historico, isLoading } = useHistoricoStock(stockId);
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  // Filtrar por tipo
  const filteredData = useMemo(() => {
    if (!historico) return [];
    if (filterTipo === "todos") return historico;
    return historico.filter((mov) => mov.tipo === filterTipo);
  }, [historico, filterTipo]);

  // Definição das colunas
  const columns: ColumnDef<MovimentacaoResponse>[] = useMemo(
    () => [
      {
        accessorKey: "data",
        header: "Data",
        sortable: true,
        width: 180,
        cell: (value, row) => {
          const date = typeof value === "string" ? new Date(value) : value;
          return format(date as string, "dd/MM/yyyy HH:mm", { locale: pt });
        },
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
        sortable: true,
        width: 120,
        filterable: true,
        cell: (value, row) => (
          <Badge
            variant={row.tipo === "E" ? "default" : "destructive"}
            className={
              row.tipo === "E" ? "bg-emerald-600 hover:bg-emerald-700" : ""
            }
          >
            {row.tipo === "E" ? (
              <TrendingUp size={12} className="mr-1" />
            ) : (
              <TrendingDown size={12} className="mr-1" />
            )}
            {row.tipo_display}
          </Badge>
        ),
      },
      {
        accessorKey: "quantidade",
        header: "Quantidade",
        sortable: true,
        width: 120,
        className: "text-right font-mono",
        cell: (value) => formatQuantidade(parseFloat(String(value))),
      },
      {
        accessorKey: "origem_destino",
        header: "Motivo",
        sortable: true,
        filterable: true,
        cell: (value) => (
          <div className="max-w-[250px] truncate" title={String(value)}>
            {String(value)}
          </div>
        ),
      },
      {
        accessorKey: "operador_detalhes",
        header: "Operador",
        sortable: false,
        width: 150,
        cell: (value, row) => {
          const operador = row.operador_detalhes;
          if (operador) {
            return (
              <div className="flex items-center gap-1">
                <User size={12} className="text-muted-foreground" />
                <span>{operador.nome}</span>
              </div>
            );
          }
          return <span className="text-muted-foreground text-xs">Sistema</span>;
        },
      },
    ],
    [],
  );

  // Filtros rápidos
  const FiltrosRapidos = () => (
    <div className="flex gap-2 mb-4">
      <Button
        variant={filterTipo === "todos" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterTipo("todos")}
      >
        Todos
      </Button>
      <Button
        variant={filterTipo === "E" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterTipo("E")}
        className="gap-1"
      >
        <TrendingUp size={14} />
        Entradas
      </Button>
      <Button
        variant={filterTipo === "S" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterTipo("S")}
        className="gap-1"
      >
        <TrendingDown size={14} />
        Saídas
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!historico || historico.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar size={48} className="mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma movimentação registada.</p>
        <p className="text-sm text-muted-foreground">
          As movimentações aparecerão aqui quando forem registadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FiltrosRapidos />

      <DataTableV2
        data={filteredData}
        columns={columns}
        rowKey="id"
        selectable={false}
        globalSearch={true}
        showCount={true}
        density="compact"
        emptyMessage="Nenhuma movimentação encontrada com os filtros selecionados."
      />

      <div className="text-xs text-muted-foreground text-right">
        Total de movimentações: {filteredData.length}
      </div>
    </div>
  );
}
