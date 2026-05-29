// src/components/inventory/product-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductValues,
} from "@/src/schemas/product-schema";
import { useProductMutations } from "@/src/hooks/product/use-products";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

export function ProductForm({
  isOpen,
  onOpenChange,
  initialData,
}: ProductFormProps) {
  const { createMutation, updateMutation } = useProductMutations();

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      tipo: initialData?.tipo || "P",
      preco_venda: initialData?.preco_venda || "",
      ref_interna: initialData?.ref_interna || "",
      ativo: initialData?.ativo ?? true,
      categoria: initialData?.categoria || "",
      unidade_medida: initialData?.unidade_medida || "",
      taxa_iva: initialData?.taxa_iva || "",
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // FUNÇÃO DE SUBMISSÃO MULTIPART
  async function onSubmit(values: ProductValues) {
    const formData = new FormData();

    // 1. Adicionar todos os campos de texto/boolean ao FormData
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "imagem" && value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // 2. Adicionar a imagem se ela for um ficheiro
    if (values.imagem instanceof File) {
      formData.append("imagem", values.imagem);
    }

    try {
      if (initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro no envio:", error);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Arroz Tio Lucas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CAMPO DE IMAGEM (MULTIPART) */}
            <FormField
              control={form.control}
              name="imagem"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="font-bold">Imagem do Produto</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-border/60">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Clique para carregar foto
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...fieldProps}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preco_venda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Preço (Kz)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade_medida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Exemplo: A, B, AB, ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ref_interna"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Ref. Interna</FormLabel>
                    <FormControl>
                      <Input type="string" placeholder="P-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Activo</FormLabel>
                    <FormControl>
                      <Switch
                        checked={form.watch("ativo")}
                        onCheckedChange={(e) => form.setValue("ativo", e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="w-full font-bold shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Atualizar" : "Salvar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
