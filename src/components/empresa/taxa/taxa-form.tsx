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
import { Percent, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaxaFormProps {
  defaultValues?: Partial<Taxa>;
  onSubmit: (data: Taxa) => Promise<void>;
  isLoading?: boolean;
}

export function TaxaForm({
  defaultValues,
  onSubmit,
  isLoading,
}: TaxaFormProps) {
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="text-emerald-600" />
          {defaultValues?.id ? "Editar Taxa" : "Nova Taxa de Imposto"}
        </CardTitle>
      </CardHeader>

      <CardContent>
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
                    <FormDescription>
                      Ex: IVA_14, IRPS_10, ISENTO
                    </FormDescription>
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

            {/* Motivo de Isenção */}
            <FormField
              control={form.control}
              name="motivo_isencao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Isenção (opcional)</FormLabel>
                  <FormControl>
                    {/* <Textarea 
                      placeholder="Isento nos termos do artigo 12º da Lei n.º XX/XX" 
                      {...field} 
                    /> */}
                  </FormControl>
                  <FormDescription>
                    Preencha apenas quando esta taxa for uma isenção ou redução
                    específica.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </CardContent>
    </Card>
  );
}
