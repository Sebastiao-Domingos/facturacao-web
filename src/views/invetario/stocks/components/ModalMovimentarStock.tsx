// src/components/stock/ModalMovimentarStock.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStockMutations } from "@/src/hooks/empresa/afilia/use-stock";
import {
  MovimentacaoFormData,
  MovimentacaoFormSchema,
  defaultMovimentacaoForm,
  formatQuantidade,
  parseQuantidade,
  validarQuantidadeDisponivel,
} from "@/src/schemas/empresa/afilias/stock-schema";

interface ModalMovimentarStockProps {
  stockId: string;
  produtoNome: string;
  filialNome: string;
  quantidadeAtual: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalMovimentarStock({
  stockId,
  produtoNome,
  filialNome,
  quantidadeAtual,
  isOpen,
  onClose,
  onSuccess,
}: ModalMovimentarStockProps) {
  const { movimentarMutation } = useStockMutations();
  const isSubmitting = movimentarMutation.isPending;

  const form = useForm<MovimentacaoFormData>({
    resolver: zodResolver(MovimentacaoFormSchema),
    defaultValues: defaultMovimentacaoForm,
  });

  const tipo = form.watch("tipo");

  // Reset do formulário ao abrir
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultMovimentacaoForm);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: MovimentacaoFormData) => {
    const quantidade = parseQuantidade(data.quantidade);

    if (
      data.tipo === "S" &&
      !validarQuantidadeDisponivel(quantidade, quantidadeAtual)
    ) {
      form.setError("quantidade", {
        type: "manual",
        message: `Quantidade insuficiente em stock. Disponível: ${formatQuantidade(quantidadeAtual)}`,
      });
      return;
    }

    try {
      await movimentarMutation.mutateAsync({
        stockId,
        payload: {
          tipo: data.tipo,
          quantidade,
          origem_destino: data.origem_destino,
        },
      });
      onClose();
      onSuccess?.();
    } catch (err) {
      // Erro já tratado pelo mutation onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Ajustar Stock Manual
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {produtoNome} —{" "}
            <span className="font-medium text-primary">{filialNome}</span>
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Tipo de Operação */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Tipo de Operação *
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                    <button
                      type="button"
                      onClick={() => field.onChange("E")}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                        field.value === "E"
                          ? "bg-background text-emerald-600 shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <TrendingUp size={16} />
                      Entrada (Aumento)
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("S")}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all",
                        field.value === "S"
                          ? "bg-background text-rose-600 shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <TrendingDown size={16} />
                      Saída (Retirada)
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Quantidade <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0,000"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Use até 3 casas decimais. Exemplo: 1.500 (para 1.5 unidades)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Justificação */}
            <FormField
              control={form.control}
              name="origem_destino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Motivo / Justificação{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Contagem física, Ajuste de quebra, Devolução, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informação de stock atual */}
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Stock actual:</span>
              <span className="ml-2 font-semibold">
                {formatQuantidade(quantidadeAtual)} unidades
              </span>
            </div>

            <DialogFooter className="gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  tipo === "E"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700",
                )}
              >
                {isSubmitting ? "A processar..." : "Confirmar Ajuste"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
