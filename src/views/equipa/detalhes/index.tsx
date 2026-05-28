// src/app/(dashboard)/funcionarios/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Power,
  PowerOff,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  User,
  Store,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFuncionario,
  useFuncionarioMutations,
  useFuncionarioAtual,
} from "@/src/hooks/empresa/use-funcionario";
import { ErrorComponent } from "@/components/error-component";
import { useState } from "react";
import { FuncionarioForm } from "../forms/funcionario-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ConfirmModal } from "@/src/components/shared/confirm-delete-modal";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

const papeis: Record<string, string> = {
  SUPERADMIN: "Administrador",
  ADMIN: "Administrador de Filial",
  GESTOR: "Gestor de Filial",
  OPERADOR: "Operador de Caixa",
  CONTABILISTA: "Contabilista",
};

export function FuncionarioDetailPage() {
  const { podeGerirUsuarios, isLoading: isLoadingPermissions } =
    usePermissions();
  const { funcionario: id } = useParams();
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<boolean>(false);

  const {
    data: funcionario,
    isLoading,
    isError,
    refetch,
  } = useFuncionario(id as string);

  const { toggleStatusMutation } = useFuncionarioMutations();

  const handleToggleStatus = () => {
    if (funcionario) {
      setTargetStatus(!funcionario.ativo);
      setStatusModalOpen(true);
    }
  };

  const confirmToggleStatus = () => {
    if (funcionario) {
      toggleStatusMutation.mutate(
        { id: funcionario.id, ativo: targetStatus },
        {
          onSuccess: () => {
            setStatusModalOpen(false);
            refetch();
            toast.success(
              targetStatus
                ? "Funcionário ativado com sucesso!"
                : "Funcionário desativado com sucesso!",
            );
          },
        },
      );
    }
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    refetch();
    toast.success("Dados actualizados com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !funcionario) {
    return (
      <ErrorComponent
        message="Funcionário não encontrado"
        description="O funcionário que procura não existe ou foi removido."
      />
    );
  }

  const endereco = funcionario.endereco;
  const filialDetalhes = funcionario.filial_detalhes;
  const dataRegisto = funcionario.created_at
    ? format(new Date(funcionario.created_at), "dd/MM/yyyy 'às' HH:mm", {
        locale: pt,
      })
    : "---";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">
                {funcionario.nome_completo}
              </h1>
              <Badge
                variant={funcionario.ativo ? "default" : "secondary"}
                className={funcionario.ativo ? "bg-green-600" : ""}
              >
                {funcionario.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {papeis[funcionario.papel] || funcionario.papel} •{" "}
              {funcionario.filial_nome}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {podeGerirUsuarios() && (
            <>
              <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
              <Button
                variant={funcionario.ativo ? "destructive" : "default"}
                onClick={handleToggleStatus}
                disabled={toggleStatusMutation.isPending}
              >
                {funcionario.ativo ? (
                  <>
                    <PowerOff size={16} className="mr-2" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Power size={16} className="mr-2" />
                    Ativar
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
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
                <p className="text-sm text-muted-foreground">
                  {funcionario.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">
                  {funcionario.telemovel}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">NIF/BI</p>
                <p className="text-sm text-muted-foreground">
                  {funcionario.bi}
                </p>
              </div>
            </div>
            <Separator />
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
            <CardTitle className="text-lg flex items-center gap-2">
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
                  {funcionario.cargo}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-medium">Papel</p>
                <Badge variant="outline" className="mt-1">
                  {papeis[funcionario.papel] || funcionario.papel}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Filial</p>
                <p className="text-sm text-muted-foreground">
                  {funcionario.filial_nome}
                </p>
              </div>
            </div>
            {funcionario.empresa_nome && (
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm text-muted-foreground">
                    {funcionario.empresa_nome}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {endereco && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin size={18} /> Endereço do Funcionário
            </CardTitle>
            <CardDescription>Localização do funcionário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {endereco.rua && (
              <p className="text-sm">
                <span className="font-medium">Rua:</span> {endereco.rua}
              </p>
            )}
            {endereco.bairro && (
              <p className="text-sm">
                <span className="font-medium">Bairro:</span> {endereco.bairro}
              </p>
            )}
            {endereco.municipio_nome && (
              <p className="text-sm">
                <span className="font-medium">Município:</span>{" "}
                {endereco.municipio_nome}
              </p>
            )}
            {endereco.provincia_nome && (
              <p className="text-sm">
                <span className="font-medium">Província:</span>{" "}
                {endereco.provincia_nome}
              </p>
            )}
            {endereco.ponto_referencia && (
              <p className="text-sm">
                <span className="font-medium">Ponto de referência:</span>{" "}
                {endereco.ponto_referencia}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detalhes da Filial */}
      {filialDetalhes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store size={18} /> Detalhes da Filial
            </CardTitle>
            <CardDescription>
              Informações da filial à qual o funcionário pertence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.nome}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Código AGT</p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.codigo_agt}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Série Documentos</p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.serie_documentos}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Sede</p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.e_sede ? "Sim" : "Não"}
                </p>
              </div>
            </div>
            {filialDetalhes.endereco && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm font-medium">Endereço da Filial</p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.endereco.rua},{" "}
                  {filialDetalhes.endereco.bairro}
                </p>
                <p className="text-sm text-muted-foreground">
                  {filialDetalhes.endereco.municipio_nome} -{" "}
                  {filialDetalhes.endereco.provincia_nome}
                </p>
                {filialDetalhes.endereco.ponto_referencia && (
                  <p className="text-sm text-muted-foreground">
                    Ref: {filialDetalhes.endereco.ponto_referencia}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <FuncionarioForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={funcionario}
        onSuccess={handleEditSuccess}
      />

      {/* Modal de Confirmação para Ativar/Desativar */}
      <ConfirmModal
        isOpen={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onConfirm={confirmToggleStatus}
        title={targetStatus ? "Ativar Funcionário" : "Desativar Funcionário"}
        description={
          targetStatus
            ? "O funcionário poderá voltar a aceder ao sistema. Deseja continuar?"
            : "O funcionário ficará inativo e não poderá aceder ao sistema. Deseja continuar?"
        }
        confirmVariant={targetStatus ? "default" : "destructive"}
        confirmText={targetStatus ? "Ativar" : "Desativar"}
        confirmIcon={
          targetStatus ? <Power size={16} /> : <PowerOff size={16} />
        }
        icon={targetStatus ? <Power size={28} /> : <PowerOff size={28} />}
        iconClassName={
          targetStatus
            ? "bg-primary/10 text-primary"
            : "bg-destructive/10 text-destructive"
        }
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  );
}
