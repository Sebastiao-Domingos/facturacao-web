// src/app/(dashboard)/compras/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, CheckCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompraMutations,
  useCompras,
} from "@/src/hooks/empresa/compra/use-compra";
import { CompraList } from "@/src/schemas/empresa/compras/compra-schema";

const estadoColors: Record<string, string> = {
  RASCUNHO: "bg-gray-500",
  CONFIRMADA: "bg-green-600",
  CANCELADA: "bg-red-500",
};

export function ComprasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  const { data, isLoading, isError } = useCompras({
    estado: filterEstado !== "todos" ? filterEstado : undefined,
    page_size: 100,
  });
  const { confirmarMutation } = useCompraMutations();

  const compras = data?.results || [];

  const handleView = (row: any) => router.push(`/compras/${row.id}`);
  const handleConfirmar = (row: any) => {
    if (confirm("Confirmar esta compra? O stock será actualizado.")) {
      confirmarMutation.mutate(row.id);
    }
  };

  const columns: ColumnDef<CompraList>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (value) => (
        <span className="font-mono text-xs">#{String(value).slice(0, 8)}</span>
      ),
    },
    {
      accessorKey: "fornecedor_nome",
      header: "Fornecedor",
      sortable: true,
      filterable: true,
    },
    {
      accessorKey: "filial_nome",
      header: "Filial",
      sortable: true,
    },
    {
      accessorKey: "data_compra",
      header: "Data",
      sortable: true,
      width: 120,
      cell: (value) =>
        format(new Date(value as string), "dd/MM/yyyy", { locale: pt }),
    },
    {
      accessorKey: "total",
      header: "Total",
      sortable: true,
      width: 150,
      className: "text-right",
      cell: (value) => formatarMoeda(value as number),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      width: 120,
      cell: (value) => (
        <Badge className={estadoColors[String(value)] || "bg-gray-400"}>
          {value as string}
        </Badge>
      ),
    },
  ];

  if (isError)
    return <div className="p-6 text-red-500">Erro ao carregar compras.</div>;

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Compras"
        description="Gestão de pedidos de compra a fornecedores."
      >
        <Button onClick={() => router.push("/compras/nova")}>
          <Plus size={16} className="mr-2" /> Nova
        </Button>
      </HeaderPage>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="todos">Todos os estados</option>
          <option value="RASCUNHO">Rascunho</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTableV2
          data={compras}
          columns={columns}
          rowKey="id"
          selectable={false}
          showCount={true}
          density="compact"
          emptyMessage="Nenhuma compra encontrada."
          actions={["view"]}
          onView={handleView}
          customActions={[
            {
              key: "confirmar",
              label: "Confirmar",
              icon: <CheckCircle size={14} />,
              variant: "success",
              hidden: (row) => row.estado !== "RASCUNHO",
              onClick: handleConfirmar,
            },
          ]}
        />
      )}
    </div>
  );
}
