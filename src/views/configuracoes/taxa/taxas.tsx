// src/app/(dashboard)/configuracoes/taxas/page.tsx
"use client";

import { useState, useMemo } from "react";
import { PackagePlus, ShieldCheck, Percent, Search, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTaxas } from "@/src/hooks/configuracao/use-taxa";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useDebounce } from "../../../hooks/use-debounde";
import { TaxaForm } from "./forms/taxa-form";
import { Taxa } from "@/src/schemas/configuracoes/taxa-schema";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

export default function TaxasPage() {
  const { podeGerirTaxas, isLoading: isLoadingPermissions } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaxa, setEditingTaxa] = useState<Taxa | undefined>();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: taxas, isLoading, isError } = useTaxas();

  const filteredTaxas = useMemo(() => {
    if (!taxas) return [];
    return taxas.filter(
      (taxa) =>
        taxa.codigo?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        taxa.descricao?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (taxa.motivo_isencao &&
          taxa.motivo_isencao
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())),
    );
  }, [taxas, debouncedSearch]);

  const openNewModal = () => {
    setEditingTaxa(undefined);
    setModalOpen(true);
  };

  const openEditModal = (taxa: any) => {
    setEditingTaxa(taxa);
    setModalOpen(true);
  };

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar as taxas"
        description="Não foi possível carregar as taxas de imposto."
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <HeaderPage
          title="Taxas de Imposto & Isenções"
          description="Gerencie as taxas de imposto aplicáveis e os motivos de isenção para diferentes cenários fiscais."
        >
          {podeGerirTaxas() && (
            <Button onClick={openNewModal}>
              <PackagePlus size={16} />
              Nova
            </Button>
          )}
        </HeaderPage>

        {/* Informações Auxiliares (Regime Fiscal Sólido) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-muted-foreground block uppercase tracking-wider text-[10px]">
                Regime Fiscal Atual
              </span>
              <p className="font-bold text-foreground text-sm">
                Regime Geral &bull; AGT
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Normal */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por código, descrição ou isenção..."
            className="pl-9 h-10 bg-background border-input text-sm rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State - Skeleton Corporativo */}
        {isLoading || isLoadingPermissions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {filteredTaxas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTaxas.map((taxa) => (
                  <div
                    key={taxa.id}
                    className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card shadow-sm transition-colors hover:bg-muted/30"
                  >
                    <div className="space-y-4">
                      {/* Topo do Card com a Percentagem */}
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs mb-1.5 px-2 py-0 h-5"
                          >
                            {taxa.codigo}
                          </Badge>
                          <div className="flex items-baseline text-emerald-600">
                            <span className="text-3xl font-bold tracking-tight">
                              {taxa.valor}
                            </span>
                            <span className="text-lg font-semibold ml-0.5">
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Descrição e Dados Técnicos */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-0.5">
                            Descrição
                          </span>
                          <p className="text-xs font-medium text-foreground leading-normal">
                            {taxa.descricao}
                          </p>
                        </div>

                        {taxa.motivo_isencao && (
                          <div className="pt-2 border-t border-border/60">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1 mb-0.5">
                              <ShieldCheck
                                size={12}
                                className="text-rose-600"
                              />
                              Motivo de Isenção
                            </span>
                            <p className="text-xs font-medium text-rose-600/90 leading-normal">
                              {taxa.motivo_isencao}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações Visíveis e Estáveis */}
                    {podeGerirTaxas() && (
                      <div className="pt-4 mt-4 border-t border-border/60 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5 px-2.5"
                          onClick={() => openEditModal(taxa)}
                        >
                          <Edit2 size={12} />
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State Clássico */
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-card p-8">
                <div className="bg-muted rounded-full p-4 mb-3">
                  <Percent size={32} className="text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Nenhuma taxa encontrada
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                  Não existem registos tributários correspondentes aos critérios
                  aplicados.
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

      {modalOpen && (
        <TaxaForm
          onOpenChange={setModalOpen}
          open={modalOpen}
          defaultValues={editingTaxa}
        />
      )}
    </>
  );
}
