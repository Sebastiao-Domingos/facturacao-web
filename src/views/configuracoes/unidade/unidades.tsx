// src/app/(dashboard)/unidades/page.tsx
"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  PackagePlus,
  Layers2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderPage } from "@/components/header-page";
import {
  useUnidadeMutations,
  useUnidades,
} from "@/src/hooks/configuracao/use-unidade";
import { ErrorComponent } from "@/components/error-component";
import { useState } from "react";
import { UnidadeForm } from "./forms/unidade-form";
import { Unidade } from "@/src/schemas/configuracoes/unidade-schema";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

export function UnidadesPage() {
  const [defaultValues, setDefaultValues] = useState<Unidade | undefined>();
  const { data: unidades, isLoading, isError } = useUnidades();
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState({
    isopened: false,
    id: "",
  });
  const { deleteMutation } = useUnidadeMutations();
  const { podeGerirUnidades, isLoading: isLoadingPermissions } =
    usePermissions();

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-6">
              <Skeleton className="mx-auto h-16 w-16 rounded-2xl mb-4" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-32 mx-auto mb-4" />
              <Skeleton className="h-6 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar unidades"
        description="Não foi possível estabelecer conexão com o servidor de inventário."
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <HeaderPage
          title="Unidades de Medida"
          description="Configure as métricas de stock para os seus produtos e serviços."
          totalItens={unidades?.length}
        >
          {podeGerirUnidades() && (
            <Button onClick={() => setOpenModal(!openModal)}>
              <PackagePlus size={16} />
              Nova
            </Button>
          )}
        </HeaderPage>

        {/* GRID DE CARDS */}
        {unidades && unidades.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {unidades.map((unidade) => (
              <div
                key={unidade.id}
                className="group relative rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                {/* Opções (Top Right) */}

                {podeGerirUnidades() && (
                  <div className="absolute right-3 top-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setDefaultValues(unidade);
                            setOpenModal(!openModal);
                          }}
                        >
                          <Edit2 size={14} className="mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setOpenModalDelete({
                              id: unidade?.id!,
                              isopened: !openModalDelete.isopened,
                            });
                          }}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Conteúdo do Card */}
                <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                  {/* Ícone da Sigla */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <span className="text-xl font-bold text-primary">
                      {unidade.sigla}
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className="text-sm font-semibold tracking-tight">
                      {unidade.nome}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Unidade de medida
                    </p>
                  </div>
                </div>

                {/* Footer do Card */}
                <div className="mt-6 flex justify-center border-t border-border pt-4">
                  <Badge variant="outline" className="text-xs font-mono">
                    ID: {unidade.id?.slice(0, 8)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Layers2 size={48} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Nenhuma unidade registada
            </h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Comece por adicionar a primeira unidade de medida para os seus
              produtos.
            </p>
            <Button onClick={() => setOpenModal(!openModal)}>
              <PackagePlus size={16} className="mr-2" />
              Adicionar Unidade
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {openModal && (
        <UnidadeForm
          onOpenChange={setOpenModal}
          open={openModal}
          defaultValues={defaultValues}
        />
      )}

      {openModalDelete.isopened && (
        <ConfirmDeleteModal
          isOpen={openModalDelete.isopened}
          onOpenChange={(e) =>
            setOpenModalDelete({
              id: openModalDelete.id,
              isopened: e,
            })
          }
          onConfirm={() => {
            deleteMutation.mutateAsync(openModalDelete.id, {
              onSuccess: () => setOpenModalDelete({ id: "", isopened: false }),
            });
          }}
        />
      )}
    </>
  );
}
