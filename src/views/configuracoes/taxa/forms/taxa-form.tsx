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
  const [isIsencao, setIsIsencao] = useState(
    !!defaultValues?.motivo_isencao || !!defaultValues?.codigo_isencao_agt,
  );

  const form = useForm<Taxa>({
    resolver: zodResolver(TaxaSchema),
    defaultValues: {
      codigo: defaultValues?.codigo || "",
      codigo_isencao_agt: defaultValues?.codigo_isencao_agt || "",
      descricao: defaultValues?.descricao || "",
      valor: defaultValues?.valor ?? 0,
      motivo_isencao: defaultValues?.motivo_isencao || "",
    },
  });

  return (
    <FormModal item="Taxa" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Código */}
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código da Taxa *</FormLabel>
                  <FormControl>
                    <Input placeholder="IVA_14" {...field} />
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
                  <FormLabel>Valor da Taxa (%) *</FormLabel>
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
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
                <FormLabel>Descrição *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Imposto sobre o Valor Acrescentado - Regime Geral"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Switch de Isenção */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Taxa isenta?</Label>
              <p className="text-sm text-muted-foreground">
                Active apenas quando esta taxa representar uma isenção ou
                redução específica (ex: 0%).
              </p>
            </div>
            <Switch
              checked={isIsencao}
              onCheckedChange={(checked) => {
                setIsIsencao(checked);
                if (!checked) {
                  form.setValue("motivo_isencao", "");
                  form.setValue("codigo_isencao_agt", "");
                }
              }}
            />
          </div>

          {/* Campos condicionais (motivo e código AGT) */}
          {isIsencao && (
            <div className="space-y-5 rounded-lg border border-dashed border-border bg-muted/20 p-4">
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
                    <FormLabel>Código de Isenção (AGT)</FormLabel>
                    <FormControl>
                      <Input placeholder="M02, M04, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 sm:w-auto"
          >
            <Save size={16} />
            {isLoading ? "A guardar..." : "Guardar taxa"}
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
      updateMutation.mutateAsync({ data: { ...data, id: defaultData.id } });
    } else {
      createMutation.mutateAsync(data);
    }
  };

  return { onSubmit, isLoading };
}
