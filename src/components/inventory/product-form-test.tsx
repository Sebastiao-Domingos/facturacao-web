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
import { useState, useEffect } from "react";
import {
  productSchemaCreate,
  ProductFormData,
} from "../../schemas/product-schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface para categorias (ajuste conforme sua API)
interface Categoria {
  id: string;
  nome: string;
}

// Interface para unidades de medida (ajuste conforme sua API)
interface UnidadeMedida {
  id: string;
  nome: string;
  sigla: string;
}

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadeMedida[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    trigger,
    clearErrors,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaCreate),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      nome: "",
      tipo: undefined,
      imagem: undefined,
      categoria: null,
      unidade_medida: null,
      taxa_iva: null,
      preco_venda: null,
      ref_interna: "",
      ativo: false,
    },
  });

  const imagemFileWatch = watch("imagem");
  const ativoWatch = watch("ativo");

  // Carregar dados necessários ao abrir o modal
  useEffect(() => {
    if (open) {
      // Buscar categorias e unidades de medida da API
      // fetchCategorias();
      // fetchUnidadesMedida();

      // Reset do preview e imagem
      setPreview(null);
      setImageFile(null);
      clearErrors();
    }
  }, [open, clearErrors]);

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();

    // Adiciona todos os campos com validação de tipos
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "imagem" && imageFile instanceof File) {
          formData.append("imagem", imageFile);
        } else if (typeof value === "boolean") {
          formData.append(key, String(value));
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      setIsLoading(true);
      // const response = await fetch("/api/produtos", {
      //   method: "POST",
      //   body: formData,
      // });
      // if (!response.ok) throw new Error("Erro ao cadastrar produto");

      console.log("Dados enviados (FormData):", Object.fromEntries(formData));

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Produto cadastrado com sucesso!");
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar produto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validação do arquivo
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Formato de imagem inválido. Use JPEG, PNG ou WEBP.");
        return;
      }

      if (file.size > maxSize) {
        alert("Imagem muito grande. Máximo 5MB.");
        return;
      }

      setImageFile(file);
      setValue("imagem", file);
      setPreview(URL.createObjectURL(file));
      trigger("imagem");
    }
  };

  const removeImage = () => {
    setPreview(null);
    setImageFile(null);
    setValue("imagem", undefined);
    clearErrors("imagem");
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setPreview(null);
    setImageFile(null);
    clearErrors();
  };

  // Formatar moeda em tempo real
  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    const formatted = (Number(number) / 100).toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
    });
    return formatted;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="font-semibold shadow-lg hover:shadow-xl transition-all">
          + Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Cadastrar Novo Produto
          </DialogTitle>
          <DialogDescription>
            Preencha todos os campos obrigatórios para cadastrar um novo produto
            no estoque.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Erro geral do formulário */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor, corrija os erros antes de continuar.
              </AlertDescription>
            </Alert>
          )}

          {/* Nome do Produto - Obrigatório */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="font-semibold">
              Nome do Produto <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              {...register("nome")}
              placeholder="Ex: Smartphone XYZ, Camiseta Algodão..."
              maxLength={100}
              className={cn(
                errors.nome &&
                  "border-destructive focus-visible:ring-destructive",
                dirtyFields.nome && !errors.nome && "border-green-500"
              )}
              aria-invalid={!!errors.nome}
            />
            {errors.nome && (
              <p className="text-destructive text-xs font-medium">
                {errors.nome.message}
              </p>
            )}
            {watch("nome") && !errors.nome && (
              <p className="text-green-600 text-xs">✓ Nome válido</p>
            )}
          </div>

          {/* Descrição */}
          {/* <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register("descricao")}
              placeholder="Descrição detalhada do produto..."
              maxLength={500}
              rows={3}
              className={cn(
                errors.descricao && "border-destructive",
                dirtyFields.descricao && !errors.descricao && "border-green-500"
              )}
            />
            <div className="flex justify-between">
              {errors.descricao && (
                <p className="text-destructive text-xs">
                  {errors.descricao.message}
                </p>
              )}
              {watch("descricao") && (
                <p className="text-muted-foreground text-xs">
                  {watch("descricao").length}/500 caracteres
                </p>
              )}
            </div>
          </div> */}

          {/* Categoria - Select melhorado */}
          <div className="space-y-2">
            <Label htmlFor="categoria">
              Categoria <span className="text-destructive">*</span>
            </Label>
            {/* <Select
              onValueChange={(value) => {
                setValue("categoria", value);
                trigger("categoria");
              }}
            >
              <SelectTrigger
                className={cn(errors.categoria && "border-destructive")}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                <SelectItem value="roupas">Roupas</SelectItem>
                <SelectItem value="alimentos">Alimentos</SelectItem>
                <SelectItem value="moveis">Móveis</SelectItem>
              </SelectContent>
            </Select> */}
            {errors.categoria && (
              <p className="text-destructive text-xs">
                {errors.categoria.message}
              </p>
            )}
          </div>

          {/* Unidade de Medida */}
          <div className="space-y-2">
            <Label htmlFor="unidade_medida">
              Unidade de Medida <span className="text-destructive">*</span>
            </Label>
            {/* <Select
              onValueChange={(value) => {
                setValue("unidade_medida", value);
                trigger("unidade_medida");
              }}
            >
              <SelectTrigger
                className={cn(errors.unidade_medida && "border-destructive")}
              >
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unidade">Unidade (UN)</SelectItem>
                <SelectItem value="kg">Quilograma (KG)</SelectItem>
                <SelectItem value="litro">Litro (L)</SelectItem>
                <SelectItem value="metro">Metro (M)</SelectItem>
                <SelectItem value="par">Par (PR)</SelectItem>
              </SelectContent>
            </Select> */}
            {errors.unidade_medida && (
              <p className="text-destructive text-xs">
                {errors.unidade_medida.message}
              </p>
            )}
          </div>

          {/* Preço e Taxa IVA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_venda">
                Preço de Venda <span className="text-destructive">*</span>
              </Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("preco_venda", { valueAsNumber: true })}
                className={cn(
                  errors.preco_venda && "border-destructive",
                  dirtyFields.preco_venda &&
                    !errors.preco_venda &&
                    "border-green-500"
                )}
              />
              {errors.preco_venda && (
                <p className="text-destructive text-xs">
                  {errors.preco_venda.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxa_iva">
                Taxa IVA (%) <span className="text-destructive">*</span>
              </Label>
              {/* <Select
                onValueChange={(value) => {
                  setValue("taxa_iva", Number(value));
                  trigger("taxa_iva");
                }}
              >
                <SelectTrigger
                  className={cn(errors.taxa_iva && "border-destructive")}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="23">23% Normal</SelectItem>
                  <SelectItem value="13">13% Intermédio</SelectItem>
                  <SelectItem value="6">6% Reduzido</SelectItem>
                  <SelectItem value="0">0% Isento</SelectItem>
                </SelectContent>
              </Select> */}
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
              maxLength={50}
              className={cn(errors.ref_interna && "border-destructive")}
            />
            {errors.ref_interna && (
              <p className="text-destructive text-xs">
                {errors.ref_interna.message}
              </p>
            )}
          </div>

          {/* Imagem com preview e validação */}
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div className="flex items-center gap-4">
              <label
                className={cn(
                  "flex-1 cursor-pointer relative",
                  preview && "opacity-50"
                )}
              >
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP até 5MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!!preview}
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview do produto"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-primary"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90 transition-colors"
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

          {/* Ativo - Switch melhorado */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label className="font-semibold">Produto Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Produtos inativos não aparecem no catálogo
              </p>
            </div>
            <Switch
              checked={ativoWatch}
              onCheckedChange={(checked) => {
                setValue("ativo", checked);
                trigger("ativo");
              }}
            />
          </div>

          {/* Indicador de campos obrigatórios */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            <span className="text-destructive">*</span> Campos obrigatórios
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
              className="font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="font-semibold min-w-[120px]"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Cadastrar Produto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
