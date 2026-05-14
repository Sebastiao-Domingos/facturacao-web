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
import { useState } from "react";
import {
  productSchemaCreate,
  ProductFormData,
} from "../../schemas/product-schema"; // ajuste o path

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchemaCreate),
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

  const imagemFile = watch("imagem");

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();

    // Adiciona todos os campos
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "imagem" && value instanceof File) {
          formData.append("imagem", value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      // const response = await fetch("/api/produtos", {
      //   method: "POST",
      //   body: formData,
      // });

      console.log("Dados enviados (FormData):", Object.fromEntries(formData));
      alert("Produto cadastrado com sucesso!");
      setOpen(false);
      reset();
      setPreview(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("imagem", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Produto</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          {/* Imagem */}
          <div>
            <Label>Imagem</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>

          {/* Preço de Venda */}
          <div>
            <Label htmlFor="preco_venda">Preço de Venda</Label>
            <Input
              id="preco_venda"
              type="number"
              step="0.01"
              {...register("preco_venda", { valueAsNumber: true })}
            />
          </div>

          {/* Ref Interna */}
          <div>
            <Label htmlFor="ref_interna">Referência Interna</Label>
            <Input id="ref_interna" {...register("ref_interna")} />
          </div>

          {/* Ativo */}
          <div className="flex items-center gap-2">
            <Switch
              checked={watch("ativo")}
              onCheckedChange={(checked) => setValue("ativo", checked)}
            />
            <Label>Ativo</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
