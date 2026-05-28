// src/app/(dashboard)/perfil/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  KeyRound,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderPage } from "@/components/header-page";
import { useFuncionarioAtual } from "@/src/hooks/empresa/use-funcionario";
import { ChangePasswordModal } from "@/src/components/changepasseword/ChangePassWord";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

const papeis: Record<string, string> = {
  SUPERADMIN: "Administrador Global",
  ADMIN: "Administrador de Empresa",
  GESTOR: "Gestor de Filial",
  OPERADOR: "Operador de Caixa",
  CONTABILISTA: "Contabilista",
};

export function PerfilPage() {
  const { data: perfil, isLoading } = useFuncionarioAtual();
  const { papel } = usePermissions();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="text-muted-foreground">Erro ao carregar perfil.</p>
      </div>
    );
  }

  const dataRegisto = perfil.created_at
    ? format(new Date(perfil.created_at), "dd/MM/yyyy 'às' HH:mm", {
        locale: pt,
      })
    : "---";

  const papelLabel = papeis[perfil.papel] || perfil.papel;

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Meu Perfil"
        description="Informações da sua conta e permissões no sistema"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} /> Dados Pessoais
            </CardTitle>
            <CardDescription>
              Informações de identificação do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{perfil.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">
                  {perfil.telemovel || "---"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">NIF/BI</p>
                <p className="text-sm text-muted-foreground">
                  {perfil.bi || "---"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Registo</p>
                <p className="text-sm text-muted-foreground">{dataRegisto}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={18} /> Dados Profissionais
            </CardTitle>
            <CardDescription>
              Informações sobre cargo e permissões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cargo</p>
                <p className="text-sm text-muted-foreground">
                  {perfil.cargo || "---"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Papel</p>
                <Badge variant="outline" className="mt-1">
                  {papelLabel}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Filial</p>
                <p className="text-sm text-muted-foreground">
                  {perfil.filial_nome || "---"}
                </p>
              </div>
            </div>
            {perfil.empresa_nome && (
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm text-muted-foreground">
                    {perfil.empresa_nome}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Endereço (se existir) */}
      {perfil.endereco && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={18} /> Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {perfil.endereco.rua && (
              <p>
                <span className="font-medium">Rua:</span> {perfil.endereco.rua}
              </p>
            )}
            {perfil.endereco.bairro && (
              <p>
                <span className="font-medium">Bairro:</span>{" "}
                {perfil.endereco.bairro}
              </p>
            )}
            {perfil.endereco.municipio_nome && (
              <p>
                <span className="font-medium">Município:</span>{" "}
                {perfil.endereco.municipio_nome}
              </p>
            )}
            {perfil.endereco.provincia_nome && (
              <p>
                <span className="font-medium">Província:</span>{" "}
                {perfil.endereco.provincia_nome}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botão de alterar palavra-passe */}
      <div className="flex justify-end">
        <Button
          onClick={() => setPasswordModalOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <KeyRound size={16} />
          Alterar palavra-passe
        </Button>
      </div>

      {/* Modal de alteração de palavra-passe */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
      />
    </div>
  );
}
