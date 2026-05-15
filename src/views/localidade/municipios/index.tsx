// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import { PackagePlus, PencilIcon, Eye, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import DataTable, { ColumnDef } from "@/components/table/DataTable";
import { Municipio } from "@/src/schemas/localidade/municipio-schema";
import { useMunicipios } from "@/src/hooks/localidade/use-municipio";
import { MunicipioForm } from "@/src/components/localidade/municipio-form";

const columns: ColumnDef<Municipio>[] = [
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
    accessorKey: "provincia_nome",
    header: "Província",
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

export function MunicipiosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMunicipios({ page });

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar os Municípios"
        description="Erro ao carregar os Municípios, verificar se estás online"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Branding Dinâmico */}

      <HeaderPage
        title="Municípios"
        description="Gerencie os Municípios de Angola"
      >
        <Button
          className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PackagePlus size={18} />
          Novo(a)
        </Button>

        <MunicipioForm isOpen={isOpen} onOpenChange={setIsOpen} />
      </HeaderPage>

      <DataTable
        data={data?.results || []}
        columns={columns}
        caption="Municípios"
        loading={isLoading}
        defaultPageSize={15}
        pageSizeOptions={[10, 25, 50, 100]}
        globalSearch
        columnToggle
        emptyMessage="Nenhuma província foi encontrada."
        onRowClick={(row) => console.log("Província:", row)}
      />
    </div>
  );
}
