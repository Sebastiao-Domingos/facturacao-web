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
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  title = "Eliminar Item",
  description = "Esta ação não pode ser desfeita. O item será removido permanentemente do sistema.",
  itemName,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {/* Ícone de Aviso */}
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertTriangle size={28} strokeWidth={2} />
            </div>
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
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex-1 gap-2",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 size={16} strokeWidth={2} />
            )}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
