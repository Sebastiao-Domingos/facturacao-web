// src/app/(dashboard)/funcionarios/page.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
  Users,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import { FuncionarioForm } from "./forms/funcionario-form";
import {
  useFuncionarios,
  useFuncionarioMutations,
  useFuncionarioAtual,
} from "@/src/hooks/empresa/use-funcionario";
import { useAfilia } from "@/src/hooks/empresa/afilia/use-afilia";
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
import { usePermissions } from "@/src/hooks/authorition/use-permition";

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
  filial_id?: string; // opcional, para facilitar comparação
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
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFilial, setFilterFilial] = useState<string>("todas");
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
  const { data: filiaisData, isLoading: isLoadingFiliais } = useAfilia();
  const filiais = filiaisData || [];

  // Mapeamento de ID da filial para nome (para filtro)
  const filialMap = new Map(filiais.map((f) => [f.id, f.nome]));

  const filteredFuncionarios = funcionarios?.filter((f) => {
    const matchesSearch =
      searchTerm === "" ||
      f.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.bi.includes(searchTerm);

    // Filtro por filial (compara o nome da filial do funcionário com o nome da filial selecionada)
    const matchesFilial =
      filterFilial === "todas" || f.filial_nome === filialMap.get(filterFilial);

    const matchesPapel = filterPapel === "todos" || f.papel === filterPapel;
    const matchesAtivo =
      filterAtivo === "todos" ||
      (filterAtivo === "ativo" && f.ativo) ||
      (filterAtivo === "inativo" && !f.ativo);

    return matchesSearch && matchesFilial && matchesPapel && matchesAtivo;
  });

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
    <div className="space-y-6">
      <HeaderPage
        title="Funcionários"
        description="Gerencie os funcionários da sua empresa, controle acessos e permissões."
        Icon={<Users />}
        totalItens={funcionarios?.length || 0}
      >
        {hasPermission("gerir_usuarios") && (
          <Button
            onClick={() => {
              setSelectedFuncionario(undefined);
              setModalOpen(true);
            }}
            disabled={isLoading || isLoadingFiliais}
          >
            <UserPlus size={16} className="mr-2" /> Novo
          </Button>
        )}
      </HeaderPage>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email ou BI..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Filtro por Filial */}
          <Select value={filterFilial} onValueChange={setFilterFilial}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as filiais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as filiais</SelectItem>
              {filiais.map((filial) => (
                <SelectItem key={filial.id} value={filial.id!}>
                  {filial.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por Papel */}
          <Select value={filterPapel} onValueChange={setFilterPapel}>
            <SelectTrigger className="w-45">
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

          {/* Filtro por Status */}
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
      {isLoading || isLoadingFiliais ? (
        <div className="rounded-lg border border-border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <DataTableV2
          data={filteredFuncionarios || []}
          columns={columns}
          rowKey="id"
          selectable={true}
          globalSearch={false}
          showCount={true}
          density="normal"
          emptyMessage="Nenhum funcionário encontrado."
          actions={["delete", "view"]}
          onDelete={handleDelete}
          onView={(row) =>
            (window.location.href = `/equipa/funcionarios/${row.id}`)
          }
        />
      )}

      {/* Modais */}
      <FuncionarioForm
        open={modalOpen}
        onOpenChange={setModalOpen}
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
