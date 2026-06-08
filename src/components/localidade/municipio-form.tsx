// src/components/localidade/municipio-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Save, X } from "lucide-react";

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

import { normalizeName } from "@/src/helpers/normalize-name";
import { useMunicipioMutations } from "@/src/hooks/localidade/use-municipio";
import {
  Municipio,
  MunicipioSchema,
} from "@/src/schemas/localidade/municipio-schema";
import { FormModal } from "../modals/form-model-shared";

interface MunicipioFormProps {
  initialData?: Municipio | null;
  onSuccess?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  provinciaId: string;
}

export function MunicipioForm({
  initialData,
  onSuccess,
  isOpen,
  onOpenChange,
  provinciaId,
}: MunicipioFormProps) {
  const { createMutation, updateMutation } = useMunicipioMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEditing = !!initialData?.id;

  const form = useForm<Municipio>({
    resolver: zodResolver(MunicipioSchema),
    defaultValues: {
      nome: "",
      provincia: provinciaId,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Sincroniza o formulário quando o modal abre ou os dados mudam
  useEffect(() => {
    if (isOpen) {
      if (initialData?.id) {
        form.reset({
          nome: initialData.nome,
          provincia: provinciaId,
        });
      } else {
        form.reset({
          nome: "",
          provincia: provinciaId,
        });
      }
      form.clearErrors();
    }
  }, [initialData, isOpen, provinciaId, form]);

  async function onSubmit(data: Municipio) {
    try {
      const normalizedData = {
        ...data,
        nome: normalizeName(data.nome),
      };

      if (!normalizedData.nome || normalizedData.nome.length < 2) {
        form.setError("nome", {
          type: "manual",
          message: "O nome do município deve ter pelo menos 3 caracteres",
        });
        return;
      }

      if (isEditing) {
        await updateMutation.mutateAsync(
          {
            data: { ...normalizedData, id: initialData!.id },
          },
          {
            onSuccess: () => {
              onSuccess?.();
              onOpenChange(false);
              form.reset();
            },
          },
        );
      } else {
        await createMutation.mutateAsync(normalizedData, {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
            form.reset();
          },
        });
      }
    } catch (error: any) {
      console.error("Erro na submissão:", error);

      if (
        error?.message?.includes("duplicate") ||
        error?.message?.includes("unique") ||
        error?.message?.includes("já existe")
      ) {
        form.setError("nome", {
          type: "manual",
          message: "Já existe um município com este nome nesta província",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message:
            error?.message ||
            "Erro ao processar a solicitação. Tente novamente.",
        });
      }
    }
  }

  return (
    <>
      <FormModal
        item="Município"
        onOpenChange={onOpenChange}
        open={isOpen}
        edit={isEditing}
      >
        <Form {...form}>
          <form
            id="municipio-form"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Erros de validação:", errors);
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
            className="space-y-5"
          >
            {/* Erro raiz (API) */}
            {form.formState.errors.root && (
              <Alert
                variant="destructive"
                className="rounded-lg border-destructive/30"
              >
                <AlertDescription className="text-sm font-medium">
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Campo: Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={cn(
                      "text-sm font-bold flex items-center gap-1.5 transition-colors",
                      fieldState.error ? "text-destructive" : "text-foreground",
                    )}
                  >
                    Nome do Município
                    <span className="text-destructive text-xs font-normal">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ex: Cazenga, Talatona, Viana"
                        {...field}
                        maxLength={50}
                        autoFocus
                        className={cn(
                          "h-11 pl-10 rounded-xl border-2 font-medium text-sm transition-all",
                          fieldState.error
                            ? "border-destructive/50 bg-destructive/5 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                            : "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
                          !fieldState.error &&
                            fieldState.isDirty &&
                            !fieldState.invalid &&
                            "border-emerald-500/50",
                        )}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? "nome-error" : undefined
                        }
                      />
                    </div>
                  </FormControl>
                  <div className="flex justify-between items-center min-h-[20px]">
                    {fieldState.error ? (
                      <FormMessage className="text-xs font-semibold" />
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        Nome oficial do município
                      </span>
                    )}
                    {field.value && field.value.length > 0 && (
                      <span
                        className={cn(
                          "text-[10px] font-medium tabular-nums transition-colors",
                          field.value.length > 40
                            ? "text-amber-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {field.value.length}/50
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="border-t border-border bg-muted/20 px-6 py-4 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 font-semibold gap-2 border-border hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <X size={16} />
            Cancelar
          </Button>
          <Button
            type="submit"
            form="municipio-form"
            className={cn(
              "h-10 font-bold gap-2 shadow-lg transition-all active:scale-[0.97]",
              !isLoading && "shadow-primary/20 hover:shadow-primary/30",
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "A atualizar..." : "A criar..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "Atualizar Município" : "Criar Município"}
              </>
            )}
          </Button>
        </DialogFooter>
      </FormModal>
    </>
  );
}
