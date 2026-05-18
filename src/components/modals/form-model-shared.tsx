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
import { useState } from "react";

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
      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {edit ? `Editar ${item}` : `Novo ${item}`}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do(a) {item} abaixo.
          </DialogDescription>
          <p className="text-xs text-muted-foreground">
            * Campos marcados são obrigatórios
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] overflow-y-auto">
          <div className="p-1">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface OpenModalProps<T> {
  isOpened: boolean;
  defaultValue?: T;
  isOpenedDeleteModal?: boolean;
  id?: string;
}

export function useOpenModal<T>() {
  const [openModal, setOpenModal] = useState<OpenModalProps<T>>({
    isOpened: false,
    defaultValue: undefined,
  });

  return {
    openModal,
    setOpenModal,
  };
}
