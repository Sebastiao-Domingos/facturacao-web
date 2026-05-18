// src/components/forms/taxa-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Funcionario,
  FuncionarioSchema,
} from "@/src/schemas/empresa/afilias/funcionario-schema";
import { useFuncionarioMutations } from "@/src/hooks/empresa/use-funcionario";
import { FormFancySelect } from "@/components/select/fancy-select";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";

interface FuncionarioFormProps {
  defaultValues?: Funcionario;
  onOpenChange: (value: boolean) => void;
  open: boolean;
}

const papeis = [
  { value: "SUPERADMIN", label: "Administrador" },
  { value: "ADMIN", label: "Administrador de Filial" },
  { value: "GESTOR", label: "Gestor de Filial" },
  { value: "OPERADOR", label: "Operador de Caixa" },
  { value: "CONTABITISTA", label: "Contabilista" },
];

export function FuncionarioForm({
  defaultValues,
  onOpenChange,
  open,
}: FuncionarioFormProps) {
  const { onSubmit, isLoading } = useFormFuncionario({
    defaultData: defaultValues,
  });
  const [ativo, setAtivo] = useState(false);

  const form = useForm<Funcionario>({
    resolver: zodResolver(FuncionarioSchema),
    defaultValues: {},
  });

  return (
    <FormModal item="Funcionário" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Primeiro nome <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sebastião"
                      {...field}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ultimo nome <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pedro / Pedro da Costa"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nº de Telefone <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="934656675" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cargo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="CEO, Supervisionador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    NIF/BI <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="xxxxxxxxxBGxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="papel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Papel <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <FormFancySelect
                      control={form.control}
                      options={papeis}
                      placeholder="Selecione um Papel"
                      searchable
                      clearable
                      required
                      helperText="Escolha o papel do funcionário"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                        endpoint={
                          form.watch("endereco.provincia_id")
                            ? `/organizacao/municipios?provincia=${form.watch("endereco.provincia_id")}`
                            : "/organizacao/municipios"
                        }
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

          <Label>Conta do usuário</Label>

          <div className="space-y-1 grid grid-cols-1 md:grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="xxxxxxxxxxxxxxxxx@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Palavra Passe <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder=".........."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmar a Palavra passe{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder=".........." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descrição */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <Label className="font-medium">Conta ativa</Label>
              <p className="text-sm text-red-800">
                Seleciona caso queira activar a conta
              </p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={(checked) => {
                setAtivo(checked);

                form.setValue("ativo", checked);
              }}
            />
          </div>

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

function useFormFuncionario({
  defaultData,
}: { defaultData?: Funcionario } = {}) {
  const { createMutation, updateMutation } = useFuncionarioMutations();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: Funcionario) => {
    if (defaultData) {
      data.id = defaultData?.id;
      updateMutation.mutateAsync({ data });

      return;
    }

    createMutation.mutateAsync(data);
  };

  return { onSubmit, isLoading };
}
