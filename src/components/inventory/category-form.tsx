// src/components/inventory/category-form.tsx
"use client";

import { useEffect, useCallback } from "react";
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

interface CategoriaFormProps {
  initialData?: Categoria | null;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryForm({
  initialData,
  onSuccess,
  isOpen,
  onOpenChange,
}: CategoriaFormProps) {
  const { createMutation, updateMutation } = useCategoryMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<Categoria>({
    resolver: zodResolver(CategoriaDetalhesSchema),
    defaultValues: {
      nome: "",
      descricao: "",
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
          descricao: initialData.descricao || "",
        });
      } else {
        form.reset({ nome: "", descricao: "" });
      }
      // Limpa erros do formulário ao abrir
      form.clearErrors();
    }
  }, [initialData, isOpen, form]);

  // Função para normalizar o nome da categoria (remover espaços extras)
  const normalizeCategoryName = useCallback((name: string) => {
    return name.trim().replace(/\s+/g, " ");
  }, []);

  async function onSubmit(data: Categoria) {
    try {
      // Normaliza os dados antes de enviar
      const normalizedData = {
        ...data,
        nome: normalizeCategoryName(data.nome),
        descricao: data.descricao?.trim() || "",
      };

      // Validação adicional antes de enviar
      if (!normalizedData.nome || normalizedData.nome.length < 2) {
        form.setError("nome", {
          type: "manual",
          message: "Nome da categoria deve ter pelo menos 2 caracteres",
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
              onSuccess();
              onOpenChange(false);
              form.reset();
            },
          },
        );
      } else {
        // Lógica de Criação
        await createMutation.mutateAsync(normalizedData, {
          onSuccess: () => {
            onSuccess();
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
          message: "Já existe uma categoria com este nome",
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

  // Função para validar em tempo real se o nome já contém apenas espaço

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 border-border/60 shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Introduza os detalhes da categoria para organizar o seu stock.
          </DialogDescription>
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
                  `[name="${firstError}"]`,
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
                      fieldState.error && "text-destructive",
                    )}
                  >
                    Nome da Categoria
                    <span className="text-xs text-muted-foreground font-normal">
                      (obrigatório)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Eletrónicos, Higiene..."
                      {...field}
                      onChange={(e) => {
                        // Impede caracteres especiais no início (opcional)
                        const value = e.target.value;
                        // Permite apenas letras, números, espaços e alguns caracteres
                        if (
                          (value.length > 0 &&
                            /^[a-zA-Z0-9áéíóúâêôçãõÀÉÍÓÚÂÊÔÇÃÕ\s\-]+$/.test(
                              value,
                            )) ||
                          value === ""
                        ) {
                          field.onChange(value);
                        } else if (value === "") {
                          field.onChange(value);
                        }
                      }}
                      maxLength={50}
                      className={cn(
                        "h-12 transition-all border-2 font-medium",
                        fieldState.error
                          ? "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive"
                          : "border-border/60 focus-visible:ring-primary focus-visible:border-primary",
                        !fieldState.error &&
                          fieldState.isDirty &&
                          !fieldState.invalid &&
                          "border-green-500/50",
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

            {/* Campo: Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      "font-bold transition-colors",
                      fieldState.error && "text-destructive",
                    )}
                  >
                    Descrição
                    <span className="text-xs text-muted-foreground font-normal ml-2">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Breve descrição sobre a categoria..."
                      {...field}
                      value={field.value}
                      maxLength={200}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className={cn(
                        "h-12 transition-all border-2 font-medium",
                        fieldState.error
                          ? "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive"
                          : "border-border/60 focus-visible:ring-primary focus-visible:border-primary",
                      )}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage className="text-[10px] font-extrabold uppercase tracking-widest italic" />
                    {field.value && field.value.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {field.value.length}/200
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* Indicador de campos obrigatórios */}
            <div className="text-xs text-muted-foreground text-center">
              * Campos marcados são obrigatórios
            </div>

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
                  !isLoading && "shadow-primary/40 hover:bg-primary/90",
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />A
                    Processar...
                  </>
                ) : initialData ? (
                  "Atualizar Categoria"
                ) : (
                  "Registar Categoria"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
