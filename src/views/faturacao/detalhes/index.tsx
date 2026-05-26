// src/app/(dashboard)/facturacao/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  Printer,
  Download,
  CreditCard,
  Ban,
  CheckCircle,
  FileText,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDocumento,
  useDocumentoMutations,
} from "@/src/hooks/empresa/use-documento";

import { ErrorComponent } from "@/components/error-component";
import {
  getEstadoColor,
  getEstadoLabel,
} from "@/src/schemas/empresa/faturacao/documento-schema";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { ModalPagamento } from "../components/ModalPagamento";
import { env } from "process";
import { handleImprimir } from "@/src/helpers/print";

export function DocumentoDetailPage() {
  const { documento: id } = useParams();
  const router = useRouter();
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false);

  const { data: documento, isLoading, isError } = useDocumento(id as string);
  const {
    emitirMutation,
    anularMutation,
    pagamentoMutation,
    downloadPdfMutation,
  } = useDocumentoMutations();

  const handleEmitir = () => {
    if (confirm("Tem certeza que deseja emitir este documento?")) {
      emitirMutation.mutate(id as string);
    }
  };

  const handleAnular = () => {
    if (
      confirm(
        "Tem certeza que deseja anular este documento? Esta ação não pode ser desfeita.",
      )
    ) {
      anularMutation.mutate(id as string);
    }
  };

  const handleRegistrarPagamento = (data: {
    valor: number;
    metodo: string;
    referencia: string;
  }) => {
    pagamentoMutation.mutate({
      id: id as string,
      data: {
        documento_id: id as string,
        valor: data.valor,
        metodo: data.metodo as any,
        referencia: data.referencia,
      },
    });
  };

  const handleDownloadPdf = () => {
    downloadPdfMutation.mutate(id as string);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !documento) {
    return (
      <ErrorComponent
        message="Documento não encontrado"
        description="O documento que procura não existe ou foi removido."
      />
    );
  }

  const podeEmitir = documento.estado === "RASCUNHO";
  const podeAnular =
    documento.estado !== "ANULADA" && documento.estado !== "PAGA";
  const podeRegistrarPagamento =
    documento.estado === "EMITIDA" || documento.estado === "PARCIALMENTE_PAGA";
  const estaPaga = documento.estado === "PAGA";

  return (
    <div className="space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {documento.numero}
              </h1>
              <Badge className={getEstadoColor(documento.estado)}>
                {getEstadoLabel(documento.estado)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {documento.tipo_display} •{" "}
              {format(new Date(documento.data_emissao), "dd/MM/yyyy HH:mm", {
                locale: pt,
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleImprimir({ pdfUrl: `/faturacao/documentos/${id}/pdf/` })
            }
          >
            <Printer size={16} className="mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download size={16} className="mr-2" />
            PDF
          </Button>
          {podeEmitir && (
            <Button
              size="sm"
              onClick={handleEmitir}
              disabled={emitirMutation.isPending}
            >
              <CheckCircle size={16} className="mr-2" />
              {emitirMutation.isPending ? "A processar..." : "Emitir"}
            </Button>
          )}
          {podeAnular && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleAnular}
              disabled={anularMutation.isPending}
            >
              <Ban size={16} className="mr-2" />
              {anularMutation.isPending ? "A processar..." : "Anular"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações do Documento */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Informações do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <FileText size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tipo de Documento</p>
                  <p className="text-sm text-muted-foreground">
                    {documento.tipo_display}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Emissão</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(documento.data_emissao),
                      "dd/MM/yyyy HH:mm",
                      { locale: pt },
                    )}
                  </p>
                </div>
              </div>
              {documento.data_vencimento && (
                <div className="flex items-start gap-3">
                  <Calendar
                    size={18}
                    className="mt-0.5 text-muted-foreground"
                  />
                  <div>
                    <p className="text-sm font-medium">Data de Vencimento</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(documento.data_vencimento),
                        "dd/MM/yyyy",
                        { locale: pt },
                      )}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Filial</p>
                  <p className="text-sm text-muted-foreground">
                    {documento.filial.nome}
                  </p>
                </div>
              </div>
            </div>

            {documento.observacao && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-sm text-muted-foreground">
                    {documento.observacao}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={18} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{documento.cliente.nome}</p>
                <p className="text-sm text-muted-foreground">
                  NIF: {documento.cliente.nif || "---"}
                </p>
                {documento.cliente.email && (
                  <p className="text-sm text-muted-foreground">
                    {documento.cliente.email}
                  </p>
                )}
                {documento.cliente.telefone && (
                  <p className="text-sm text-muted-foreground">
                    {documento.cliente.telefone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Itens do Documento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Itens do Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold w-24">
                    Qtd
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold w-24">
                    Desconto
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                    IVA
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {documento.linhas.map((linha) => (
                  <tr key={linha.id} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{linha.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {linha.produto_codigo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {linha.quantidade.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatarMoeda(linha.preco_unitario)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {linha.desconto_pct}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatarMoeda(linha.valor_iva)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatarMoeda(linha.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-right font-semibold"
                  >
                    Subtotal:
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {formatarMoeda(documento.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-right font-semibold"
                  >
                    IVA:
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {formatarMoeda(documento.total_iva)}
                  </td>
                </tr>
                <tr className="bg-muted/50">
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-right font-bold text-lg"
                  >
                    TOTAL:
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-lg">
                    {formatarMoeda(documento.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagamentos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pagamentos</CardTitle>
            {podeRegistrarPagamento && (
              <Button size="sm" onClick={() => setPagamentoModalOpen(true)}>
                <CreditCard size={14} className="mr-2" />
                Registrar Pagamento
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Total do Documento:
                </span>
                <span className="font-mono font-semibold">
                  {formatarMoeda(documento.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pago:</span>
                <span className="font-mono font-semibold text-emerald-600">
                  {formatarMoeda(documento.total_pago)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Pendente:</span>
                <span className="font-mono font-semibold text-amber-600">
                  {formatarMoeda(documento.saldo_pendente)}
                </span>
              </div>

              <Separator />

              {documento.pagamentos && documento.pagamentos.length > 0 ? (
                <div className="space-y-2">
                  {documento.pagamentos.map((pagamento) => (
                    <div
                      key={pagamento.id}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <span className="font-medium">
                          {pagamento.metodo_display}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(
                            new Date(pagamento.data_pagamento),
                            "dd/MM/yyyy HH:mm",
                            { locale: pt },
                          )}
                        </span>
                      </div>
                      <span className="font-mono">
                        {formatarMoeda(pagamento.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Nenhum pagamento registado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  documento.estado === "PAGA"
                    ? "bg-green-500"
                    : documento.estado === "ANULADA"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              />
              <span className="font-medium">
                {getEstadoLabel(documento.estado)}
              </span>
            </div>

            {!estaPaga && documento.saldo_pendente > 0 && (
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600">
                <p className="text-sm">
                  Aguardando pagamento de{" "}
                  {formatarMoeda(documento.saldo_pendente)}
                </p>
              </div>
            )}

            {estaPaga && (
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
                <p className="text-sm">Documento totalmente pago</p>
              </div>
            )}

            {documento.estado === "ANULADA" && (
              <div className="rounded-lg bg-red-500/10 p-3 text-red-600">
                <p className="text-sm">Documento anulado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Pagamento */}
      <ModalPagamento
        open={pagamentoModalOpen}
        onOpenChange={setPagamentoModalOpen}
        saldoPendente={documento.saldo_pendente}
        onConfirm={handleRegistrarPagamento}
        isLoading={pagamentoMutation.isPending}
      />
    </div>
  );
}
