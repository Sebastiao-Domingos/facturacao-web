// src/app/(dashboard)/clientes/page.tsx
"use client";

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import {
  useClientes,
  useClienteMutations,
} from "@/src/hooks/empresa/use-clientes";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { ClienteList } from "@/src/schemas/empresa/clientes/cliente-schema";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { ClienteForm } from "./forms/cliente-form";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

export function ClientesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterAtivo, setFilterAtivo] = useState<string>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<
    ClienteList | undefined
  >();

  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useClientes({
    search: searchTerm || undefined,
    tipo: filterTipo !== "todos" ? (filterTipo as "P" | "E") : undefined,
    ativo: filterAtivo !== "todos" ? filterAtivo === "ativo" : undefined,
  });

  const clientes = data?.results || [];

  const handleEdit = (cliente: ClienteList) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const handleDelete = (cliente: ClienteList) => {
    setClienteToDelete(cliente);
    setDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setSelectedCliente(undefined);
  };

  const columns: ColumnDef<ClienteList>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      sortable: true,
      filterable: true,
      cell: (value) => <span className="font-medium">{String(value)}</span>,
    },
    {
      accessorKey: "tipo_display",
      header: "Tipo",
      sortable: true,
    },
    {
      accessorKey: "nif",
      header: "NIF",
      sortable: true,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
    },
    {
      accessorKey: "ativo",
      header: "Status",
      sortable: true,
      width: 100,
      cell: (value) => (
        <Badge
          variant={value ? "default" : "secondary"}
          className={value ? "bg-green-500" : ""}
        >
          {value ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar clientes"
        description="Não foi possível carregar a lista de clientes. Tente novamente mais tarde."
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Clientes"
        description="Gerencie os clientes da sua empresa, incluindo particulares e empresas."
      >
        {hasPermission("gerir_clientes") && (
          <Button
            onClick={() => {
              setSelectedCliente(undefined);
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Novo
          </Button>
        )}
      </HeaderPage>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, NIF ou email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="P">Particular</SelectItem>
              <SelectItem value="E">Empresa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAtivo} onValueChange={setFilterAtivo}>
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="rounded-lg border border-border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <DataTableV2
          data={clientes}
          columns={columns}
          rowKey="id"
          selectable={true}
          globalSearch={false}
          showCount={true}
          density="normal"
          emptyMessage="Nenhum cliente encontrado."
          actions={["view"]}
          onView={(row) => router.push(`/equipa/clientes/${row.id}`)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal de Formulário */}
      <ClienteForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultValues={selectedCliente}
        onSuccess={handleSuccess}
      />

      {/* Modal de Confirmação de Eliminação */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (clienteToDelete) {
            handleDelete(clienteToDelete);
            setDeleteModalOpen(false);
          }
        }}
        itemName={clienteToDelete?.nome}
        title="Eliminar Cliente"
        description="Esta ação não pode ser desfeita. O cliente será removido permanentemente do sistema."
      />
    </div>
  );
}
