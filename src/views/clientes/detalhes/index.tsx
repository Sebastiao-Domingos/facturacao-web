// src/app/(dashboard)/clientes/[id]/page.tsx
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
  Building2,
  User,
  MapPin,
  Calendar,
  Globe,
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
  useCliente,
  useClienteMutations,
} from "@/src/hooks/empresa/use-clientes";
import { ErrorComponent } from "@/components/error-component";
import { useState } from "react";
import { ClienteForm } from "../forms/cliente-form";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/src/components/shared/confirm-delete-modal";

export function ClienteDetailPage() {
  const { cliente: id } = useParams();
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: cliente, isLoading, isError } = useCliente(id as string);
  const { toggleStatusMutation, deleteMutation } = useClienteMutations();

  const handleToggleStatus = () => {
    if (cliente) {
      toggleStatusMutation.mutate({ id: cliente.id, ativo: !cliente.ativo });
    }
  };

  const handleDelete = () => {
    if (cliente) {
      deleteMutation.mutate(cliente.id);
      setDeleteModalOpen(false);
      router.push("/clientes");
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
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !cliente) {
    return (
      <ErrorComponent
        message="Cliente não encontrado"
        description="O cliente que procura não existe ou foi removido."
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{cliente.nome}</h1>
              <Badge variant={cliente.ativo ? "default" : "secondary"}>
                {cliente.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{cliente.tipo_display}</Badge>
              <span className="text-sm text-muted-foreground">
                Criado em{" "}
                {new Date(cliente.data_criacao).toLocaleDateString("pt-PT")}
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
            variant={cliente.ativo ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {cliente.ativo ? (
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
        {/* Dados do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Cliente</CardTitle>
            <CardDescription>Informações de identificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              {cliente.tipo === "P" ? (
                <User size={18} className="mt-0.5 text-muted-foreground" />
              ) : (
                <Building2 size={18} className="mt-0.5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Tipo</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.tipo_display}
                </p>
              </div>
            </div>

            {cliente.tipo === "E" && cliente.razao_social && (
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Razão Social</p>
                  <p className="text-sm text-muted-foreground">
                    {cliente.razao_social}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <CreditCard size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">NIF</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.nif || "Não informado"}
                </p>
              </div>
            </div>

            {cliente.tipo === "P" && cliente.bilhete_identidade && (
              <div className="flex items-start gap-3">
                <CreditCard
                  size={18}
                  className="mt-0.5 text-muted-foreground"
                />
                <div>
                  <p className="text-sm font-medium">Bilhete de Identidade</p>
                  <p className="text-sm text-muted-foreground">
                    {cliente.bilhete_identidade}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.email || "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.telefone || "Não informado"}
                </p>
              </div>
            </div>

            {cliente.website && (
              <div className="flex items-start gap-3">
                <Globe size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={cliente.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {cliente.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Registo</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(cliente.data_criacao).toLocaleDateString("pt-PT")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço</CardTitle>
            <CardDescription>Informações de localização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cliente.endereco ? (
              <>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Morada</p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.endereco.rua}, {cliente.endereco.bairro}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Localização</p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.endereco.municipio_nome},{" "}
                      {cliente.endereco.provincia_nome}
                    </p>
                  </div>
                </div>

                {cliente.endereco.ponto_referencia && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 text-muted-foreground"
                    />
                    <div>
                      <p className="text-sm font-medium">Ponto de Referência</p>
                      <p className="text-sm text-muted-foreground">
                        {cliente.endereco.ponto_referencia}
                      </p>
                    </div>
                  </div>
                )}

                {(cliente.endereco.latitude || cliente.endereco.longitude) && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 text-muted-foreground"
                    />
                    <div>
                      <p className="text-sm font-medium">Coordenadas</p>
                      <p className="text-sm text-muted-foreground">
                        Lat: {cliente.endereco.latitude || "-"}, Lng:{" "}
                        {cliente.endereco.longitude || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum endereço registado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição */}
      <ClienteForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={cliente}
        onSuccess={() => {
          setEditModalOpen(false);
        }}
      />

      {/* Modal de Eliminação */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        itemName={cliente.nome}
        title="Eliminar Cliente"
        description="Esta ação não pode ser desfeita. O cliente será removido permanentemente do sistema."
      />
    </div>
  );
}
