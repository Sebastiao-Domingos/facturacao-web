// src/app/(dashboard)/unidades/page.tsx
"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  PackagePlus,
  Scale,
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
import { useUnidades } from "@/src/hooks/configuracao/use-unidade";
import { ErrorComponent } from "@/components/error-component";
import { Loader } from "@/components/loader";
import { useState } from "react";
import { UnidadeForm } from "./unidade-form";
import { Unidade } from "@/src/schemas/configuracoes/unidade-schema";

export function UnidadesPage() {
  const [defaultValues, setDefaultValues] = useState<Unidade | undefined>();
  const { data: unidades, isLoading, isError } = useUnidades();
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return <Loader />;

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
      <div className="space-y-8 p-2">
        <HeaderPage
          title="Unidades de Medida"
          description="Configure as métricas de stock para os seus produtos e serviços."
          totalItens={unidades?.length}
        >
          <Button
            className="h-12 gap-3 shadow-xl shadow-primary/20 font-black uppercase tracking-widest px-8 transition-all hover:scale-[1.02] active:scale-95"
            onClick={() => setOpenModal(!openModal)}
          >
            <PackagePlus size={18} />
            Nova(o)
          </Button>
        </HeaderPage>

        {/* GRID DE CARDS SEM TABELA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {unidades?.map((unidade) => (
            <div
              key={unidade.id}
              className="group relative flex flex-col items-center justify-between p-6 rounded-2xl border-2 border-border/40 bg-background/50 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Opções (Top Right) */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-primary/10 h-8 w-8"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="gap-2 font-bold uppercase text-[10px] italic"
                      onClick={() => {
                        setDefaultValues(unidade);
                        setOpenModal(!openModal);
                      }}
                    >
                      <Edit2 size={12} /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 font-bold uppercase text-[10px] italic text-destructive">
                      <Trash2 size={12} /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Visual Icon (Representação da Sigla) */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="text-xl font-black text-primary leading-none">
                    {unidade.sigla}
                  </span>
                  <Scale className="absolute -bottom-1 -right-1 h-5 w-5 text-primary/30" />
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-black uppercase tracking-tighter text-foreground leading-none">
                    {unidade.nome}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Métrica de Stock
                  </p>
                </div>
              </div>

              {/* Footer do Card */}
              <div className="mt-6 w-full pt-4 border-t border-border/20 flex justify-center">
                <Badge
                  variant="outline"
                  className="rounded-full font-mono text-[10px] border-primary/20 text-primary bg-primary/5"
                >
                  ID: {unidade.id?.slice(0, 8)}
                </Badge>
              </div>
            </div>
          ))}

          {/* Empty State visual dentro da Grid */}
          {unidades?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-2xl">
              <Layers2 size={48} className="text-muted-foreground/20 mb-4" />
              <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                Nenhuma unidade registada
              </p>
            </div>
          )}
        </div>
      </div>
      {openModal && (
        <UnidadeForm
          onOpenChange={setOpenModal}
          open={openModal}
          defaultValues={defaultValues}
        />
      )}
    </>
  );
}
