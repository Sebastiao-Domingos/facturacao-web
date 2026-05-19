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
} from "@/src/hooks/empresa/use-funcionario";
import { ErrorComponent } from "@/components/error-component";
import { useState } from "react";
import { FuncionarioForm } from "../forms/funcionario-form";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";

const papeis: Record<string, string> = {
  SUPERADMIN: "Administrador",
  ADMIN: "Administrador de Filial",
  GESTOR: "Gestor de Filial",
  OPERADOR: "Operador de Caixa",
  CONTABILISTA: "Contabilista",
};

export default function FuncionarioDetailPage() {
  const { funcionario: id } = useParams();
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    data: funcionario,
    isLoading,
    isError,
  } = useFuncionario(id as string);
  const { toggleStatusMutation, deleteMutation } = useFuncionarioMutations();

  const handleToggleStatus = () => {
    if (funcionario) {
      toggleStatusMutation.mutate({
        id: funcionario.id,
        ativo: !funcionario.ativo,
      });
    }
  };

  const handleDelete = () => {
    if (funcionario) {
      deleteMutation.mutate(funcionario.id);
      setDeleteModalOpen(false);
      router.push("/funcionarios");
    }
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

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{funcionario.nome_completo}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={funcionario.ativo ? "default" : "secondary"}>
                {funcionario.ativo ? "Ativo" : "Inativo"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Criado em{" "}
                {new Date(funcionario.created_at).toLocaleDateString("pt-PT")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <Edit size={16} className="mr-2" />
            Editar
          </Button>
          <Button
            variant={funcionario.ativo ? "destructive" : "default"}
            onClick={handleToggleStatus}
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
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Pessoais</CardTitle>
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
                <p className="text-sm text-muted-foreground">
                  {new Date(funcionario.created_at).toLocaleDateString("pt-PT")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Profissionais</CardTitle>
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
              {/* <Badge size={"18"} className="mt-0.5" /> */}
              <div>
                <p className="text-sm font-medium">Papel</p>
                <Badge variant="outline">
                  {papeis[funcionario.papel] || funcionario.papel}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Filial</p>
                <p className="text-sm text-muted-foreground">
                  {funcionario.filial_nome}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição */}
      <FuncionarioForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={funcionario}
        onSuccess={() => {
          setEditModalOpen(false);
        }}
      />

      {/* Modal de Eliminação */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        itemName={funcionario.nome_completo}
        title="Eliminar Funcionário"
        description="Esta ação não pode ser desfeita. O funcionário será removido permanentemente do sistema."
      />
    </div>
  );
}
