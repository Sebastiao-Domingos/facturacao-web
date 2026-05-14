"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/table/DataTable";
import { useProducts } from "@/src/hooks/product/use-products";
import { Product } from "@/src/schemas/product-schema";

// ── 2. Colunas ────────────────────────────────────────────────────────────────

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "ref_interna",
    header: "Ref.",
    sortable: true,
    width: 90,
    cell: (value) => (
      <span className="font-mono text-xs text-white/50">{String(value)}</span>
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
          <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center text-white/20 text-xs">
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
      <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/50">
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

// ── 3. Página ─────────────────────────────────────────────────────────────────

export function ProdutosPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({ page: page });

  return (
    <div className="p-8">
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
