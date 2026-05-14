// src/components/inventory/product-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoriaDetalhesSchema,
  type Categoria,
} from "@/src/schemas/product-schema";
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
import { useCategoryMutations } from "@/src/hooks/product/use-categoria";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // 1. Inicializamos o formulário com o tipo 'Product'
  const form = useForm<Categoria>({
    resolver: zodResolver(CategoriaDetalhesSchema),
    defaultValues: initialData || {
      id: "",
      descricao: "",
      nome: "",
    },
  });

  async function onSubmit(data: Categoria) {
    console.log("Data : ", data);
    try {
      if (initialData?.id) {
        // Para o Django, no PATCH, enviamos o ID e o corpo do objeto
        data.id = initialData.id;
        await updateMutation.mutateAsync(
          {
            data: data,
          },
          {
            onSuccess: () => onSuccess(),
          }
        );
      } else {
        // No POST, enviamos o objeto diretamente
        await createMutation.mutateAsync(data, {
          onSuccess: () => onSuccess(),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Erro na submissão:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
            {initialData ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            Preencha cuidadosamente os dados abaixo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-4"
          >
            {/* Nome do Produto */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Ferramentas"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Ferramentas"
                      {...field}
                      className="h-11 border-border/60 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="flex-1 h-12 font-bold shadow-lg shadow-primary/50 text-md cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />A
                    processar...
                  </>
                ) : initialData ? (
                  "Guardar Alterações"
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
