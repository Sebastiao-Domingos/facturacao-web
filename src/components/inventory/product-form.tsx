// components/products/ProductForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, PackagePlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormAsyncFancySelect } from "@/components/select/sync-fancy-select";
import { useState } from "react";

import {
  productSchemaCreate,
  type ProductFormData,
} from "../../schemas/product-schema";
import { useProductMutations } from "@/src/hooks/product/use-products";
import { toast } from "sonner";

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      tipo: "P", // ← Valor padrão: Produto
      categoria: null,
      unidade_medida: null,
      taxa_iva: null,
      preco_venda: 0,
      ref_interna: "",
      ativo: false,
    },
  });

  const { createMutation } = useProductMutations();

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

    createMutation.mutateAsync(formData);
  };

  // ==================== IMAGE HANDLING ====================
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
    setOpen(false);
    reset();
    setPreview(null);
    setImageFile(null);
  };

  const ativo = watch("ativo");
  const tipo = watch("tipo");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6">
          <PackagePlus size={18} />
          Novo(a)
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Novo Produto / Serviço
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo item.
          </DialogDescription>
          <div className="text-xs text-red-500 text-center">
            * Campos marcados são obrigatórios
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Erro Geral */}
          {(Object.keys(errors).length > 0 || createMutation.isError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createMutation.isError
                  ? "Erro ao salvar. Verifique os dados."
                  : "Por favor, corrija os erros abaixo."}
              </AlertDescription>
            </Alert>
          )}

          {/* Tipo de Produto - Novo Campo */}
          <div className="space-y-1">
            <Label>
              Tipo <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue("tipo", "P");
                  trigger("tipo");
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                  tipo === "P"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <span className="text-2xl mb-1">📦</span>
                <span className="font-medium">Produto</span>
                <span className="text-xs text-muted-foreground">(P)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue("tipo", "S");
                  trigger("tipo");
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                  tipo === "S"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <span className="text-2xl mb-1">🔧</span>
                <span className="font-medium">Serviço</span>
                <span className="text-xs text-muted-foreground">(S)</span>
              </button>
            </div>
            {errors.tipo && (
              <p className="text-destructive text-xs">{errors.tipo.message}</p>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              {...register("nome")}
              placeholder="Ex: Smartphone XYZ ou Consultoria Fiscal"
              className={cn(errors.nome && "border-destructive")}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>
              Categoria <span className="text-destructive">*</span>
            </Label>
            <FormAsyncFancySelect
              control={control}
              name="categoria"
              endpoint="/faturacao/categorias"
              displayField="nome"
              valueField="id"
              placeholder="Selecione uma categoria"
              searchable
              clearable
              required
            />
            {errors.categoria && (
              <p className="text-destructive text-xs">
                {errors.categoria.message}
              </p>
            )}
          </div>

          {/* Unidade de Medida */}
          <div className="space-y-2">
            <Label>
              Unidade de Medida <span className="text-destructive">*</span>
            </Label>
            <FormAsyncFancySelect
              control={control}
              name="unidade_medida"
              endpoint="/faturacao/unidades-medida"
              displayField="nome"
              valueField="id"
              placeholder="Selecione a unidade"
              searchable
              clearable
              required
            />
            {errors.unidade_medida && (
              <p className="text-destructive text-xs">
                {errors.unidade_medida.message}
              </p>
            )}
          </div>

          {/* Preço + IVA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Preço de Venda <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("preco_venda", { valueAsNumber: true })}
                className={cn(errors.preco_venda && "border-destructive")}
              />
              {errors.preco_venda && (
                <p className="text-destructive text-xs">
                  {errors.preco_venda.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Taxa de IVA <span className="text-destructive">*</span>
              </Label>
              <FormAsyncFancySelect
                control={control}
                name="taxa_iva"
                endpoint="/faturacao/taxa-iva/"
                displayField="descricao"
                valueField="id"
                placeholder="Selecione a taxa"
                searchable
                clearable
                required
              />
              {errors.taxa_iva && (
                <p className="text-destructive text-xs">
                  {errors.taxa_iva.message}
                </p>
              )}
            </div>
          </div>

          {/* Referência Interna */}
          <div className="space-y-2">
            <Label htmlFor="ref_interna">Referência Interna</Label>
            <Input
              id="ref_interna"
              {...register("ref_interna")}
              placeholder="REF-001"
            />
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-xl p-6 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm">Clique para selecionar imagem</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP • Máx. 5MB
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
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {errors.imagem && (
              <p className="text-destructive text-xs">
                {errors.imagem.message}
              </p>
            )}
          </div>

          {/* Ativo */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div>
              <Label className="font-medium">Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Ative para aparecer no catálogo
              </p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={(checked) => setValue("ativo", checked)}
            />
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="min-w-35"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
