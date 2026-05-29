// src/app/(dashboard)/facturacao/nova/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDocumentoMutations } from "@/src/hooks/empresa/use-documento";
import { useStocks } from "@/src/hooks/empresa/afilia/use-stock";
import {
  DocumentoCreate,
  DocumentoCreateSchema,
  TipoDocumento,
} from "@/src/schemas/empresa/faturacao/documento-schema";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";
import { Loader } from "@/components/loader";

interface LinhaFormData {
  produto: string;
  quantidade: number;
  preco_unitario: number;
  desconto_pct?: number;
  taxa_iva?: number;
}

interface DocumentoFormData {
  tipo: TipoDocumento;
  cliente_id: string;
  filial_id: string;
  data_vencimento?: string;
  observacao?: string;
  linhas: LinhaFormData[];
}

export function NovoDocumentoPage() {
  const router = useRouter();
  const { createMutation } = useDocumentoMutations();
  const { data: stocksData, isLoading: isLoadingStocks } = useStocks({
    page_size: 1000,
    page: 1,
    produto__ativo: true,
  });

  const [subtotal, setSubtotal] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [total, setTotal] = useState(0);

  const produtos = stocksData?.results || [];

  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(DocumentoCreateSchema),
    defaultValues: {
      tipo: "FACTURA",
      cliente_id: "",
      filial_id: "",
      linhas: [
        {
          produto: "",
          quantidade: 1,
          preco_unitario: 0,
          desconto_pct: 0,
          taxa_iva: 14,
        },
      ],
      observacao: "",
      data_vencimento: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "linhas",
  });

  const watchLinhas = form.watch("linhas");

  useEffect(() => {
    let newSubtotal = 0;
    let newTotalIva = 0;

    watchLinhas.forEach((linha) => {
      const qtd = linha.quantidade || 0;
      const preco = linha.preco_unitario || 0;
      const desconto = linha.desconto_pct || 0;
      const taxaIva = linha.taxa_iva || 14;

      const subtotalLinha = qtd * preco * (1 - desconto / 100);
      newSubtotal += subtotalLinha;
      newTotalIva += subtotalLinha * (taxaIva / 100);
    });

    setSubtotal(newSubtotal);
    setTotalIva(newTotalIva);
    setTotal(newSubtotal + newTotalIva);
  }, [watchLinhas]);

  const onSubmit = async (data: DocumentoFormData) => {
    try {
      const submitData: DocumentoCreate = {
        cliente_id: data.cliente_id,
        filial_id: data.filial_id,
        tipo: data.tipo,
        data_vencimento: data.data_vencimento,
        observacao: data.observacao,
        linhas: data.linhas
          .filter((linha) => linha.produto)
          .map((linha) => ({
            produto: linha.produto,
            quantidade: Number(linha.quantidade),
            preco_unitario: Number(linha.preco_unitario),
            desconto_pct: Number(linha.desconto_pct || 0),
            taxa_iva: Number(linha.taxa_iva || 14),
          })),
      };

      if (submitData.linhas.length === 0) {
        console.error("Adicione pelo menos um produto");
        return;
      }

      console.log("Dados : ", submitData);

      await createMutation.mutateAsync(submitData);
      router.push("/faturacao/documentos");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddLinha = useCallback(() => {
    append({
      produto: "",
      quantidade: 1,
      preco_unitario: 0,
      desconto_pct: 0,
      taxa_iva: 14,
    });
  }, [append]);

  const handleRemoveLinha = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  if (isLoadingStocks) {
    return <Loader />;
  }

  // Criar um Set para garantir IDs únicos (se houver duplicatas no backend)
  const uniqueProdutos = Array.from(
    new Map(produtos.map((item) => [item?.produto, item])).values(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Documento</h1>
          <p className="text-muted-foreground">
            Preencha os dados do documento fiscal
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Documento *</Label>
                <Select
                  value={form.watch("tipo")}
                  onValueChange={(value) =>
                    form.setValue("tipo", value as TipoDocumento)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FACTURA">Factura</SelectItem>
                    <SelectItem value="PRO_FORMA">Pro-Forma</SelectItem>
                    <SelectItem value="RECIBO">Recibo</SelectItem>
                    <SelectItem value="NOTA_CREDITO">
                      Nota de Crédito
                    </SelectItem>
                    <SelectItem value="NOTA_DEBITO">Nota de Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filial *</Label>
                <Controller
                  control={form.control}
                  name="filial_id"
                  render={({ field }) => (
                    <AsyncFancySelect
                      value={field.value}
                      onChange={field.onChange}
                      endpoint="/organizacao/filiais/"
                      displayField="nome"
                      valueField="id"
                      searchable
                      clearable
                      required
                      placeholder="Selecione uma filial"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Controller
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <AsyncFancySelect
                      value={field.value}
                      onChange={field.onChange}
                      endpoint="/faturacao/clientes/"
                      displayField="nome"
                      valueField="id"
                      searchable
                      clearable
                      required
                      placeholder="Selecione um cliente"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input
                  type="date"
                  value={form.watch("data_vencimento") || ""}
                  onChange={(e) =>
                    form.setValue("data_vencimento", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea
                placeholder="Observações adicionais..."
                value={form.watch("observacao") || ""}
                onChange={(e) => form.setValue("observacao", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Itens do Documento</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLinha}
            >
              <Plus size={14} className="mr-1" />
              Adicionar Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left text-sm font-semibold">
                      Produto
                    </th>
                    <th className="px-2 py-2 text-center text-sm font-semibold w-24">
                      Qtd
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold w-32">
                      Preço
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold w-24">
                      Desconto
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold w-32">
                      Subtotal
                    </th>
                    <th className="px-2 py-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    const quantidade =
                      form.watch(`linhas.${index}.quantidade`) || 0;
                    const preco =
                      form.watch(`linhas.${index}.preco_unitario`) || 0;
                    const desconto =
                      form.watch(`linhas.${index}.desconto_pct`) || 0;
                    const subtotalLinha =
                      quantidade * preco * (1 - desconto / 100);

                    return (
                      <tr key={field.id} className="border-b border-border/50">
                        <td className="px-2 py-2">
                          <Select
                            value={form.watch(`linhas.${index}.produto`) || ""}
                            onValueChange={(value) => {
                              const produto = uniqueProdutos.find(
                                (p) => p?.produto === value,
                              );
                              form.setValue(`linhas.${index}.produto`, value);
                              if (produto) {
                                form.setValue(
                                  `linhas.${index}.preco_unitario`,
                                  Number(
                                    produto.produto_detalhes?.preco_venda,
                                  ) || 0,
                                );
                                form.setValue(`linhas.${index}.taxa_iva`, 14);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {uniqueProdutos && uniqueProdutos.length > 0 ? (
                                uniqueProdutos.map((item) => {
                                  const produtoId = item?.produto;
                                  const produtoNome =
                                    item?.produto_nome || "Produto";

                                  if (!produtoId) return null;

                                  return (
                                    <SelectItem
                                      key={`prod-${produtoId}`}
                                      value={produtoId}
                                    >
                                      {produtoNome}
                                    </SelectItem>
                                  );
                                })
                              ) : (
                                <div className="p-2 text-center text-sm text-muted-foreground">
                                  Nenhum produto encontrado
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            step="1"
                            min="1"
                            value={quantidade}
                            onChange={(e) =>
                              form.setValue(
                                `linhas.${index}.quantidade`,
                                parseFloat(e.target.value),
                              )
                            }
                            className="text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={preco}
                            onChange={(e) =>
                              form.setValue(
                                `linhas.${index}.preco_unitario`,
                                parseFloat(e.target.value),
                              )
                            }
                            className="text-right"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={desconto}
                            onChange={(e) =>
                              form.setValue(
                                `linhas.${index}.desconto_pct`,
                                parseFloat(e.target.value),
                              )
                            }
                            className="text-right"
                          />
                        </td>
                        <td className="px-2 py-2 text-right font-mono">
                          {formatarMoeda(subtotalLinha)}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLinha(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono">{formatarMoeda(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (14%):</span>
                <span className="font-mono">{formatarMoeda(totalIva)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="font-mono">{formatarMoeda(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save size={16} className="mr-2" />
            {createMutation.isPending ? "A processar..." : "Guardar Documento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
