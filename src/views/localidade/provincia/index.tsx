// src/app/(dashboard)/localidade/provincias/page.tsx
"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Building2,
  Search,
  ArrowLeft,
  Locate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { useProvincias } from "@/src/hooks/localidade/use-provincia";
import { ProvinciaForm } from "@/src/components/localidade/provincia-form";
import { MunicipioForm } from "@/src/components/localidade/municipio-form";
import { Provincia } from "@/src/schemas/localidade/provincia-schema";
import { Municipio } from "@/src/schemas/localidade/municipio-schema";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";

export function ProvinciasPage() {
  const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(
    null,
  );
  const [searchProvincia, setSearchProvincia] = useState("");
  const [searchMunicipio, setSearchMunicipio] = useState("");
  const [showProvinciaForm, setShowProvinciaForm] = useState(false);
  const [editingProvincia, setEditingProvincia] = useState<Provincia | null>(
    null,
  );
  const [showMunicipioForm, setShowMunicipioForm] = useState(false);
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "provincia" | "municipio";
    id: string;
    nome: string;
  } | null>(null);

  const { data: provincias, isLoading, isError } = useProvincias();

  // ──────────────────────────────────────────────
  // Filtro de províncias por pesquisa
  // ──────────────────────────────────────────────
  const filteredProvincias =
    provincias?.filter((p) =>
      p.nome.toLowerCase().includes(searchProvincia.toLowerCase()),
    ) || [];

  // ──────────────────────────────────────────────
  // Municípios da província selecionada (já vêm no objeto)
  // ──────────────────────────────────────────────
  const municipios = selectedProvincia?.municipios || [];

  const filteredMunicipios = municipios.filter((m) =>
    m.nome.toLowerCase().includes(searchMunicipio.toLowerCase()),
  );

  // ──────────────────────────────────────────────
  // Estado de Loading
  // ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        <HeaderPage
          title="Províncias e Municípios"
          description="Gerencie a estrutura territorial de Angola"
          Icon={<MapPin size={22} />}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="lg:col-span-2 h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Estado de Erro
  // ──────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 sm:p-6">
        <ErrorComponent
          message="Erro ao carregar as províncias"
          description="Verifique a sua ligação à internet e tente novamente."
        />
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────
  const handleSelectProvincia = (provincia: Provincia) => {
    if (selectedProvincia?.id === provincia.id) {
      setSelectedProvincia(null);
      setSearchMunicipio("");
    } else {
      setSelectedProvincia(provincia);
      setSearchMunicipio("");
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    // Aqui chamaria a API para eliminar
    toast.success(
      `${deleteTarget.type === "provincia" ? "Província" : "Município"} "${deleteTarget.nome}" eliminado(a) com sucesso.`,
    );
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Header ── */}
      <HeaderPage
        title="Províncias e Municípios"
        description="Gerencie a estrutura territorial de Angola"
        Icon={<Locate size={22} />}
        totalItens={provincias?.length}
      >
        <Button
          className="h-9 sm:h-10 gap-2 font-semibold shadow-md shadow-primary/20"
          onClick={() => {
            setEditingProvincia(null);
            setShowProvinciaForm(true);
          }}
        >
          <Plus size={17} />
          <span className="hidden sm:inline">Nova Província</span>
          <span className="sm:hidden">Província</span>
        </Button>
      </HeaderPage>

      {/* ── Layout Principal ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* ═══════════════════════════════════════
            COLUNA ESQUERDA: Lista de Províncias
        ═══════════════════════════════════════ */}
        <Card className="lg:col-span-4 xl:col-span-3 border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                Províncias
              </CardTitle>
              <Badge variant="secondary" className="text-xs font-semibold">
                {filteredProvincias.length}
              </Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar província..."
                value={searchProvincia}
                onChange={(e) => setSearchProvincia(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted/50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[55vh] overflow-y-auto">
              {filteredProvincias.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MapPin size={32} className="text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma província encontrada
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredProvincias.map((provincia) => (
                    <div
                      key={provincia.id}
                      onClick={() => handleSelectProvincia(provincia)}
                      className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-all hover:bg-accent/50 ${
                        selectedProvincia?.id === provincia.id
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            selectedProvincia?.id === provincia.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                          }`}
                        >
                          <MapPin size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {provincia.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {provincia.municipios?.length || 0} município
                            {(provincia.municipios?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProvincia(provincia);
                            setShowProvinciaForm(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <ChevronDown
                          size={16}
                          className={`text-muted-foreground transition-transform shrink-0 ${
                            selectedProvincia?.id === provincia.id
                              ? "rotate-180 text-primary"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════
            COLUNA DIREITA: Municípios
        ═══════════════════════════════════════ */}
        <Card className="lg:col-span-8 xl:col-span-9 border-border shadow-sm">
          {selectedProvincia ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setSelectedProvincia(null);
                          setSearchMunicipio("");
                        }}
                      >
                        <ArrowLeft size={18} />
                      </Button>
                      <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <MapPin size={18} className="text-primary" />
                          {selectedProvincia.nome}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {municipios.length} município
                          {municipios.length !== 1 ? "s" : ""} nesta província
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold"
                    >
                      {filteredMunicipios.length}
                    </Badge>
                    <Button
                      size="sm"
                      className="gap-1.5 h-9 font-semibold"
                      onClick={() => {
                        setEditingMunicipio(null);
                        setShowMunicipioForm(true);
                      }}
                    >
                      <Plus size={15} />
                      <span className="hidden sm:inline">Novo Município</span>
                      <span className="sm:hidden">Novo</span>
                    </Button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar município..."
                    value={searchMunicipio}
                    onChange={(e) => setSearchMunicipio(e.target.value)}
                    className="pl-9 h-9 text-sm bg-muted/50"
                  />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="max-h-[50vh] overflow-y-auto">
                  {filteredMunicipios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
                        <MapPin
                          size={28}
                          className="text-muted-foreground/40"
                        />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {searchMunicipio
                          ? "Nenhum município encontrado"
                          : "Nenhum município cadastrado"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {searchMunicipio
                          ? "Tente ajustar a sua pesquisa"
                          : "Adicione o primeiro município desta província"}
                      </p>
                      {!searchMunicipio && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            setEditingMunicipio(null);
                            setShowMunicipioForm(true);
                          }}
                        >
                          <Plus size={14} />
                          Adicionar Município
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredMunicipios.map((municipio) => (
                        <div
                          key={municipio.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary transition-colors">
                              <MapPin size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {municipio.nome}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                ID: {municipio?.id!.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setEditingMunicipio(municipio);
                                setShowMunicipioForm(true);
                              }}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setDeleteTarget({
                                  type: "municipio",
                                  id: municipio.id!,
                                  nome: municipio.nome,
                                })
                              }
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <MapPin size={36} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                Selecione uma Província
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Clique numa província da lista à esquerda para ver e gerir os
                seus municípios.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ═══════════════════════════════════════
          MODAIS
      ═══════════════════════════════════════ */}

      {/* Modal de Província (Criar/Editar) */}
      <ProvinciaForm
        isOpen={showProvinciaForm}
        onOpenChange={setShowProvinciaForm}
        initialData={editingProvincia}
        onSuccess={() => {
          setShowProvinciaForm(false);
          setEditingProvincia(null);
          toast.success(
            editingProvincia
              ? "Província atualizada com sucesso"
              : "Província criada com sucesso",
          );
        }}
      />

      {/* Modal de Município (Criar/Editar) */}
      <MunicipioForm
        isOpen={showMunicipioForm}
        onOpenChange={setShowMunicipioForm}
        initialData={editingMunicipio}
        provinciaId={selectedProvincia?.id!}
        onSuccess={() => {
          setShowMunicipioForm(false);
          setEditingMunicipio(null);
          toast.success(
            editingMunicipio
              ? "Município atualizado com sucesso"
              : "Município criado com sucesso",
          );
        }}
      />

      {/* Modal de Confirmação de Eliminação */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onOpenChange={() => setDeleteTarget(null)}
        itemName="Província"
        title="Confirmar Eliminação"
        description="Tem certeza que deseja eliminar a província?"
      />
    </div>
  );
}
