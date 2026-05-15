// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import { PackagePlus, PencilIcon, Eye, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useCategorias } from "@/src/hooks/product/use-categoria";
import { CategoryForm } from "@/src/components/inventory/category-form";
import DataTable, { ColumnDef } from "@/components/table/DataTable";
import { Categoria } from "@/src/schemas/product-schema";

const columns: ColumnDef<Categoria>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <span className="font-mono text-xs dark:text-white/50">
        {String(value)}
      </span>
    ),
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <div className="flex items-center gap-3">
        <span className="font-medium text-white/90">{String(value)}</span>
      </div>
    ),
  },

  {
    accessorKey: "",
    header: "Detalhes",
    width: 40,
    cell: (_, row) => (
      <Button size={"icon-sm"} variant={"secondary"}>
        <Eye />
      </Button>
    ),
  },

  {
    accessorKey: "-",
    header: "Editar",
    width: 40,
    cell: (_, row) => (
      <Button size={"icon-sm"} variant={"secondary"}>
        <PencilIcon />
      </Button>
    ),
  },
  {
    accessorKey: ".",
    header: "Apagar",
    width: 40,
    cell: (_, row) => (
      <Button size={"icon-sm"} variant={"destructive"}>
        <TrashIcon />
      </Button>
    ),
  },
];

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useCategorias({ page });

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar categorias"
        description="Erro ao carregar categorias, verificar se o servidor está online"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Branding Dinâmico */}

      <HeaderPage
        title="Categorias"
        description="Gerencie os categorias do seu inventário"
      >
        <Button
          className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PackagePlus size={18} />
          Adicionar Categoria
        </Button>

        <CategoryForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={() => console.log("Ola como vai!")}
        />
      </HeaderPage>

      <DataTable
        data={data?.results || []}
        columns={columns}
        caption="Categorias"
        loading={isLoading}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        globalSearch
        columnToggle
        emptyMessage="Nenhuma categoria foi encontrada."
        onRowClick={(row) => console.log("Categoria:", row)}
      />
    </div>
  );
}
