// src/components/funcionarios/FuncionarioForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FuncionarioFormData,
  FuncionarioFormSchema,
  papeis,
} from "@/src/schemas/empresa/afilias/funcionario-schema";
import { useFuncionarioMutations } from "@/src/hooks/empresa/use-funcionario";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FuncionarioFormProps {
  defaultValues?: any;
  onOpenChange: (value: boolean) => void;
  open: boolean;
  onSuccess: () => void;
}

const etapas = [
  { id: 1, nome: "Dados Pessoais", icone: User },
  { id: 2, nome: "Endereço", icone: MapPin },
  { id: 3, nome: "Dados da Conta", icone: Key },
];

const getFirstAndLastName = (nomeCompleto?: string) => {
  if (!nomeCompleto) return { first_name: "", last_name: "" };
  const parts = nomeCompleto.trim().split(" ");
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || "",
  };
};

export function FuncionarioForm({
  defaultValues,
  onOpenChange,
  open,
  onSuccess,
}: FuncionarioFormProps) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const { createMutation, updateMutation } = useFuncionarioMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!defaultValues?.id;

  const { first_name, last_name } = getFirstAndLastName(
    defaultValues?.nome_completo,
  );

  const form = useForm<FuncionarioFormData>({
    resolver: zodResolver(FuncionarioFormSchema),
    defaultValues: {
      first_name: first_name || "",
      last_name: last_name || "",
      email: defaultValues?.email || "",
      bi: defaultValues?.bi || "",
      cargo: defaultValues?.cargo || "",
      telemovel: defaultValues?.telemovel || "",
      papel: defaultValues?.papel || "OPERADOR",
      ativo: defaultValues?.ativo ?? true,
      filial: defaultValues?.filial || "",
      endereco: {
        bairro: defaultValues?.endereco?.bairro || "",
        rua: defaultValues?.endereco?.rua || "",
        ponto_referencia: defaultValues?.endereco?.ponto_referencia || "",
        municipio: defaultValues?.endereco?.municipio || "",
      },
    },
  });

  const totalEtapas = etapas.length;

  const avancarEtapa = async () => {
    let isValid = false;

    if (etapaAtual === 1) {
      isValid = await form.trigger([
        "first_name",
        "last_name",
        "telemovel",
        "cargo",
        "bi",
        "papel",
      ]);
    } else if (etapaAtual === 2) {
      isValid = await form.trigger([
        "endereco.bairro",
        "endereco.rua",
        "endereco.municipio",
      ]);
    } else if (etapaAtual === 3) {
      isValid = await form.trigger("email");

      if (!isEditMode && form.getValues("password")) {
        const passwordValid = await form.trigger([
          "password",
          "confirm_password",
        ]);
        isValid = isValid && passwordValid;
      }
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

  const onSubmit: SubmitHandler<FuncionarioFormData> = async (data) => {
    try {
      // Prepara os dados para envio
      const submitData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        bi: data.bi,
        cargo: data.cargo,
        telemovel: data.telemovel,
        papel: data.papel,
        ativo: data.ativo,
        filial: data.filial,
        endereco: data.endereco,
      };

      // Adiciona password apenas se fornecida
      if (data.password) {
        Object.assign(submitData, { password: data.password });
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: defaultValues.id,
          data: submitData,
        });
        toast.success("Funcionário actualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Funcionário criado com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
      setEtapaAtual(1);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Erro ao salvar funcionário",
      );
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setEtapaAtual(1);
    }
  }, [open, form]);

  return (
    <FormModal
      item="Funcionário"
      onOpenChange={onOpenChange}
      open={open}
      edit={isEditMode}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  onClick={() => setEtapaAtual(etapa.id)}
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
                            placeholder="923456789"
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
                        <Input placeholder="009876543BG001" {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um papel" />
                        </SelectTrigger>
                        <SelectContent>
                          {papeis.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              <div className="grid grid-cols-1 gap-4">
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
                        <Input placeholder="Rua A" {...field} />
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
                      <FormLabel>Ponto de referência</FormLabel>
                      <FormControl>
                        <Input placeholder="Perto do Kero" {...field} />
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
                        <Input placeholder="Luanda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

                {!isEditMode && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Palavra-passe</FormLabel>
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
                          <FormLabel>Confirmar palavra-passe</FormLabel>
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
                  </>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label className="font-medium">Conta ativa</Label>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("ativo")
                      ? "A conta estará ativa imediatamente"
                      : "A conta será criada mas permanecerá inativa"}
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
              <ChevronLeft size={16} /> Voltar
            </Button>

            {etapaAtual < totalEtapas ? (
              <Button type="button" onClick={avancarEtapa} className="gap-2">
                Avançar <ChevronRight size={16} />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save size={16} />
                {isLoading
                  ? "Guardando..."
                  : isEditMode
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
