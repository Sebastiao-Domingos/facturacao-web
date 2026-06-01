// components/products/ProductForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormAsyncFancySelect } from "@/components/select/sync-fancy-select";
import { useState, useEffect } from "react";

import {
  Product,
  productSchemaCreate,
  type ProductFormData,
} from "../../../../schemas/product-schema";
import { useProductMutations } from "@/src/hooks/product/use-products";
import { toast } from "sonner";
import { FormModal } from "@/src/components/modals/form-model-shared";

interface ProdutoFormProps {
  initialData?: Product;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProdutoForm({
  initialData,
  onSuccess,
  isOpen,
  onOpenChange,
}: ProdutoFormProps) {
  console.log(initialData);
  // Toda a lógica de estado, mutação e validação foi unificada no hook customizado
  const {
    register,
    handleSubmit,
    control,
    errors,
    tipo,
    preview,
    isLoading,
    isError,
    setValue,
    trigger,
    handleImageChange,
    removeImage,
    handleClose,
    onSubmit,
  } = useProdutoForm({ initialData, onOpenChange, onSuccess, isOpen });

  return (
    <FormModal
      item="Produto/Serviço"
      onOpenChange={onOpenChange}
      open={isOpen}
      edit={!!initialData}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        {/* Erro Geral Fiscally Clean */}
        {(Object.keys(errors).length > 0 || isError) && (
          <Alert variant="destructive" className="py-2.5 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">
              {isError
                ? "Erro ao salvar os dados no servidor. Verifique os campos."
                : "A validação falhou. Por favor, corrija os erros assinalados."}
            </AlertDescription>
          </Alert>
        )}

        {/* Tipo de Artigo - Seletor Corporativo Estático */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tipo de Artigo <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setValue("tipo", "P");
                trigger("tipo");
              }}
              className={cn(
                "flex flex-col items-center justify-center p-3 border rounded-xl transition-colors bg-card h-20",
                tipo === "P"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-xl mb-1">📦</span>
              <span className="text-sm">Produto</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("tipo", "S");
                trigger("tipo");
              }}
              className={cn(
                "flex flex-col items-center justify-center p-3 border rounded-xl transition-colors bg-card h-20",
                tipo === "S"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-xl mb-1">🔧</span>
              <span className="text-sm">Serviço</span>
            </button>
          </div>
          {errors.tipo && (
            <p className="text-destructive text-[11px] font-medium mt-1">
              {errors.tipo.message}
            </p>
          )}
        </div>

        {/* Nome */}
        <div className="space-y-1.5">
          <Label
            htmlFor="nome"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Nome do Artigo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Ex: Cimento Portland 42.5R ou Consultoria de TI"
            className={cn(
              "h-10 text-sm rounded-md",
              errors.nome &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.nome && (
            <p className="text-destructive text-[11px] font-medium">
              {errors.nome.message}
            </p>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categoria <span className="text-destructive">*</span>
          </Label>
          <FormAsyncFancySelect
            control={control}
            name="categoria"
            endpoint="/faturacao/categorias/"
            displayField="nome"
            valueField="id"
            placeholder="Selecione uma categoria..."
            searchable
            clearable
            required
          />
          {errors.categoria && (
            <p className="text-destructive text-[11px] font-medium">
              {errors.categoria.message}
            </p>
          )}
        </div>

        {/* Unidade de Medida */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Unidade de Medida <span className="text-destructive">*</span>
          </Label>
          <FormAsyncFancySelect
            control={control}
            name="unidade_medida"
            endpoint="/faturacao/unidades-medida/"
            displayField="nome"
            valueField="id"
            placeholder="Selecione a unidade de medida..."
            searchable
            clearable
            required
          />
          {errors.unidade_medida && (
            <p className="text-destructive text-[11px] font-medium">
              {errors.unidade_medida.message}
            </p>
          )}
        </div>

        {/* Preço de Venda + Taxa de IVA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="preco_venda"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Preço de Venda (AOA) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="preco_venda"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("preco_venda", { valueAsNumber: true })}
              className={cn(
                "h-10 text-sm rounded-md font-mono",
                errors.preco_venda &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {errors.preco_venda && (
              <p className="text-destructive text-[11px] font-medium">
                {errors.preco_venda.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Taxa de IVA / Isenção <span className="text-destructive">*</span>
            </Label>
            <FormAsyncFancySelect
              control={control}
              name="taxa_iva"
              endpoint="/faturacao/taxa-iva/"
              displayField="descricao"
              valueField="id"
              placeholder="Selecione a taxa fiscal..."
              searchable
              clearable
              required
            />
            {errors.taxa_iva && (
              <p className="text-destructive text-[11px] font-medium">
                {errors.taxa_iva.message}
              </p>
            )}
          </div>
        </div>

        {/* Referência Interna */}
        <div className="space-y-1.5">
          <Label
            htmlFor="ref_interna"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Referência Interna / SKU
          </Label>
          <Input
            id="ref_interna"
            {...register("ref_interna")}
            placeholder="Ex: REF-2026-X"
            className="h-10 text-sm rounded-md font-mono"
          />
        </div>

        {/* Upload de Imagem Sólido */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Imagem de Catálogo
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="border border-dashed border-border bg-muted/30 rounded-lg p-4 text-center hover:bg-muted/60 transition-colors">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <p className="text-xs font-medium text-foreground">
                  Carregar imagem do artigo
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP &bull; Até 5MB
                </p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview && (
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <img
                  src={preview}
                  alt="Anexo"
                  className="w-20 h-20 object-cover rounded-md border border-border bg-card"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-md p-1 shadow-sm transition-transform active:scale-95"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          {errors.imagem && (
            <p className="text-destructive text-[11px] font-medium">
              {errors.imagem.message}
            </p>
          )}
        </div>

        {/* Estado Ativo */}
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/40">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold text-foreground">
              Artigo Ativo para Faturação
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Define se este artigo estará visível na emissão de faturas e
              proformas.
            </p>
          </div>
          <Controller
            control={control}
            name="ativo"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-border/60 mt-4">
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-9 text-xs min-w-25 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />A
                processar...
              </>
            ) : initialData ? (
              "Gravar Alterações"
            ) : (
              "Registar Artigo"
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
}

// Hook Customizado Isolado e Corrigido de raiz
interface UseProdutoFormProps {
  initialData?: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function useProdutoForm({
  initialData,
  onOpenChange,
  onSuccess,
  isOpen,
}: UseProdutoFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { createMutation, updateMutation } = useProductMutations();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaCreate),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      tipo: "P",
      categoria: null,
      unidade_medida: null,
      taxa_iva: null,
      preco_venda: 0,
      ref_interna: "",
      ativo: true, // Default corporativo geralmente inicia como ativo
    },
  });

  // Carrega e preenche os dados automaticamente caso seja uma ação de Edição
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          nome: initialData.nome,
          tipo: initialData.tipo || "P",
          categoria: initialData.categoria as any,
          unidade_medida: initialData.unidade_medida as any,
          taxa_iva: initialData.taxa_iva as any,
          preco_venda: Number(initialData.preco_venda),
          ref_interna: initialData.ref_interna || "",
          ativo: initialData.ativo,
        });
        if (typeof initialData.imagem === "string") {
          setPreview(initialData.imagem);
        }
      } else {
        reset({
          nome: "",
          tipo: "P",
          categoria: null,
          unidade_medida: null,
          taxa_iva: null,
          preco_venda: 0,
          ref_interna: "",
          ativo: true,
        });
        setPreview(null);
        setImageFile(null);
      }
    }
  }, [initialData, isOpen, reset]);

  const tipo = watch("tipo");
  const ativo = watch("ativo");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.warning("Formato inválido. Use JPEG, PNG ou WEBP.");
      return;
    }
    if (file.size > maxSize) {
      toast.warning("Imagem muito grande. Máximo 5MB.");
      return;
    }

    setImageFile(file);
    setValue("imagem", file as any);
    setPreview(URL.createObjectURL(file));
    trigger("imagem");
  };

  const removeImage = () => {
    setPreview(null);
    setImageFile(null);
    setValue("imagem", undefined);
    trigger("imagem");
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setImageFile(null);
    onOpenChange(false);
  };

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "imagem" && imageFile) {
          formData.append("imagem", imageFile);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      if (initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: formData,
        });
        toast.success("Artigo atualizado com sucesso.");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Artigo registado com sucesso.");
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    tipo,
    ativo,
    preview,
    isLoading,
    isError,
    setValue,
    trigger,
    handleImageChange,
    removeImage,
    handleClose,
    onSubmit,
  };
}
