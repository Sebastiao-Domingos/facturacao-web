// src/components/inventory/category-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProvinciaMutations } from "@/src/hooks/localidade/use-provincia";
import {
  Provincia,
  ProvinciaSchema,
} from "@/src/schemas/localidade/provincia-schema";
import { normalizeName } from "@/src/helpers/normalize-name";

interface ProvinciaFormProps {
  initialData?: Provincia | null;
  onSuccess?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProvinciaForm({
  initialData,
  onSuccess,
  isOpen,
  onOpenChange,
}: ProvinciaFormProps) {
  const { createMutation, updateMutation } = useProvinciaMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<Provincia>({
    resolver: zodResolver(ProvinciaSchema),
    defaultValues: {
      nome: "",
    },
    mode: "onChange", // Validação em tempo real
    reValidateMode: "onChange",
  });

  // Sincroniza o formulário quando o modal abre ou os dados mudam
  useEffect(() => {
    if (isOpen) {
      if (initialData?.id) {
        form.reset({
          nome: initialData.nome,
        });
      } else {
        form.reset({ nome: "" });
      }
      // Limpa erros do formulário ao abrir
      form.clearErrors();
    }
  }, [initialData, isOpen, form]);

  async function onSubmit(data: Provincia) {
    try {
      // Normaliza os dados antes de enviar
      const normalizedData = {
        ...data,
        nome: normalizeName(data.nome),
      };

      // Validação adicional antes de enviar
      if (!normalizedData.nome || normalizedData.nome.length < 2) {
        form.setError("nome", {
          type: "manual",
          message: "Nome da província deve ter pelo menos 3 caracteres",
        });
        return;
      }

      if (initialData?.id) {
        // Lógica de Edição
        await updateMutation.mutateAsync(
          {
            data: { ...normalizedData, id: initialData.id },
          },
          {
            onSuccess: () => {
              if (onSuccess) {
                onSuccess();
              }
              onOpenChange(false);
              form.reset();
            },
          }
        );
      } else {
        // Lógica de Criação
        await createMutation.mutateAsync(normalizedData, {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            }
            onOpenChange(false);
            form.reset();
          },
        });
      }
    } catch (error: any) {
      console.error("Erro na submissão:", error);

      // Tratamento de erros específicos da API
      if (
        error?.message?.includes("duplicate") ||
        error?.message?.includes("unique")
      ) {
        form.setError("nome", {
          type: "manual",
          message: "Já existe uma  porovíncia com este nome",
        });
      } else {
        // Mostrar erro genérico no formulário
        form.setError("root", {
          type: "manual",
          message: error?.message || "Erro ao processar a solicitação",
        });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 border-border/60 shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            {initialData ? "Editar Província" : "Nova Porvíncia"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Introduza os detalhes da Província.
          </DialogDescription>
          {/* Indicador de campos obrigatórios */}
          <div className="text-xs text-red-500 text-center">
            * Campos marcados são obrigatórios
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              // Log de validação falha (opcional para debugging)
              console.log("Erros de validação:", errors);
              // Rolar para o primeiro erro
              const firstError = Object.keys(errors)[0];
              if (firstError) {
                const element = document.querySelector(
                  `[name="${firstError}"]`
                );
                element?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            })}
            className="space-y-6 pt-4"
          >
            {/* Erro raiz (API) */}
            {form.formState.errors.root && (
              <Alert variant="destructive" className="mb-4">
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
                  <FormLabel
                    className={cn(
                      "font-bold transition-colors flex items-center gap-2",
                      fieldState.error && "text-destructive"
                    )}
                  >
                    Nome
                    <span className="text-xs text-red-500 font-normal">
                      (*)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Luanda, Uíge"
                      {...field}
                      maxLength={50}
                      className={cn(
                        "h-12 transition-all border-2 font-medium",
                        fieldState.error
                          ? "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive"
                          : "border-border/60 focus-visible:ring-primary focus-visible:border-primary",
                        !fieldState.error &&
                          fieldState.isDirty &&
                          !fieldState.invalid &&
                          "border-green-500/50"
                      )}
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.error ? "nome-error" : undefined
                      }
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage className="text-[10px] font-extrabold uppercase tracking-widest italic" />
                    {field.value && field.value.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {field.value.length}/50
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-12 font-semibold"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="category-form"
                className={cn(
                  "h-14 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex-1",
                  !isLoading && "shadow-primary/40 hover:bg-primary/90"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />A
                    Processar...
                  </>
                ) : initialData ? (
                  "Atualizar"
                ) : (
                  "Registar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
