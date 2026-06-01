// src/app/(dashboard)/empresa/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Building2,
  CreditCard,
  MapPin,
  Calendar,
  Edit,
  Users,
  Store,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePermissions } from "@/src/hooks/authorition/use-permition";
import { LoadingSkeleton } from "@/src/components/shared/LoadingSkeleton";
import { ErrorComponent } from "@/components/error-component";
import {
  useEmpresaMutations,
  useMinhaEmpresa,
} from "@/src/hooks/empresa/use-empres";
import { AccessDenied } from "@/src/components/AccessDinied";
import { EmpresaForm } from "./form/empresa-form";

export function EmpresaPage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: empresa, isLoading, isError } = useMinhaEmpresa();
  const { isAdmin, isSuperAdmin } = usePermissions();

  const podeEditar = isAdmin || isSuperAdmin;

  if (!podeEditar) {
    return <AccessDenied message="Acesso restrito a administradores" />;
  }

  if (isLoading) {
    return <LoadingSkeleton type="card" count={1} />;
  }

  if (isError || !empresa) {
    return <ErrorComponent message="Erro ao carregar dados da empresa" />;
  }

  const stats = [
    {
      title: "Funcionários",
      value: empresa.total_funcionarios || 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Filiais",
      value: empresa.total_filiais || 0,
      icon: Store,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Produtos com Stock",
      value: empresa.total_produtos_stock || 0,
      icon: Package,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {empresa.nome_fantasia}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <CreditCard size={12} /> NIF: {empresa.nif}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Building2 size={12} />{" "}
                  {empresa.regime_tributario || "Regime Geral"}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CreditCard size={12} /> Moeda:{" "}
                  {empresa.moeda_padrao || "AOA"}
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setEditModalOpen(true)}
              variant="outline"
              className="gap-2 shadow-sm hover:shadow transition-all"
            >
              <Edit size={16} />
              Editar empresa
            </Button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-1.5 ${stat.color}`}>
                    <stat.icon size={16} className={stat.color.split(" ")[0]} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  total registado no sistema
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalhes principais */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Dados da Empresa */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" /> Dados da
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nome Fantasia
                  </p>
                  <p className="text-base font-medium">
                    {empresa.nome_fantasia} - {empresa.slogan}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Razão Social
                  </p>
                  <p className="text-base font-medium">
                    {empresa.razao_social}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    NIF
                  </p>
                  <p className="text-base font-mono">{empresa.nif}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Moeda Padrão
                  </p>
                  <p className="text-base font-medium">
                    {empresa.moeda_padrao || "AOA"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Regime Tributário
                  </p>
                  <p className="text-base font-medium">
                    {empresa.regime_tributario || "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} /> Data de Criação
                  </p>
                  <p className="text-base font-medium">
                    {format(new Date(empresa.created_at!), "dd/MM/yyyy HH:mm", {
                      locale: pt,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {empresa.endereco ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Rua
                    </p>
                    <p className="text-base">{empresa.endereco.rua || "---"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Bairro
                    </p>
                    <p className="text-base">
                      {empresa.endereco.bairro || "---"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Município
                    </p>
                    <p className="text-base">
                      {empresa.endereco.municipio_nome || "---"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Província
                    </p>
                    <p className="text-base">
                      {empresa.endereco.provincia_nome || "---"}
                    </p>
                  </div>
                  {empresa.endereco.ponto_referencia && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Ponto de Referência
                      </p>
                      <p className="text-base">
                        {empresa.endereco.ponto_referencia}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin size={32} className="text-muted-foreground/40" />
                  <p className="mt-2 text-muted-foreground">
                    Nenhum endereço registado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal de Edição com componente separado */}

        <EmpresaForm
          onOpenChange={setEditModalOpen}
          open={editModalOpen}
          empresa={empresa}
          onCancel={() => setEditModalOpen(false)}
          onSuccess={() => setEditModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}
