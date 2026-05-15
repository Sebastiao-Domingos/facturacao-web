// src/components/modals/taxa-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaxaForm } from "../empresa/taxa/taxa-form";
import { Taxa } from "../../schemas/configuracoes/taxa-schema";

interface TaxaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<Taxa>;
  onSuccess?: () => void;
}

export function TaxaModal({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
}: TaxaModalProps) {
  const handleSubmit = async (data: Taxa) => {
    try {
      // TODO: Chamar API ou mutation (React Query / TanStack Query)
      console.log("Taxa salva:", data);

      // Simulação de sucesso
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar taxa:", error);
      // Mostrar toast de erro aqui
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {defaultValues?.id
              ? "Editar Taxa de Imposto"
              : "Nova Taxa de Imposto"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da taxa. Os campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <TaxaForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
