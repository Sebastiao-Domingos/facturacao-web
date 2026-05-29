// src/app/(dashboard)/compras/fornecedores/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFornecedores,
  useFornecedorMutations,
} from "@/src/hooks/empresa/compra/use-compra";

export function FornecedoresPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAtivo, setFilterAtivo] = useState<string>("todos");

  const { data, isLoading, isError } = useFornecedores({
    search: searchTerm || undefined,
    ativo: filterAtivo !== "todos" ? filterAtivo === "ativo" : undefined,
    page_size: 100,
  });
  const { deleteMutation, updateMutation } = useFornecedorMutations();

  const fornecedores = data?.results || [];

  const handleEdit = (row: any) =>
    router.push(`/compras/fornecedores/${row.id}/editar`);
  const handleView = (row: any) =>
    router.push(`/compras/fornecedores/${row.id}`);
  const handleToggleStatus = (row: any) => {
    updateMutation.mutate({ id: row.id, data: { ativo: !row.ativo } });
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "nome", header: "Nome", sortable: true, filterable: true },
    { accessorKey: "nif", header: "NIF", sortable: true },
    { accessorKey: "email", header: "Email", sortable: true },
    { accessorKey: "telefone", header: "Telefone" },
    {
      accessorKey: "ativo",
      header: "Status",
      width: 100,
      cell: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-6 text-red-500">Erro ao carregar fornecedores.</div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Fornecedores"
        description="Gerencie os fornecedores da empresa."
      >
        <Button onClick={() => router.push("/compras/fornecedores/novo")}>
          <Plus size={16} className="mr-2" /> Novo
        </Button>
      </HeaderPage>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou NIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filterAtivo}
          onChange={(e) => setFilterAtivo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTableV2
          data={fornecedores}
          columns={columns}
          rowKey="id"
          selectable={false}
          showCount={true}
          density="compact"
          emptyMessage="Nenhum fornecedor encontrado."
          actions={["view", "edit", "delete"]}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(row) => deleteMutation.mutate(row.id!)}
          customActions={[
            {
              key: "toggle-status",
              label: (row) => (row.ativo ? "Desativar" : "Ativar"),
              icon: (row) =>
                row.ativo ? <PowerOff size={14} /> : <Power size={14} />,
              variant: (row) => (row.ativo ? "warning" : "success"),
              onClick: handleToggleStatus,
            },
          ]}
        />
      )}
    </div>
  );
}
