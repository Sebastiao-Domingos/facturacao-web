// src/components/forms/taxa-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaxaSchema, Taxa } from "@/src/schemas/configuracoes/taxa-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { FormModal } from "@/src/components/modals/form-model-shared";
import { useTaxaMutations } from "@/src/hooks/configuracao/use-taxa";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TaxaFormProps {
  defaultValues?: Taxa;
  onOpenChange: (value: boolean) => void;
  open: boolean;
}

export function TaxaForm({ defaultValues, onOpenChange, open }: TaxaFormProps) {
  const { onSubmit, isLoading } = useFormTaxa({ defaultData: defaultValues });
  const [ativo, setAtivo] = useState(false);

  const form = useForm<Taxa>({
    resolver: zodResolver(TaxaSchema),
    defaultValues: {
      codigo: "",
      valor: "",
      descricao: "",
      motivo_isencao: "",
      ...defaultValues,
    },
  });

  return (
    <FormModal item="Taxa" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código */}
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Código da Taxa <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="IVA_14"
                      {...field}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormDescription>Ex: IVA_14, IRPS_10, ISENTO</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor (%) */}
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Valor da Taxa (%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="14.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descrição */}
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descrição <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Imposto sobre o Valor Acrescentado - Regime Geral"
                    className="min-h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <Label className="font-medium">Isento da Taxa</Label>
              <p className="text-sm text-red-800">
                Seleciona apenas quando esta taxa for uma isenção ou redução
                específica.
              </p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={(checked) => {
                setAtivo(checked);

                if (!checked) {
                  form.setValue("motivo_isencao", undefined);
                  form.setValue("codigo_isencao_agt", undefined);
                }
              }}
            />
          </div>

          {ativo && (
            <>
              {/* Motivo de Isenção */}
              <FormField
                control={form.control}
                name="motivo_isencao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de Isenção</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Isento nos termos do artigo 12º da Lei n.º XX/XX"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo_isencao_agt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Isenção da AGT</FormLabel>
                    <FormControl>
                      <Input placeholder="AGT-0000-07" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
          >
            <Save size={20} />
            {isLoading ? "Guardando..." : "Guardar Taxa"}
          </Button>
        </form>
      </Form>
    </FormModal>
  );
}

function useFormTaxa({ defaultData }: { defaultData?: Taxa } = {}) {
  const { createMutation, updateMutation } = useTaxaMutations();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: Taxa) => {
    if (defaultData) {
      data.id = defaultData?.id;
      updateMutation.mutateAsync({ data });

      return;
    }

    createMutation.mutateAsync(data);
  };

  return { onSubmit, isLoading };
}
