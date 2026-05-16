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
  Building,
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
import { useDebounce } from "../../../hooks/use-debounde"; // ← cria este hook se não tiveres
import { UnidadeForm } from "../unidade/forms/unidade-form";
import { AfilialForm } from "./forms/afilia-form";
import { Afilias } from "@/src/schemas/empresa/afilias/afilia-schema";

interface Filial {
  id: string;
  nome: string;
  empresa_nome: string;
  codigo_agt: string;
  e_sede: boolean;
  serie_documentos: string;
  endereco: {
    rua: string;
    bairro: string;
    municipio_nome: string;
    provincia_nome: string;
    ponto_referencia: string;
  };
}

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
      <div className="space-y-8 p-2 md:p-6">
        <HeaderPage
          title="Filiais & Pontos de Venda"
          description="Gerencie as localizações e séries de faturação da sua empresa."
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

        {/* Search + Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative group max-w-md w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              placeholder="Pesquisar por nome, município ou código AGT..."
              className="h-12 pl-12 bg-background border-border/60 focus:border-primary/50 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-sm text-muted-foreground font-medium">
            {filteredFiliais.length} de {data?.length || 0} filiais
          </div>
        </div>

        {/* Loading State - Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-95 rounded-4xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Grid de Filiais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiliais.map((filial) => (
                <div
                  key={filial.id}
                  className={cn(
                    "group relative overflow-hidden rounded-4xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card",
                    filial.e_sede
                      ? "border-primary/30 bg-linear-to-br from-primary/3 to-transparent"
                      : "border-border/60 hover:border-border",
                  )}
                >
                  {/* Decorative Background */}
                  <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Building size={140} strokeWidth={0.8} />
                  </div>

                  <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold tracking-tight">
                            {filial.nome}
                          </h3>
                          {filial.e_sede && (
                            <Badge
                              variant="default"
                              className="text-[10px] font-bold tracking-widest px-2.5 py-0.5"
                            >
                              SEDE
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-1.5">
                          <ShieldCheck size={13} />
                          {filial.codigo_agt}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-muted"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
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

                    {/* Endereço */}
                    <div className="bg-muted/50 rounded-2xl p-5 space-y-4 flex-1">
                      <div className="flex gap-3">
                        <MapPin className="text-primary mt-0.5" size={20} />
                        <div className="text-sm">
                          <p className="font-semibold leading-snug">
                            {filial.endereco.rua}, {filial.endereco.bairro}
                          </p>
                          <p className="text-muted-foreground">
                            {filial.endereco.municipio_nome} •{" "}
                            {filial.endereco.provincia_nome}
                          </p>
                        </div>
                      </div>

                      {filial.endereco.ponto_referencia && (
                        <div className="flex gap-3 pt-3 border-t border-border/50">
                          <Navigation
                            size={18}
                            className="text-muted-foreground mt-0.5"
                          />
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                              Referência
                            </p>
                            <p className="text-sm text-foreground/90">
                              {filial.endereco.ponto_referencia}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-end justify-between pt-6 mt-auto">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground block">
                          Série
                        </span>
                        <span className="font-bold text-xl text-primary tracking-tighter">
                          {filial.serie_documentos}
                        </span>
                      </div>

                      <Button
                        variant="link"
                        className="group/btn p-0 h-auto font-semibold text-sm flex items-center gap-1 hover:text-primary"
                      >
                        Inventário
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State Melhorado */}
            {filteredFiliais.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-muted/70 rounded-full p-8 mb-6">
                  <Building2 size={64} className="text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-semibold text-muted-foreground mb-2">
                  Nenhuma filial encontrada
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Não encontramos nenhuma filial com os critérios de pesquisa.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-6"
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
