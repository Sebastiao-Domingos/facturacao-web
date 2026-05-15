// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import { useProducts } from "@/src/hooks/product/use-products";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { ProductForm } from "@/src/components/inventory/form-test";
import DataTable, { ColumnDef } from "@/components/table/DataTable";
import { Product } from "@/src/schemas/product-schema";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "ref_interna",
    header: "Ref.",
    sortable: true,
    width: 90,
    cell: (value) => (
      <span className="font-mono text-xs dark:text-white/50">
        {String(value)}
      </span>
    ),
  },
  {
    accessorKey: "nome",
    header: "Produto",
    sortable: true,
    filterable: true,
    cell: (value, row) => (
      <div className="flex items-center gap-3">
        {row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={String(value)}
            className="h-8 w-8 rounded-md object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center dark:text-white/20 text-xs">
            ?
          </div>
        )}
        <span className="font-medium text-white/90">{String(value)}</span>
      </div>
    ),
  },
  {
    accessorKey: "categoria_detalhes.nome", // ← campo aninhado com notação ponto
    header: "Categoria",
    sortable: true,
    filterable: true,
  },
  {
    accessorKey: "unidade_detalhes.sigla",
    header: "Unidade",
    width: 90,
    cell: (value) => (
      <span className="rounded bg-white/5 px-2 py-0.5 text-xs dark:text-white/50">
        {String(value)}
      </span>
    ),
  },
  {
    accessorKey: "taxa_detalhes.codigo",
    header: "IVA",
    width: 100,
    cell: (_, row) => (
      <span className="text-xs text-amber-400">{row.taxa_detalhes.valor}%</span>
    ),
  },
  {
    accessorKey: "preco_venda",
    header: "Preço",
    sortable: true,
    cell: (value) => (
      <span className="tabular-nums font-semibold text-emerald-400">
        {Number(value).toLocaleString("pt-AO", {
          style: "currency",
          currency: "AOA",
        })}
      </span>
    ),
  },
  {
    accessorKey: "ativo",
    header: "Estado",
    sortable: true,
    filterable: true,
    cell: (value) =>
      value ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 ring-1 ring-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Activo
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400 ring-1 ring-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          Inactivo
        </span>
      ),
  },
];

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProducts({ page });
  const [isOpen, setIsOpen] = useState(false);

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar produtos"
        description="Erro ao carregar produtos, verificar se o servidor está online"
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Produtos"
        description="Gerencie os produtos do seu inventário"
      >
        <Button
          className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PackagePlus size={18} />
          Adicionar Produto
        </Button>
        <ProductForm onOpenChange={setIsOpen} isOpen={isOpen} />
      </HeaderPage>

      {/* Tabela de Elite */}
      <DataTable
        data={data?.results || []} // A API devolve { results: [...] }
        columns={columns}
        caption="Produtos"
        loading={isLoading}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        globalSearch
        columnToggle
        emptyMessage="Nenhum produto encontrado."
        onRowClick={(row) => console.log("Produto:", row)}
      />
    </div>
  );
}
