// src/components/empresa/EmpresaForm.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";
import {
  EmpresaFormData,
  EmpresaFormSchema,
} from "@/src/schemas/empresa/empresa-schema";
import { Empresa } from "@/src/schemas/empresa/empresa-schema";

interface EmpresaFormProps {
  empresa: Empresa;
  onSubmit: (data: EmpresaFormData) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

export function EmpresaForm({
  empresa,
  onSubmit,
  onCancel,
  isPending = false,
}: EmpresaFormProps) {
  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(EmpresaFormSchema),
    defaultValues: {
      nome_fantasia: "",
      razao_social: "",
      nif: "",
      moeda_padrao: "AOA",
      regime_tributario: "",
      endereco: {
        bairro: "",
        rua: "",
        ponto_referencia: "",
        municipio: "",
      },
    },
  });

  // Preencher formulário quando a empresa mudar
  useEffect(() => {
    if (empresa) {
      form.reset({
        nome_fantasia: empresa.nome_fantasia,
        razao_social: empresa.razao_social,
        nif: empresa.nif,
        moeda_padrao: empresa.moeda_padrao || "AOA",
        regime_tributario: empresa.regime_tributario || "",
        endereco: {
          bairro: empresa.endereco?.bairro || "",
          rua: empresa.endereco?.rua || "",
          ponto_referencia: empresa.endereco?.ponto_referencia || "",
          municipio: empresa.endereco?.municipio || "",
        },
      });
    }
  }, [empresa, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nome_fantasia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Minha Empresa Ltda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="razao_social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social *</FormLabel>
                <FormControl>
                  <Input placeholder="Razão social oficial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIF *</FormLabel>
                <FormControl>
                  <Input placeholder="000000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="moeda_padrao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moeda Padrão</FormLabel>
                <FormControl>
                  <Input placeholder="AOA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regime_tributario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime Tributário</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Regime Geral" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Endereço
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="endereco.bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Talatona" {...field} />
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
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Rua X" {...field} />
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
                <FormLabel>Ponto de Referência</FormLabel>
                <FormControl>
                  <Input placeholder="Próximo ao Shopping" {...field} />
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
                <FormLabel>Município</FormLabel>
                <FormControl>
                  <AsyncFancySelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    endpoint="/organizacao/municipios"
                    valueField="id"
                    displayField="nome"
                    placeholder="Selecione o município"
                    searchable
                    searchField="nome"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "A guardar..." : "Guardar alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
