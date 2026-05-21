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
import { useClientes } from "@/src/hooks/empresa/use-clientes";
import { useStocks } from "@/src/hooks/empresa/afilia/use-stock";
import { useAfilia } from "@/src/hooks/empresa/afilia/use-afilia";
import {
  DocumentoCreate,
  DocumentoCreateSchema,
  TipoDocumento,
} from "@/src/schemas/empresa/faturacao/documento-schema";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { AsyncFancySelect } from "@/components/select/sync-fancy-select";

// Tipo para linha do formulário
interface LinhaFormData {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  desconto_pct?: number;
  taxa_iva?: number;
}

// Tipo para o formulário - alinhado com o schema
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
  const { data: clientesData } = useClientes();
  const { data: stocksData } = useStocks();
  const { data: filiaisData } = useAfilia();

  const [subtotal, setSubtotal] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [total, setTotal] = useState(0);

  const clientes = clientesData?.results || [];
  const filiais = filiaisData || [];
  const produtos = stocksData?.results || [];

  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(DocumentoCreateSchema),
    defaultValues: {
      tipo: "FACTURA",
      cliente_id: "",
      filial_id: "",
      linhas: [
        {
          produto_id: "",
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

  // Recalcular totais quando as linhas mudarem
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
      // Transforma os dados para o formato esperado pela API
      const submitData: DocumentoCreate = {
        cliente_id: data.cliente_id,
        filial_id: data.filial_id,
        tipo: data.tipo,
        data_vencimento: data.data_vencimento,
        observacao: data.observacao,
        linhas: data.linhas.map((linha) => ({
          produto_id: linha.produto_id,
          quantidade: Number(linha.quantidade),
          preco_unitario: Number(linha.preco_unitario),
          desconto_pct: Number(linha.desconto_pct || 0),
          taxa_iva: Number(linha.taxa_iva || 14),
        })),
      };
      await createMutation.mutateAsync(submitData);
      router.push("/facturacao");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddLinha = useCallback(() => {
    append({
      produto_id: "",
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

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
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
        {/* Informações do Documento */}
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

        {/* Linhas do Documento */}
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
                          <Controller
                            control={form.control}
                            name={`linhas.${index}.produto_id`}
                            render={({ field: selectField }) => (
                              <Select
                                value={selectField.value}
                                onValueChange={(value) => {
                                  const produto = produtos.find(
                                    (p) => p.produto.id === value,
                                  );
                                  selectField.onChange(value);
                                  if (produto) {
                                    form.setValue(
                                      `linhas.${index}.preco_unitario`,
                                      produto.produto.preco_venda,
                                    );
                                    form.setValue(
                                      `linhas.${index}.taxa_iva`,
                                      14,
                                    );
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {produtos.map((item) => (
                                    <SelectItem
                                      key={item.id}
                                      value={item.produto.id}
                                    >
                                      {item.produto.nome} -{" "}
                                      {item.produto.codigo_barras}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            step="0.001"
                            min="0.001"
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

        {/* Resumo */}
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

        {/* Botões */}
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
