"use client";

import { HeaderPage } from "@/components/header-page";
import DataTableV2 from "@/components/table/DataTable-v2";
import { Button } from "@/components/ui/button";
import { useOpenModal } from "@/src/components/modals/form-model-shared";
import { useProducts } from "@/src/hooks/product/use-products";
import { Funcionario } from "@/src/schemas/empresa/afilias/funcionario-schema";
import { Product } from "@/src/schemas/product-schema";
import { DownloadIcon, PackagePlus, TrashIcon } from "lucide-react";
import { useState } from "react";

export function ProdutosCrud() {
  const [selected, setSelected] = useState<Product[]>([]);
  const { data, isLoading, isError } = useProducts();
  const { openModal, setOpenModal } = useOpenModal<Funcionario>();

  const handleDelete = async (produto: Product) => {
    if (confirm(`Excluir ${produto.nome}?`)) {
      await fetch(`/api/produtos/${produto.id}`, { method: "DELETE" });
    }
  };

  const handleBulkDelete = async (rows: Product[]) => {
    if (confirm(`Excluir ${rows.length} produtos?`)) {
      await Promise.all(
        rows.map((row) =>
          fetch(`/api/produtos/${row.id}`, { method: "DELETE" }),
        ),
      );
      setSelected([]);
    }
  };

  const columns = [
    {
      accessorKey: "nome",
      header: "Produto",
      sortable: true,
      filterable: true,
    },
    {
      accessorKey: "preco_venda",
      header: "Preço",
      sortable: true,
      cell: (value: unknown) => String(value),
    },
    {
      accessorKey: "categoria_detalhes.nome",
      header: "Categoria",
      filterable: true,
      sortable: true,
    },
    {
      accessorKey: "unidade_detalhes.sigla",
      header: "Unidade",
      filterable: true,
      sortable: true,
    },
    {
      accessorKey: "ativo",
      header: "Estado",
      sortable: true,
      cell: (value: unknown) => (value ? "Ativo" : "Inativo"),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      sortable: true,
      cell: (value: unknown) => {
        return value === "P" ? "📦" : "🔧";
      },
    },
    {
      accessorKey: "taxa_detalhes.codigo",
      header: "IVA",
      sortable: true,
    },
  ];

  return (
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
      <h1 className="text-2xl font-bold mb-4">Gestão de Produtos</h1>

      <DataTableV2
        data={data?.results || []}
        columns={columns}
        rowKey="id"
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        bulkActions={[
          {
            key: "delete-bulk",
            label: "Excluir Selecionados",
            icon: <TrashIcon />,
            variant: "danger",
            onClick: handleBulkDelete,
          },
          {
            key: "export",
            label: "Exportar CSV",
            icon: <DownloadIcon />,
            onClick: (rows) => console.log("Exportar:", rows),
          },
        ]}
        actions={["view", "edit", "delete"]}
        onView={(row) => console.log("Visualizar:", row)}
        onEdit={(row) => console.log("Editar:", row)}
        onDelete={handleDelete}
        loading={isLoading}
        showCount
        caption="Catálogo de Produtos"
        globalSearch
        columnToggle
        density="normal"
        pageSizeOptions={[10, 25, 50, 100]}
        defaultPageSize={25}
        onRowClick={(row) => console.log("Clicou na linha:", row)}
      />
    </div>
  );
}
