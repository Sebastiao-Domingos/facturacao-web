// src/app/(dashboard)/financeiro/pagamentos/page.tsx
"use client";

import { useState } from "react";
import { Search, FileText, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import { PagamentoList } from "@/src/schemas/empresa/faturacao/pagamento-schema";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { usePagamentos } from "@/src/hooks/empresa/faturacao/use-pagamento";
import { PagamentoDetailModal } from "@/src/components/faturacao/pagamento-modal";

const METODOS_PAGAMENTO = [
  { value: "todos", label: "Todos" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "MULTICAIXA", label: "Multicaixa" },
  { value: "TRANSFERENCIA", label: "Transferência" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OUTRO", label: "Outro" },
];

export function PagamentosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMetodo, setFilterMetodo] = useState<string>("todos");
  const [filterDocumento, setFilterDocumento] = useState<string>("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Estado para o modal de detalhes
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPagamento, setSelectedPagamento] =
    useState<PagamentoList | null>(null);

  const { data, isLoading, isError } = usePagamentos({
    metodo: filterMetodo !== "todos" ? filterMetodo : undefined,
    documento: filterDocumento || undefined,
    data_inicio: dataInicio || undefined,
    data_fim: dataFim || undefined,
  });

  const pagamentos = data?.results || [];

  const filteredPagamentos = pagamentos.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      p.documento_numero?.toLowerCase().includes(searchLower) ||
      p.documento_cliente_nome?.toLowerCase().includes(searchLower) ||
      p.operador_nome?.toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  const handleViewDetails = (row: PagamentoList) => {
    setSelectedPagamento(row);
    setDetailModalOpen(true);
  };

  const columns: ColumnDef<PagamentoList>[] = [
    {
      accessorKey: "documento_numero",
      header: "Documento",
      sortable: true,
      width: 150,
      cell: (value, row) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono"
          onClick={() =>
            router.push(`/faturacao/documentos/${row.documento_id}`)
          }
        >
          {String(value)}
        </Button>
      ),
    },
    {
      accessorKey: "documento_cliente_nome",
      header: "Cliente",
      sortable: true,
      filterable: true,
    },
    {
      accessorKey: "valor",
      header: "Valor",
      sortable: true,
      width: 150,
      className: "text-right",
      cell: (value) => formatarMoeda(Number(value)),
    },
    {
      accessorKey: "metodo_display",
      header: "Método",
      sortable: true,
      width: 140,
      cell: (value) => <Badge variant="outline">{String(value)}</Badge>,
    },
    {
      accessorKey: "operador_nome",
      header: "Operador",
      sortable: true,
      filterable: true,
      width: 150,
    },
    {
      accessorKey: "data_pagamento",
      header: "Data",
      sortable: true,
      width: 120,
      cell: (value) =>
        format(new Date(String(value)), "dd/MM/yyyy HH:mm", { locale: pt }),
    },
    {
      accessorKey: "referencia",
      header: "Referência",
      sortable: false,
    },
    // Nova coluna de acção
    {
      accessorKey: "id",
      header: "",
      width: 50,
      cell: (_, row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleViewDetails(row)}
          title="Ver detalhes"
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar pagamentos"
        description="Não foi possível carregar a lista de pagamentos. Tente novamente mais tarde."
      />
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <HeaderPage
        title="Pagamentos"
        description="Histórico de pagamentos registados no sistema."
      >
        <Button onClick={() => router.push("/faturacao")}>
          <FileText size={18} className="mr-2" />
          Ver Documentos
        </Button>
      </HeaderPage>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por documento, cliente ou operador..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterMetodo} onValueChange={setFilterMetodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Método" />
          </SelectTrigger>
          <SelectContent>
            {METODOS_PAGAMENTO.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Nº do documento"
          value={filterDocumento}
          onChange={(e) => setFilterDocumento(e.target.value)}
          className="w-[180px]"
        />

        <Input
          type="date"
          placeholder="Data início"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="w-[160px]"
        />
        <Input
          type="date"
          placeholder="Data fim"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          className="w-[160px]"
        />
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="rounded-lg border border-border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <DataTableV2
          data={filteredPagamentos}
          columns={columns}
          rowKey="id"
          selectable={false}
          globalSearch={false}
          showCount={true}
          density="compact"
          emptyMessage="Nenhum pagamento encontrado."
        />
      )}

      {/* Modal de detalhes do pagamento */}
      <PagamentoDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        pagamento={selectedPagamento}
      />
    </div>
  );
}
