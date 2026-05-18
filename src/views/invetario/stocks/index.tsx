// src/app/(dashboard)/stock/page.tsx
"use client";

import {
  Package,
  PackagePlus,
  AlertTriangle,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useStock } from "@/src/hooks/empresa/afilia/use-stock";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { useOpenModal } from "@/src/components/modals/form-model-shared";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";
import { cn } from "@/lib/utils";
import { Stock } from "@/src/schemas/empresa/afilias/stock-schema";

// Interface exata baseada no JSON real da tua API Django

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
  const { openModal, setOpenModal } = useOpenModal<Stock>();
  const { data, isLoading, isError } = useStock();

  // Cálculos consolidados dinâmicos a partir dos resultados reais da API
  const items = data?.results || [];

  const totalArtigos = items.length;

  const artigosCriticos = items.filter((item) => {
    const q = parseFloat(item.quantidade) || 0;
    const m = parseFloat(item.stock_minimo) || 0;
    return q <= m;
  }).length;

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar inventário"
        description="Não foi possível estabelecer ligação com o módulo de stocks. Verifique o servidor."
      />
    );
  }

  return (
    <>
      <div className="space-y-6 bg-background">
        {/* Cabeçalho Limpo */}
        <HeaderPage
          title="Controle de Stock & Inventário"
          description="Monitore as quantidades por filial e gerencie alertas de rotura para conformidade AGT."
          Icon={<Package size={24} className="text-muted-foreground" />}
        >
          <Button
            className="h-10 gap-2 font-medium px-4 shadow-sm"
            onClick={() =>
              setOpenModal({ isOpened: true, defaultValue: undefined })
            }
          >
            <PackagePlus size={16} />
            Dar Entrada
          </Button>
        </HeaderPage>

        {/* Indicadores Comerciais Estáticos */}
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

        {/* Tabela de Dados V2 */}
        <DataTableV2
          data={items}
          columns={columns}
          caption="Inventário Consolidado"
          loading={isLoading}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
          actions={["edit", "delete"]}
          onEdit={(row) => setOpenModal({ isOpened: true, defaultValue: row })}
          onDelete={(row) => {
            setOpenModal({
              isOpenedDeleteModal: true,
              id: row.id,
              isOpened: false,
            });
          }}
          globalSearch
          columnToggle
          emptyMessage="Nenhum artigo foi encontrado no stock."
        />
      </div>

      {/* Modais de Operação Técnica */}
      {openModal.isOpened && (
        /* O teu formulário de Entrada/Edição de Stock entrará aqui */
        <div />
      )}

      {openModal.isOpenedDeleteModal && (
        <ConfirmDeleteModal
          isLoading={false} // Vincular com o isLoading da tua mutação de delete quando criada
          isOpen={openModal.isOpenedDeleteModal}
          onConfirm={() => console.log("Deletar ID:", openModal.id)}
          onOpenChange={(open) =>
            setOpenModal({ isOpenedDeleteModal: open, isOpened: false })
          }
        />
      )}
    </>
  );
}
