// src/components/inventory/category-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  CategoriaDetalhesSchema,
  type Categoria,
} from "@/src/schemas/product-schema";
import { useCategoryMutations } from "@/src/hooks/product/use-categoria";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormModal } from "@/src/components/modals/form-model-shared";

interface CategoriaFormProps {
  initialData?: Categoria;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryForm({
  initialData,
  isOpen,
  onOpenChange,
  onSuccess,
}: CategoriaFormProps) {
  const { onSubmit, isLoading } = useFormCategory(initialData, onSuccess);

  const form = useForm<Categoria>({
    resolver: zodResolver(CategoriaDetalhesSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      descricao: initialData?.descricao || "",
    },
    mode: "onChange",
  });

  // Reset do formulário quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (initialData?.id) {
        form.reset({
          nome: initialData.nome,
          descricao: initialData.descricao || "",
        });
      } else {
        form.reset({ nome: "", descricao: "" });
      }
      form.clearErrors();
    }
  }, [initialData, isOpen, form]);

  return (
    <FormModal
      item="Categoria"
      open={isOpen}
      onOpenChange={onOpenChange}
      edit={!!initialData?.id}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Erros de validação:", errors);
            const firstError = Object.keys(errors)[0];
            if (firstError) {
              const element = document.querySelector(`[name="${firstError}"]`);
              element?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          })}
          className="space-y-5"
        >
          {/* Erro geral da API */}
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Campo: Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Nome da categoria <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Eletrónicos, Higiene, Vestuário"
                    {...field}
                    maxLength={50}
                    className={cn(
                      "transition-all",
                      fieldState.error && "border-destructive",
                    )}
                  />
                </FormControl>
                {field.value && (
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {field.value.length}/50
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo: Descrição */}
          <FormField
            control={form.control}
            name="descricao"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Breve descrição sobre a categoria"
                    {...field}
                    maxLength={200}
                    className={cn(
                      "transition-all",
                      fieldState.error && "border-destructive",
                    )}
                  />
                </FormControl>
                {field.value && (
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {field.value.length}/200
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-xs text-muted-foreground">* Campo obrigatório</p>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                  processar...
                </>
              ) : initialData ? (
                "Actualizar"
              ) : (
                "Criar categoria"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormModal>
  );
}

export function useFormCategory(
  defaultValues?: Categoria,
  onSuccess?: () => void,
) {
  const { createMutation, updateMutation, deleteMutation } =
    useCategoryMutations();

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  async function onSubmit(data: Categoria) {
    if (defaultValues?.id) {
      await updateMutation.mutateAsync({
        data: { ...data, id: defaultValues.id },
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    onSuccess?.();
  }

  async function onSubmitDelete(id: string) {
    await deleteMutation.mutateAsync(id);
  }

  return { isLoading, onSubmit, onSubmitDelete };
}
