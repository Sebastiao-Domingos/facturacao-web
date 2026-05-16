// src/components/forms/taxa-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FormModal } from "@/src/components/modals/form-model-shared";

import {
  Unidade,
  UnidadeSchema,
} from "@/src/schemas/configuracoes/unidade-schema";
import { useUnidadeMutations } from "@/src/hooks/configuracao/use-unidade";

interface UnidadeFormProps {
  defaultValues?: Unidade;
  onOpenChange: (value: boolean) => void;
  open: boolean;
}

export function UnidadeForm({
  defaultValues,
  onOpenChange,
  open,
}: UnidadeFormProps) {
  const { onSubmit, isLoading } = useFormUnidade({
    defaultData: defaultValues,
  });

  const form = useForm<Unidade>({
    resolver: zodResolver(UnidadeSchema),
    defaultValues: {
      nome: defaultValues?.nome || "",
      sigla: defaultValues?.sigla || "",
    },
  });

  return (
    <FormModal item="Unidade" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Código */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Caixa, Litro, Metro , ...."
                      {...field}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor (%) */}
            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sigla (Kg, CX, Un, ...){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Kg, m, l, CX" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
          >
            <Save size={20} />
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </Form>
    </FormModal>
  );
}

function useFormUnidade({ defaultData }: { defaultData?: Unidade } = {}) {
  const { createMutation, updateMutation } = useUnidadeMutations();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: Unidade) => {
    if (defaultData) {
      data.id = defaultData?.id;
      updateMutation.mutateAsync({ data });

      return;
    }

    createMutation.mutateAsync(data);
  };

  return { onSubmit, isLoading };
}
