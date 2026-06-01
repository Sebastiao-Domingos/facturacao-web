// src/components/empresa/EmpresaForm.tsx
"use client";

import { useState } from "react";
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
import { Upload, X, Building2, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  EmpresaFormData,
  EmpresaFormSchema,
  Empresa,
} from "@/src/schemas/empresa/empresa-schema";
import { useEmpresaMutations } from "@/src/hooks/empresa/use-empres";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/src/components/modals/form-model-shared";

interface EmpresaFormProps {
  empresa: Empresa;
  onCancel: () => void;
  onSuccess: () => void;
  onOpenChange: (value: boolean) => void;
  open: boolean;
}

export function EmpresaForm({
  empresa,
  onCancel,
  onSuccess,
  onOpenChange,
  open,
}: EmpresaFormProps) {
  const [preview, setPreview] = useState<string | null>(
    empresa.logotipo ? String(empresa.logotipo) : null,
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { updateMutation } = useEmpresaMutations();
  const isPending = updateMutation.isPending;

  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(EmpresaFormSchema),
    defaultValues: {
      nome_fantasia: empresa.nome_fantasia || "",
      razao_social: empresa.razao_social || "",
      nif: empresa.nif || "",
      moeda_padrao: empresa.moeda_padrao || "AOA",
      regime_tributario: empresa.regime_tributario || "",
      logotipo: empresa.logotipo,
      slogan: empresa.slogan || "",
      endereco: {
        bairro: empresa.endereco?.bairro || "",
        rua: empresa.endereco?.rua || "",
        ponto_referencia: empresa.endereco?.ponto_referencia || "",
        municipio: empresa.endereco?.municipio
          ? String(empresa.endereco.municipio)
          : "",
      },
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.warning("Formato inválido. Use JPEG, PNG ou WEBP.");
      return;
    }
    if (file.size > maxSize) {
      toast.warning("Imagem demasiado grande. Máximo 5MB.");
      return;
    }

    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setPreview(null);
  };

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      const formData = new FormData();

      // Adiciona campos normais
      formData.append("nome_fantasia", data.nome_fantasia);
      formData.append("razao_social", data.razao_social);
      formData.append("nif", data.nif);
      formData.append("moeda_padrao", data.moeda_padrao);
      formData.append("regime_tributario", data.regime_tributario);
      formData.append("endereco", JSON.stringify(data.endereco));
      formData.append("slogan", data.slogan || "");

      // ✅ Só adiciona logotipo se houver um novo arquivo
      if (logoFile) {
        formData.append("logotipo", logoFile);
      }

      await updateMutation.mutateAsync({
        id: empresa.id,
        data: formData,
      });
      toast.success("Empresa actualizada com sucesso.");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao actualizar empresa.");
    }
  };

  return (
    <FormModal item="Empresa" edit onOpenChange={onOpenChange} open={open}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Logotipo */}
          <FormField
            control={form.control}
            name="logotipo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Logotipo da Empresa
                </FormLabel>
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <label className="w-full sm:flex-1 cursor-pointer">
                    <div className="border border-dashed border-border bg-muted/30 rounded-lg p-4 text-center hover:bg-muted/60 transition-colors">
                      <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-foreground">
                        Carregar logotipo
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        PNG, JPG, WEBP • Até 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>

                  {preview && (
                    <div className="relative shrink-0 border border-border bg-card p-1 rounded-md">
                      <img
                        src={preview}
                        alt="Logotipo"
                        className="w-20 h-20 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-md p-1 shadow-sm transition-transform active:scale-95"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Dados da Empresa */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dados da Empresa
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nome_fantasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nome da Empresa{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Minha Empresa Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Slogan <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Solucionando problemas"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Razão Social <span className="text-destructive">*</span>
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium">
                      NIF <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000000"
                        className="font-mono"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Moeda Padrão
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AOA"
                        className="uppercase"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Regime Tributário
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Regime Geral" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Endereço */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Endereço Fiscal
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Bairro
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium">Rua</FormLabel>
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
                    <FormLabel className="text-sm font-medium">
                      Ponto de Referência
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium">
                      Município <span className="text-destructive">*</span>
                    </FormLabel>
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
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 text-xs min-w-25 shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />A
                  guardar...
                </>
              ) : (
                "Guardar alterações"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
