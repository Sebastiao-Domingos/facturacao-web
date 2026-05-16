// src/components/modals/taxa-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edit?: boolean;
  item: string;
  children: React.ReactNode;
}

export function FormModal({
  open,
  onOpenChange,
  item,
  edit,
  children,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 border-border/60 shadow-2xl overflow-hidden max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            {edit ? `Editar dados do(a) ${item}` : `Criar novo(a) ${item}`}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Introduza os dados do(a) {item} cuidadosamente.
          </DialogDescription>
          {/* Indicador de campos obrigatórios */}
          <p className="text-xs text-red-500 text-center">
            * Campos marcados são obrigatórios
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[72vh] overflow-y-auto">
          <div>{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
