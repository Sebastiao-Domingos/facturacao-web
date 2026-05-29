// src/components/clientes/ClienteForm.tsx
"use client";

import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { FormModal } from "@/src/components/modals/form-model-shared";
import {
  clienteFormSchema,
  ClienteFormData,
  tipoOptions,
  defaultClienteValues,
} from "@/src/schemas/empresa/clientes/cliente-schema";
import { useClienteMutations } from "@/src/hooks/empresa/use-clientes";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";

interface ClienteFormProps {
  defaultValues?: any;
  onOpenChange: (value: boolean) => void;
  open: boolean;
  onSuccess: () => void;
}

export function ClienteForm({
  defaultValues,
  onOpenChange,
  open,
  onSuccess,
}: ClienteFormProps) {
  const { createMutation, updateMutation } = useClienteMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!defaultValues?.id;

  // Converter dados da API para formato do formulário
  const getFormDefaultValues = (): ClienteFormData => {
    if (!defaultValues) return defaultClienteValues;

    return {
      tipo: defaultValues.tipo || "P",
      nome: defaultValues.nome || "",
      nif: defaultValues.nif || null,
      email: defaultValues.email || null,
      telefone: defaultValues.telefone || null,
      razao_social: defaultValues.razao_social || null,
      website: defaultValues.website || null,
      bilhete_identidade: defaultValues.bilhete_identidade || null,
      ativo: defaultValues.ativo ?? true,
      endereco: {
        bairro: defaultValues.endereco?.bairro || "",
        rua: defaultValues.endereco?.rua || "",
        ponto_referencia: defaultValues.endereco?.ponto_referencia || "",
        longitude: defaultValues.endereco?.longitude || null,
        latitude: defaultValues.endereco?.latitude || null,
        municipio: defaultValues.endereco?.municipio || "",
      },
    };
  };

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: getFormDefaultValues(),
  });

  const tipo = form.watch("tipo");

  const onSubmit = async (data: ClienteFormData) => {
    try {
      // Remove campos null/empty para envio

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: defaultValues.id,
          data: data,
        });
      } else {
        await createMutation.mutateAsync(data as ClienteFormData);
      }
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset(getFormDefaultValues());
    }
  }, [open, defaultValues]);

  return (
    <FormModal
      item="Cliente"
      onOpenChange={onOpenChange}
      open={open}
      edit={isEditMode}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Linha 1: Tipo e Nome */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {tipoOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`flex items-center justify-center rounded-lg border-2 p-3 transition-all ${
                          field.value === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        tipo === "E" ? "Nome da empresa" : "Nome completo"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Linha 2: Razão Social (E) ou BI (P) + NIF */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tipo === "E" && (
              <FormField
                control={form.control}
                name="razao_social"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Razão social da empresa"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {tipo === "P" && (
              <FormField
                control={form.control}
                name="bilhete_identidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bilhete de Identidade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000000XX000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de identificação fiscal"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Linha 3: Email e Telefone */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="cliente@email.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="923456789"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Website (apenas para empresas) */}
          {tipo === "E" && (
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.empresa.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Endereço</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="endereco.municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Município *</FormLabel>
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

              <FormField
                control={form.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro *</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
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
                    <FormLabel>Rua *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua" {...field} />
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
                      <Input
                        placeholder="Ponto de referência"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label className="font-medium">Cliente Ativo</Label>
              <p className="text-sm text-muted-foreground">
                {form.watch("ativo")
                  ? "O cliente poderá realizar compras e receber documentos fiscais"
                  : "O cliente ficará inativo e não poderá realizar operações"}
              </p>
            </div>
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              <Save size={16} className="mr-2" />
              {isLoading
                ? "Guardando..."
                : isEditMode
                  ? "Actualizar"
                  : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
