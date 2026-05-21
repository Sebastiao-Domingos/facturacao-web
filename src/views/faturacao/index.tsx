// src/app/(dashboard)/facturacao/page.tsx
"use client";

import { useState } from "react";
import { Search, Download, SquarePlus } from "lucide-react";
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
import {
  useDocumentos,
  useDocumentoMutations,
} from "@/src/hooks/empresa/use-documento";

import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";
import DataTableV2, { ColumnDef } from "@/components/table/DataTable-v2";
import {
  DocumentoList,
  getEstadoColor,
  getEstadoLabel,
} from "@/src/schemas/empresa/faturacao/documento-schema";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";

export function DocumentosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  const { data, isLoading, isError } = useDocumentos();
  const { downloadPdfMutation } = useDocumentoMutations();

  const documentos = data?.results || [];

  const filteredDocumentos = documentos.filter((doc) => {
    const matchesSearch =
      searchTerm === "" ||
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "todos" || doc.tipo === filterTipo;
    const matchesEstado =
      filterEstado === "todos" || doc.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const handleView = (doc: DocumentoList) => {
    router.push(`/facturacao/${doc.id}`);
  };

  const handleDownloadPdf = (doc: DocumentoList) => {
    downloadPdfMutation.mutate(doc.id);
  };

  const columns: ColumnDef<DocumentoList>[] = [
    {
      accessorKey: "numero",
      header: "Nº Documento",
      sortable: true,
      width: 150,
      cell: (value) => (
        <span className="font-mono font-medium">{String(value)}</span>
      ),
    },
    {
      accessorKey: "tipo_display",
      header: "Tipo",
      sortable: true,
      width: 120,
    },
    {
      accessorKey: "cliente.nome",
      header: "Cliente",
      sortable: true,
      filterable: true,
    },
    {
      accessorKey: "total",
      header: "Total",
      sortable: true,
      width: 150,
      className: "text-right",
      cell: (value) => formatarMoeda(Number(value)),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      sortable: true,
      width: 150,
      cell: (value) => (
        <Badge className={getEstadoColor(value as any)}>
          {getEstadoLabel(value as any)}
        </Badge>
      ),
    },
    {
      accessorKey: "data_emissao",
      header: "Data",
      sortable: true,
      width: 120,
      cell: (value) =>
        format(new Date(String(value)), "dd/MM/yyyy", { locale: pt }),
    },
  ];

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar documentos"
        description="Não foi possível carregar a lista de documentos. Tente novamente mais tarde."
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <HeaderPage
        title="Documentos Fiscais"
        description="Gerencie facturas, pro-formas, recibos e outros documentos fiscais."
      >
        <Button onClick={() => router.push("/faturacao/nova")}>
          <SquarePlus size={18} className="mr-2" />
          Novo
        </Button>
      </HeaderPage>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por número ou cliente..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="FACTURA">Facturas</SelectItem>
              <SelectItem value="PRO_FORMA">Pro-Formas</SelectItem>
              <SelectItem value="RECIBO">Recibos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os estados</SelectItem>
              <SelectItem value="RASCUNHO">Rascunho</SelectItem>
              <SelectItem value="EMITIDA">Emitida</SelectItem>
              <SelectItem value="PAGA">Paga</SelectItem>
              <SelectItem value="ANULADA">Anulada</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          data={filteredDocumentos}
          columns={columns}
          rowKey="id"
          selectable={false}
          globalSearch={false}
          showCount={true}
          density="compact"
          emptyMessage="Nenhum documento encontrado."
          actions={["view"]}
          onView={handleView}
          customActions={[
            {
              key: "download-pdf",
              label: "Descarregar PDF",
              icon: <Download size={14} />,
              variant: "default",
              onClick: handleDownloadPdf,
            },
          ]}
        />
      )}
    </div>
  );
}
