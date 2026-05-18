// src/app/(dashboard)/produtos/page.tsx
"use client";

import { PackagePlus, SquareSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useCategorias } from "@/src/hooks/product/use-categoria";
import {
  CategoryForm,
  useFormCategory,
} from "@/src/views/invetario/categorias/forms/category-form";
import { Categoria } from "@/src/schemas/product-schema";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { useOpenModal } from "@/src/components/modals/form-model-shared";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";

const columns: ColumnDef<Categoria>[] = [
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
    accessorKey: "descricao",
    header: "Descrição",
    sortable: true,
    filterable: true,
    cell: (value) => (
      <div className="flex items-center gap-3">
        <span className="font-medium text-white/90">{String(value)}</span>
      </div>
    ),
  },
];

export function CategoriesPage() {
  const { openModal, setOpenModal } = useOpenModal<Categoria>();
  const { onSubmitDelete, isLoading: isLoadingDelete } = useFormCategory();
  const { data, isLoading, isError } = useCategorias();

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar categorias"
        description="Erro ao carregar categorias, verificar se o servidor está online"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header com Branding Dinâmico */}

        <HeaderPage
          title="Categorias"
          description="Gerencie os categorias do seu inventário"
          Icon={<SquareSquare size={24} className="text-muted-foreground" />}
        >
          <Button
            className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
            onClick={() =>
              setOpenModal({ isOpened: true, defaultValue: undefined })
            }
          >
            <PackagePlus size={18} />
            Nova
          </Button>
        </HeaderPage>

        <DataTableV2
          data={data?.results || []}
          columns={columns}
          caption="Categorias"
          loading={isLoading}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
          actions={["delete", "edit", "view"]}
          onEdit={(row) => setOpenModal({ isOpened: true, defaultValue: row })}
          onDelete={(row) => {
            setOpenModal({
              isOpenedDeleteModal: true,
              id: row.id,
              isOpened: false,
            });
          }}
          globalSearch
          columnToggle
          emptyMessage="Nenhuma categoria foi encontrada."
          onRowClick={(row) => console.log("Categoria:", row)}
        />
      </div>

      {openModal.isOpened && (
        <CategoryForm
          isOpen={openModal.isOpened}
          onOpenChange={(value) =>
            setOpenModal({
              isOpened: value,
              defaultValue: openModal.defaultValue,
            })
          }
          onSuccess={() => console.log("Ola como vai!")}
          initialData={openModal.defaultValue}
        />
      )}

      {openModal.isOpenedDeleteModal && (
        <ConfirmDeleteModal
          isLoading={isLoadingDelete}
          isOpen={openModal.isOpenedDeleteModal}
          onConfirm={() => onSubmitDelete(openModal.id!)}
          onOpenChange={(open) =>
            setOpenModal({ isOpenedDeleteModal: open, isOpened: false })
          }
        />
      )}
    </>
  );
}
