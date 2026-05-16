// src/components/forms/taxa-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Save } from "lucide-react";
import { FormModal } from "@/src/components/modals/form-model-shared";

import { useAfiliaMutations } from "@/src/hooks/empresa/afilia/use-afilia";
import {
  Afilias,
  AfiliasSchema,
} from "@/src/schemas/empresa/afilias/afilia-schema";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";

interface UnidadeFormProps {
  defaultValues?: Afilias;
  onOpenChange: (value: boolean) => void;
  open: boolean;
}

export function AfilialForm({
  defaultValues,
  onOpenChange,
  open,
}: UnidadeFormProps) {
  const { onSubmit, isLoading } = useFormAfilia({
    defaultData: defaultValues,
  });

  const form = useForm<Afilias>({
    resolver: zodResolver(AfiliasSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      nome: defaultValues?.nome || "",
      codigo_agt: defaultValues?.codigo_agt || undefined,
      e_sede: defaultValues?.e_sede || false,
      serie_documentos: defaultValues?.serie_documentos || "",
      endereco: defaultValues?.endereco || undefined,
      empresa: defaultValues?.empresa || undefined,
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  return (
    <FormModal item="fialial" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="e_sede"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div>
                      <Label className="font-medium">
                        Esta filial é a sede?{" "}
                      </Label>
                      <p className="text-sm text-red-800">
                        Seleciona apenas caso a filial seja a sede.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        onCheckedChange={(e) => {
                          field.value = e;
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            {/* Código */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cooperation-2"
                      {...field}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor (%) */}
            <FormField
              control={form.control}
              name="serie_documentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Serie de documento (A,B,C, BB,...)
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="A, B, C, CD" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codigo_agt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Código da AGT
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="AGT001, AGT056" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label>Endereço</Label>
            <div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="endereco.provincia_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Província
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AsyncFancySelect
                          {...field}
                          endpoint="/organizacao/provincias"
                          valueField="id"
                          displayField="nome"
                          searchable
                          searchField="nome"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endereco.municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Município
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AsyncFancySelect
                          {...field}
                          endpoint={`/organizacao/municipios?provincia=${form.watch("endereco.provincia_id")}`}
                          valueField="id"
                          displayField="nome"
                          placeholder="Seleciona o município"
                          searchable
                          searchField="nome"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bairro
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Rangel, Palanca" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco.rua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rua
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Rua A, Rua N/A" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco.ponto_referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ponto de referência
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Kero , Shoprite" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco.longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Longitude
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" placeholder="-5.7879" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco.latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Latitude
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" placeholder="-5.7879" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
            onClick={() => console.log(form.formState.errors)}
          >
            <Save size={20} />
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </Form>
    </FormModal>
  );
}

function useFormAfilia({ defaultData }: { defaultData?: Afilias } = {}) {
  const { createMutation, updateMutation } = useAfiliaMutations();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: Afilias) => {
    console.log(data);
    if (defaultData) {
      data.id = defaultData?.id;
      updateMutation.mutateAsync({ data });

      return;
    }

    createMutation.mutateAsync(data);
  };

  return { onSubmit, isLoading };
}
