"use client";

import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import DataTableV2 from "@/components/table/DataTable-v2";
import { Button } from "@/components/ui/button";
import { useOpenModal } from "@/src/components/modals/form-model-shared";
import { useFuncionario } from "@/src/hooks/empresa/use-funcionario";
import { Funcionario } from "@/src/schemas/empresa/afilias/funcionario-schema";
import { DownloadIcon, PackagePlus, TrashIcon } from "lucide-react";

const columns = [
  {
    accessorKey: "nome_completo",
    header: "Nome Completo",
    sortable: true,
    filterable: true,
    cell: (value: unknown) => (value ? String(value) : "Sem nome completo"),
  },
  {
    accessorKey: "user",
    header: "Email",
    sortable: true,
  },
  {
    accessorKey: "cargo",
    header: "Cargo",
    filterable: true,
    sortable: true,
  },
  {
    accessorKey: "telemovel",
    header: "Nº telefone",
    sortable: true,
  },
  {
    accessorKey: "ativo",
    header: "Estado",
    sortable: true,
    cell: (value: unknown) => (value ? "Ativo" : "Inativo"),
  },

  {
    accessorKey: "filial_nome",
    header: "Filial",
    sortable: true,
  },
  {
    accessorKey: "papel",
    header: "Papel",
    sortable: true,
  },
];

export function ProdutosCrud() {
  const { data, isLoading, isError } = useFuncionario();
  const { openModal, setOpenModal } = useOpenModal<Funcionario>();

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar os funcionários"
        description="Houve um erro durante o carregamento de funcionários, verifica a tua internet!"
      />
    );
  }

  return (
    <>
      <div className="py-2">
        <HeaderPage
          title="Funcionários"
          description="Gerencie o pessoal da empresa."
        >
          <Button
            className="h-11 gap-2 shadow-lg shadow-primary/20 font-semibold px-6"
            onClick={() =>
              setOpenModal({
                isOpened: !openModal.isOpened,
                defaultValue: undefined,
              })
            }
          >
            <PackagePlus size={18} />
            Nova
          </Button>
        </HeaderPage>

        <DataTableV2
          data={data?.results || []}
          columns={columns}
          rowKey="id"
          selectable
          bulkActions={[
            {
              key: "export",
              label: "Exportar CSV",
              icon: <DownloadIcon />,
              onClick: (rows) => console.log("Exportar:", rows),
            },
          ]}
          actions={["view", "edit"]}
          onView={(row) => console.log("Visualizar:", row)}
          onEdit={(row) => console.log("Editar:", row)}
          loading={isLoading}
          showCount
          caption="Lista dos funcionários"
          globalSearch
          columnToggle
          density="normal"
          pageSizeOptions={[10, 25, 50, 100]}
          defaultPageSize={25}
          onRowClick={(row) => console.log("Clicou na linha:", row)}
        />
      </div>
    </>
  );
}
