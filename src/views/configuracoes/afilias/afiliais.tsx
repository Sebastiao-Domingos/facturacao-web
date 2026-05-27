"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { useAfilia } from "@/src/hooks/empresa/afilia/use-afilia";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import { AfilialForm } from "./forms/afilia-form";
import { AfiliasList } from "@/src/schemas/empresa/afilias/afilia-schema";
import { toast } from "sonner";

export function FiliaisPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState<any>(null);

  const { data: filiais, isLoading, isError } = useAfilia();

  const filteredFiliais =
    filiais?.filter(
      (f) =>
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.codigo_agt.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleEdit = (row: AfiliasList) => {
    setSelectedFilial(row);
    setOpenModal(true);
  };

  const handleDelete = (row: AfiliasList) => {
    // Implementar soft delete (desativar)
    console.log("Desativar filial", row.id);
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleToggleStatus = (row: AfiliasList) => {
    // Implementar ativação/desativação
    console.log("Toggle status", row.id);
    toast.info("Funcionalidade em desenvolvimento");
  };

  const columns: ColumnDef<AfiliasList>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      sortable: true,
      filterable: true,
      cell: (value) => <span className="font-medium">{String(value)}</span>,
    },
    {
      accessorKey: "codigo_agt",
      header: "Código AGT",
      sortable: true,
    },
    {
      accessorKey: "e_sede",
      header: "Sede",
      width: 80,
      cell: (value) => (value ? <Badge variant="default">Sede</Badge> : null),
    },
    {
      accessorKey: "total_funcionarios",
      header: "Funcionários",
      sortable: true,
      width: 100,
      className: "text-center",
    },
    {
      accessorKey: "ativo",
      header: "Status",
      sortable: true,
      width: 100,
      cell: (value) => (
        <Badge
          variant={value ? "default" : "secondary"}
          className={value ? "bg-green-600" : ""}
        >
          {value ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Criação",
      sortable: true,
      width: 120,
      cell: (value) =>
        format(new Date(String(value)), "dd/MM/yyyy", { locale: pt }),
    },
  ];

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar filiais"
        description="Verifique sua conexão e tente novamente."
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Filiais & Pontos de Venda"
        description="Gerencie as localizações e séries de faturação da sua empresa."
      >
        <Button
          onClick={() => {
            setSelectedFilial(null);
            setOpenModal(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Nova Filial
        </Button>
      </HeaderPage>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou código AGT..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredFiliais.length}{" "}
          {filteredFiliais.length === 1 ? "filial" : "filiais"}
        </div>
      </div>

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
          data={filteredFiliais}
          columns={columns}
          rowKey="id"
          selectable={true}
          showCount={true}
          density="compact"
          emptyMessage="Nenhuma filial encontrada."
          actions={["view", "edit", "delete"]}
          onView={(row) => router.push(`/configuracoes/filiais/${row.id}`)}
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
          ]}
        />
      )}

      <AfilialForm
        open={openModal}
        onOpenChange={setOpenModal}
        defaultValues={selectedFilial}
      />
    </div>
  );
}
