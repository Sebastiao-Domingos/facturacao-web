"use client";

import { useState, useMemo } from "react";
import { PackagePlus, ShieldCheck, Percent, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTaxas } from "@/src/hooks/configuracao/use-taxa";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { useDebounce } from "../../hooks/use-debounde"; // ← Corrigido
import { TaxaModal } from "@/src/components/modals/taxa-modal";

export default function TaxasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaxa, setEditingTaxa] = useState<any>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: taxas, isLoading, isError, refetch } = useTaxas();

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

  const handleSuccess = () => {
    refetch();
    setModalOpen(false);
    setEditingTaxa(null);
  };

  const openNewModal = () => {
    setEditingTaxa(null);
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
    <div className="space-y-8 p-2 md:p-6">
      <HeaderPage
        title="Taxas de Imposto & Isenções"
        description="Gerencie as taxas de imposto aplicáveis e os motivos de isenção para diferentes cenários fiscais."
      >
        <Button
          onClick={openNewModal}
          className="h-11 gap-2 shadow-lg shadow-primary/20 font-semibold px-6"
        >
          <PackagePlus size={18} />
          Nova Taxa
        </Button>
      </HeaderPage>

      {/* Regime Fiscal Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Regime Atual
              </p>
              <p className="font-bold text-lg">Regime Geral</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">República de Angola</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="Pesquisar por código, descrição ou isenção..."
          className="pl-11 h-12 bg-background border-border/60 focus:border-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {filteredTaxas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaxas.map((taxa) => (
                <div
                  key={taxa.id}
                  className="group relative rounded-3xl border border-border/60 bg-card p-6 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <Badge
                        variant="outline"
                        className="font-mono tracking-widest text-xs mb-2"
                      >
                        {taxa.codigo}
                      </Badge>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                          {taxa.valor}
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          %
                        </span>
                      </div>
                    </div>

                    {/* <Badge
                      className={cn(
                        "font-medium",
                        taxa.ativo !== false
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-red-500/10 text-red-600"
                      )}
                    >
                      {taxa.ativo !== false ? "Ativo" : "Inativo"}
                    </Badge> */}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                        DESCRIÇÃO
                      </p>
                      <p className="font-medium leading-snug text-foreground/90">
                        {taxa.descricao}
                      </p>
                    </div>

                    {taxa.motivo_isencao && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                          <ShieldCheck size={14} />
                          ISENÇÃO / MOTIVO
                        </p>
                        <p className="text-sm text-rose-600/80 font-medium">
                          {taxa.motivo_isencao}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(taxa)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-muted rounded-full p-8 mb-6">
                <Percent size={64} className="text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
                Nenhuma taxa encontrada
              </h3>
              <p className="text-muted-foreground max-w-xs">
                Não foram encontradas taxas com os critérios de pesquisa.
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

      {/* Modal */}
      <TaxaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultValues={editingTaxa}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
