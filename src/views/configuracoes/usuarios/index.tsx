// src/app/(dashboard)/utilizadores/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/error-component";
import {
  useResetPassword,
  useUsers,
} from "@/src/hooks/empresa/usuario/use-usuario";
import { usePermissions } from "@/src/hooks/authorition/use-permition";
import { User } from "@/src/schemas/empresa/usuarios/user-schema";
import { ConfirmModal } from "@/src/components/shared/confirm-delete-modal";
import { AccessDenied } from "@/src/components/AccessDinied";
import { LoadingSkeleton } from "@/src/components/shared/LoadingSkeleton";

export function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const { data, isLoading, isError } = useUsers({
    search: searchTerm || undefined,
  });
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const {
    isAdmin,
    isSuperAdmin,
    isLoading: isLoadingPermissions,
  } = usePermissions();

  const users = data?.results || [];

  const columns: ColumnDef<User>[] = [
    { accessorKey: "email", header: "Email", sortable: true, filterable: true },
    {
      accessorKey: "nome_completo",
      header: "Nome",
      sortable: true,
      filterable: true,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      width: 100,
      sortable: true,
      cell: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      accessorKey: "last_login",
      header: "Último acesso",
      sortable: true,
      cell: (value) =>
        value
          ? format(new Date(String(value)), "dd/MM/yyyy HH:mm", { locale: pt })
          : "Nunca",
    },
  ];

  const handleResetPassword = (user: User) => {
    setSelectedUserId(user.id);
    setResetModalOpen(true);
  };

  const confirmReset = async () => {
    if (selectedUserId) {
      await resetPassword({
        newPassword: "temp123456",
      }); // ou pedir nova senha
      setResetModalOpen(false);
    }
  };

  if (isError) {
    return <ErrorComponent message="Erro ao carregar utilizadores" />;
  }

  if (isLoading || isLoadingPermissions) {
    return (
      <LoadingSkeleton
        type="table"
        count={6}
        columns={8}
        showHeader={true}
        title="Utilizadores"
        description="Gerencie os utilizadores do sistema"
        showAction={true}
      />
    );
  }

  if (!isAdmin && !isSuperAdmin) {
    return (
      <AccessDenied
        message="Acesso restrito a administradores"
        description="Apenas administradores podem visualizar e gerir utilizadores do sistema."
        showBackButton={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Utilizadores"
        description="Gerencie os utilizadores do sistema."
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por email ou nome..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTableV2
        data={users}
        columns={columns}
        rowKey="id"
        globalSearch={false}
        showCount
        density="compact"
        emptyMessage="Nenhum utilizador encontrado."
        customActions={[
          {
            key: "reset-password",
            label: "Redefinir senha",
            icon: <KeyRound size={14} />,
            variant: "default",
            onClick: handleResetPassword,
          },
        ]}
      />
      <ConfirmModal
        isOpen={resetModalOpen}
        onOpenChange={setResetModalOpen}
        onConfirm={confirmReset}
        title="Redefinir palavra-passe"
        description="A nova palavra-passe será 'temp123456' (ou pode pedir ao utilizador para definir depois). Deseja continuar?"
        confirmVariant="default"
        confirmText="Redefinir"
        isLoading={isPending}
      />
    </div>
  );
}
