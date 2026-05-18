// src/app/(dashboard)/filiais/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Building2,
  ArrowUpRight,
  MoreHorizontal,
  Navigation,
  ShieldCheck,
  PackagePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAfilia } from "@/src/hooks/empresa/afilia/use-afilia";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useDebounce } from "../../../hooks/use-debounde";
import { AfilialForm } from "./forms/afilia-form";
import { Afilias } from "@/src/schemas/empresa/afilias/afilia-schema";

interface OpenModalProps {
  isOpened: boolean;
  defaultValue?: Afilias;
}

export function FiliaisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [openModal, setOpenModal] = useState<OpenModalProps>({
    isOpened: false,
    defaultValue: undefined,
  });

  const { data, isLoading, isError } = useAfilia();

  const filteredFiliais = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (f) =>
        f.nome.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        f.endereco?.municipio_nome
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        f.codigo_agt.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [data, debouncedSearch]);

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar as filiais"
        description="Verifique sua conexão e tente novamente."
      />
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 bg-background">
        <HeaderPage
          title="Filiais & Pontos de Venda"
          description="Gerencie as localizações e séries de faturação da sua empresa."
        >
          <Button
            className="h-10 gap-2 font-medium px-4 shadow-sm"
            onClick={() =>
              setOpenModal({
                isOpened: !openModal.isOpened,
                defaultValue: undefined,
              })
            }
          >
            <PackagePlus size={16} />
            Novo(a)
          </Button>
        </HeaderPage>

        {/* Search + Stats (Barra de ferramentas limpa) */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, município ou código AGT..."
              className="h-10 pl-9 bg-background border-input text-sm rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
            {filteredFiliais.length} de {data?.length || 0} filiais
          </div>
        </div>

        {/* Loading State - Skeleton Normal */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Grid de Filiais Normalizada */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiliais.map((filial) => (
                <div
                  key={filial.id}
                  className={cn(
                    "relative flex flex-col justify-between p-5 rounded-xl border bg-card shadow-sm transition-colors hover:bg-muted/30",
                    filial.e_sede ? "border-primary/50" : "border-border",
                  )}
                >
                  <div className="space-y-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-foreground tracking-tight">
                            {filial.nome}
                          </h3>
                          {filial.e_sede && (
                            <Badge
                              variant="default"
                              className="text-[10px] font-semibold px-2 py-0 h-4 bg-primary text-primary-foreground uppercase rounded"
                            >
                              Sede
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                          <ShieldCheck
                            size={14}
                            className="text-muted-foreground/70"
                          />
                          AGT: {filial.codigo_agt}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-muted"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() =>
                              setOpenModal({
                                isOpened: !openModal.isOpened,
                                defaultValue: filial,
                              })
                            }
                          >
                            Editar Filial
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ver Inventário</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Endereço Sólido */}
                    <div className="bg-muted/60 border border-border/60 rounded-lg p-4 space-y-3">
                      <div className="flex gap-2.5">
                        <MapPin
                          className="text-muted-foreground shrink-0 mt-0.5"
                          size={16}
                        />
                        <div className="text-xs leading-normal">
                          <p className="font-medium text-foreground">
                            {filial.endereco.rua}, {filial.endereco.bairro}
                          </p>
                          <p className="text-muted-foreground mt-0.5">
                            {filial.endereco.municipio_nome} &bull;{" "}
                            {filial.endereco.provincia_nome}
                          </p>
                        </div>
                      </div>

                      {filial.endereco.ponto_referencia && (
                        <div className="flex gap-2.5 pt-2.5 border-t border-border/60">
                          <Navigation
                            className="text-muted-foreground shrink-0 mt-0.5"
                            size={14}
                          />
                          <div className="text-xs">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground/80 block">
                              Referência
                            </span>
                            <p className="text-muted-foreground mt-0.5">
                              {filial.endereco.ponto_referencia}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer do Card */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                    <div className="text-xs">
                      <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                        Série
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        {filial.serie_documentos}
                      </span>
                    </div>

                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      Inventário
                      <ArrowUpRight size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Tradicional */}
            {filteredFiliais.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-card p-8">
                <Building2
                  size={40}
                  className="text-muted-foreground/40 mb-3"
                />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Nenhuma filial encontrada
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                  Não existem registos que correspondam aos termos pesquisados.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpar pesquisa
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {openModal.isOpened && (
        <AfilialForm
          onOpenChange={(e) =>
            setOpenModal({ isOpened: e, defaultValue: undefined })
          }
          open={openModal.isOpened}
          defaultValues={openModal.defaultValue}
        />
      )}
    </>
  );
}
