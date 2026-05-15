// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import { PackagePlus, PencilIcon, Eye, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { CategoryForm } from "@/src/components/inventory/category-form";
import DataTable, { ColumnDef } from "@/components/table/DataTable";
import { Provincia } from "@/src/schemas/localidade/provincia-schema";
import { useProvincias } from "@/src/hooks/localidade/use-provincia";

const columns: ColumnDef<Provincia>[] = [
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

export function ProvinciasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useProvincias();

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar as províncias"
        description="Erro ao carregar as províncias, verificar se estás online"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Branding Dinâmico */}

      <HeaderPage
        title="Províncias"
        description="Gerencie as províncias de Angola"
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
        data={data || []}
        columns={columns}
        caption="Províncias"
        loading={isLoading}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        globalSearch
        columnToggle
        emptyMessage="Nenhuma província foi encontrada."
        onRowClick={(row) => console.log("Província:", row)}
      />
    </div>
  );
}
