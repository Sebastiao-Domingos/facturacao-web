"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  // Novas props para personalização
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  confirmText?: string;
  confirmIcon?: React.ReactNode;
  cancelText?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  title = "Confirmar Acção",
  description = "Tem certeza que deseja continuar?",
  itemName,
  confirmVariant = "destructive",
  confirmText = "Confirmar",
  confirmIcon = <Trash2 size={16} strokeWidth={2} />,
  cancelText = "Cancelar",
  icon = <AlertTriangle size={28} strokeWidth={2} />,
  iconClassName = "bg-destructive/10 text-destructive",
}: ConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mb-4 flex items-center justify-center">
            <div className={cn("rounded-full p-3", iconClassName)}>{icon}</div>
          </div>

          <AlertDialogTitle className="text-center text-xl font-semibold">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            {description}
            {itemName && (
              <span className="mt-2 block rounded border border-border bg-muted px-2 py-1 font-mono text-sm font-medium">
                {itemName}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex-col gap-3 sm:flex-row">
          <AlertDialogCancel disabled={isLoading} className="flex-1">
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              buttonVariants({ variant: confirmVariant }),
              "flex-1 gap-2",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmIcon
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Componente de retrocompatibilidade (para eliminação)
export function ConfirmDeleteModal(
  props: Omit<
    ConfirmModalProps,
    "confirmVariant" | "confirmText" | "confirmIcon" | "icon" | "iconClassName"
  >,
) {
  return (
    <ConfirmModal
      {...props}
      title={props.title || "Eliminar Item"}
      description={
        props.description ||
        "Esta ação não pode ser desfeita. O item será removido permanentemente do sistema."
      }
      confirmVariant="destructive"
      confirmText="Eliminar"
      confirmIcon={<Trash2 size={16} strokeWidth={2} />}
      icon={<AlertTriangle size={28} strokeWidth={2} />}
      iconClassName="bg-destructive/10 text-destructive"
    />
  );
}
