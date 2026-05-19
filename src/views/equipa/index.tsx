// src/app/(dashboard)/funcionarios/page.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import { FuncionarioForm } from "./forms/funcionario-form";
import {
  useFuncionarios,
  useFuncionarioMutations,
} from "@/src/hooks/empresa/use-funcionario";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";

// Definição do tipo Funcionario
interface Funcionario {
  id: string;
  nome_completo: string;
  email: string;
  bi: string;
  cargo: string;
  papel: string;
  ativo: boolean;
  telemovel: string;
  filial_nome: string;
  created_at: string;
}

const papeis = [
  { value: "SUPERADMIN", label: "Administrador" },
  { value: "ADMIN", label: "Administrador de Filial" },
  { value: "GESTOR", label: "Gestor de Filial" },
  { value: "OPERADOR", label: "Operador de Caixa" },
  { value: "CONTABILISTA", label: "Contabilista" },
];

const columns: ColumnDef<Funcionario>[] = [
  {
    accessorKey: "nome_completo",
    header: "Nome",
    sortable: true,
    filterable: true,
    cell: (value) => <span className="font-medium">{String(value)}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    sortable: true,
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
    sortable: true,
  },
  {
    accessorKey: "papel",
    header: "Papel",
    sortable: true,
    cell: (value) => {
      const papel = papeis.find((p) => p.value === value);
      return <Badge variant="outline">{papel?.label || String(value)}</Badge>;
    },
  },
  {
    accessorKey: "telemovel",
    header: "Telefone",
  },
  {
    accessorKey: "filial_nome",
    header: "Filial",
    sortable: true,
  },
  {
    accessorKey: "ativo",
    header: "Status",
    sortable: true,
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

export function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPapel, setFilterPapel] = useState<string>("todos");
  const [filterAtivo, setFilterAtivo] = useState<string>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<
    Funcionario | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [funcionarioToDelete, setFuncionarioToDelete] = useState<
    Funcionario | undefined
  >();

  const { data: funcionarios, isLoading, isError } = useFuncionarios();
  const { toggleStatusMutation, deleteMutation } = useFuncionarioMutations();

  // Filtrar funcionários
  const filteredFuncionarios = funcionarios?.filter((f) => {
    const matchesSearch =
      searchTerm === "" ||
      f.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.bi.includes(searchTerm);

    const matchesPapel = filterPapel === "todos" || f.papel === filterPapel;
    const matchesAtivo =
      filterAtivo === "todos" ||
      (filterAtivo === "ativo" && f.ativo) ||
      (filterAtivo === "inativo" && !f.ativo);

    return matchesSearch && matchesPapel && matchesAtivo;
  });

  const handleEdit = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setModalOpen(true);
  };

  const handleDelete = (funcionario: Funcionario) => {
    setFuncionarioToDelete(funcionario);
    setDeleteModalOpen(true);
  };

  const handleToggleStatus = (funcionario: Funcionario) => {
    toggleStatusMutation.mutate({
      id: funcionario.id,
      ativo: !funcionario.ativo,
    });
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setSelectedFuncionario(undefined);
  };

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar funcionários"
        description="Não foi possível carregar a lista de funcionários. Tente novamente mais tarde."
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <HeaderPage
        title="Funcionários"
        description="Gerencie os funcionários da sua empresa, controle acessos e permissões."
      >
        <Button
          onClick={() => {
            setSelectedFuncionario(undefined);
            setModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Novo
        </Button>
      </HeaderPage>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email ou BI..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select value={filterPapel} onValueChange={setFilterPapel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os papéis</SelectItem>
              {papeis.map((papel) => (
                <SelectItem key={papel.value} value={papel.value}>
                  {papel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAtivo} onValueChange={setFilterAtivo}>
            <SelectTrigger className="w-[150px]">
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
        <div className="rounded-lg border border-border">
          <DataTableV2
            data={filteredFuncionarios || []}
            columns={columns}
            rowKey="id"
            selectable={true}
            globalSearch={false}
            showCount={true}
            density="normal"
            emptyMessage="Nenhum funcionário encontrado."
            actions={["edit", "delete"]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            customActions={[
              {
                key: "toggle-status",
                label: (row) => (row.ativo ? "Desativar" : "Ativar"),
                icon: (row) =>
                  row.ativo ? <PowerOff size={14} /> : <Power size={14} />,
                variant: (row) => (row.ativo ? "warning" : "success"),
                onClick: handleToggleStatus,
              },
              {
                key: "view-details",
                label: "Ver Detalhes",
                icon: <Eye size={14} />,
                variant: "default",
                onClick: (row) => {
                  window.location.href = `/equipa/${row.id}`;
                },
              },
            ]}
          />
        </div>
      )}

      {/* Modals */}
      <FuncionarioForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultValues={selectedFuncionario}
        onSuccess={handleSuccess}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (funcionarioToDelete) {
            deleteMutation.mutate(funcionarioToDelete.id);
            setDeleteModalOpen(false);
          }
        }}
        itemName={funcionarioToDelete?.nome_completo}
        title="Eliminar Funcionário"
        description="Esta ação não pode ser desfeita. O funcionário será removido permanentemente do sistema."
      />
    </div>
  );
}
