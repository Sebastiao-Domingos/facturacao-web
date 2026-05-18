// src/components/forms/funcionario-form.tsx
"use client";

import { useState } from "react";
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
import {
  Save,
  User,
  MapPin,
  Key,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import { FormModal } from "@/src/components/modals/form-model-shared";
import {
  Funcionario,
  FuncionarioSchema,
} from "@/src/schemas/empresa/afilias/funcionario-schema";
import { useFuncionarioMutations } from "@/src/hooks/empresa/use-funcionario";
import { FormFancySelect } from "@/components/select/fancy-select";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";
import { cn } from "@/lib/utils";

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
  { value: "CONTABILISTA", label: "Contabilista" },
];

const etapas = [
  { id: 1, nome: "Dados Pessoais", icone: User },
  { id: 2, nome: "Endereço", icone: MapPin },
  { id: 3, nome: "Dados da Conta", icone: Key },
];

export function FuncionarioForm({
  defaultValues,
  onOpenChange,
  open,
}: FuncionarioFormProps) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [ativo, setAtivo] = useState(defaultValues?.ativo ?? false);
  const { onSubmit, isLoading } = useFormFuncionario({
    defaultData: defaultValues,
  });

  const form = useForm<Funcionario>({
    resolver: zodResolver(FuncionarioSchema),
    defaultValues: defaultValues || {},
  });

  const totalEtapas = etapas.length;

  const avancarEtapa = async () => {
    let isValid = false;

    if (etapaAtual === 1) {
      // Validar campos da etapa 1
      isValid = await form.trigger([
        "first_name",
        "last_name",
        "email",
        "telemovel",
        "cargo",
        "bi",
        "papel",
      ]);
    } else if (etapaAtual === 2) {
      // Validar campos da etapa 2 (endereço)
      isValid = await form.trigger([
        "endereco.provincia_id",
        "endereco.municipio",
        "endereco.bairro",
        "endereco.rua",
        "endereco.ponto_referencia",
      ]);
    }

    if (isValid && etapaAtual < totalEtapas) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Função para navegar diretamente para uma etapa (com validação das etapas anteriores)
  const irParaEtapa = async (etapaId: number) => {
    if (etapaId === etapaAtual) return;

    if (etapaId > etapaAtual) {
      // Validar etapas intermediárias
      let isValid = true;

      for (let i = etapaAtual; i < etapaId; i++) {
        if (i === 1) {
          isValid = await form.trigger([
            "first_name",
            "last_name",
            "email",
            "telemovel",
            "cargo",
            "bi",
            "papel",
          ]);
        } else if (i === 2) {
          isValid = await form.trigger([
            "endereco.provincia_id",
            "endereco.municipio",
            "endereco.bairro",
            "endereco.rua",
            "endereco.ponto_referencia",
          ]);
        }

        if (!isValid) break;
      }

      if (isValid) {
        setEtapaAtual(etapaId);
      }
    } else {
      // Navegar para trás não precisa de validação
      setEtapaAtual(etapaId);
    }
  };

  return (
    <FormModal item="Funcionário" onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
            {etapas.map((etapa, index) => (
              <div
                key={etapa.id}
                className={cn(
                  "flex flex-1 items-center gap-2",
                  index < etapas.length - 1 && "relative",
                )}
              >
                <button
                  type="button"
                  onClick={() => irParaEtapa(etapa.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                    etapaAtual === etapa.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <etapa.icone size={16} />
                  <span className="hidden text-sm font-medium sm:inline">
                    {etapa.nome}
                  </span>
                </button>
                {index < etapas.length - 1 && (
                  <ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* ETAPA 1 - Dados Pessoais */}
          {etapaAtual === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primeiro nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Sebastião" {...field} />
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
                      <FormLabel>Último nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Pedro da Costa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telemovel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder="934 656 675"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Cargo *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder="CEO, Supervisor"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>NIF/BI *</FormLabel>
                      <FormControl>
                        <Input placeholder="0098765432BG001" {...field} />
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
                      <FormLabel>Papel *</FormLabel>
                      <FormControl>
                        <FormFancySelect
                          control={form.control}
                          options={papeis}
                          placeholder="Selecione um papel"
                          searchable
                          clearable
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* ETAPA 2 - Endereço */}
          {etapaAtual === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="endereco.provincia_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Província *</FormLabel>
                      <FormControl>
                        <AsyncFancySelect
                          {...field}
                          endpoint="/organizacao/provincias"
                          valueField="id"
                          displayField="nome"
                          searchable
                          searchField="nome"
                          placeholder="Selecione a província"
                        />
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
                      <FormLabel>Município *</FormLabel>
                      <FormControl>
                        <AsyncFancySelect
                          {...field}
                          endpoint={
                            form.watch("endereco.provincia_id")
                              ? `/organizacao/municipios?provincia=${form.watch("endereco.provincia_id")}`
                              : "/organizacao/municipios"
                          }
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
                        <Input placeholder="Rangel, Palanca" {...field} />
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
                        <Input placeholder="Rua A, Rua N/A" {...field} />
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
                      <FormLabel>Ponto de referência *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kero, Shoprite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-5.7879"
                            {...field}
                          />
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
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-5.7879"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3 - Dados da Conta */}
          {etapaAtual === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            type="email"
                            placeholder="funcionario@empresa.com"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Palavra-passe *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar palavra-passe *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status da Conta */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label className="font-medium">Conta ativa</Label>
                  <p className="text-sm text-muted-foreground">
                    {ativo
                      ? "A conta estará ativa imediatamente"
                      : "A conta será criada mas permanecerá inativa"}
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
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between gap-4 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={voltarEtapa}
              disabled={etapaAtual === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Voltar
            </Button>

            {etapaAtual < totalEtapas ? (
              <Button type="button" onClick={avancarEtapa} className="gap-2">
                Avançar
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save size={16} />
                {isLoading
                  ? "Guardando..."
                  : defaultValues
                    ? "Actualizar"
                    : "Guardar"}
              </Button>
            )}
          </div>
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
