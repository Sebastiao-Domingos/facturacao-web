// src/components/forms/unidade-form.tsx
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Quilograma, Litro, Metro, Caixa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sigla"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sigla <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="kg, L, m, cx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 sm:w-auto"
          >
            <Save size={16} />
            {isLoading ? "A guardar..." : "Guardar unidade"}
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
      updateMutation.mutateAsync({ data: { ...data, id: defaultData.id } });
    } else {
      createMutation.mutateAsync(data);
    }
  };

  return { onSubmit, isLoading };
}
