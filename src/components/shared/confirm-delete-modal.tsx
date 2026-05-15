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
      <AlertDialogContent className="max-w-100 border-2 border-destructive/20 shadow-2xl">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          {/* Icon de Aviso Animado */}
          <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive ring-8 ring-destructive/5">
            <AlertTriangle
              size={32}
              strokeWidth={2.5}
              className="animate-pulse"
            />
          </div>

          <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-muted-foreground font-medium">
            {description}
            {itemName && (
              <span className="block mt-2 font-black text-foreground uppercase italic bg-muted py-1 px-2 rounded border border-border/40">
                "{itemName}"
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            className="flex-1 h-12 font-bold uppercase tracking-widest border-2 hover:bg-muted transition-all"
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Evita fechar antes da mutation terminar
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex-1 h-12 font-black uppercase tracking-widest shadow-lg shadow-destructive/20 gap-2 transition-all active:scale-95",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 size={18} strokeWidth={2.5} />
            )}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
