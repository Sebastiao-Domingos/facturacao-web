// src/components/relatorios/RelatorioClientes.tsx
"use client";

import { useRelatorioClientes } from "@/src/hooks/empresa/use-dashboard";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/src/lib/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface RelatorioClientesProps {
  dataInicio: Date;
  dataFim: Date;
  filial: string;
}

export function RelatorioClientes({
  dataInicio,
  dataFim,
  filial,
}: RelatorioClientesProps) {
  const { data, isLoading } = useRelatorioClientes({
    data_inicio: format(dataInicio, "yyyy-MM-dd"),
    data_fim: format(dataFim, "yyyy-MM-dd"),
    filial: filial || undefined,
    limit: 100,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const exportarExcel = () => {
    if (data) exportToExcel(data, "relatorio_clientes");
  };

  const exportarPDF = () => {
    if (data)
      exportToPDF(data, "relatorio_clientes", [
        "nome",
        "nif",
        "email",
        "telefone",
        "total_compras",
        "quantidade_documentos",
      ]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clientes com mais compras</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportarExcel}>
            <Download size={14} className="mr-2" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportarPDF}>
            <Download size={14} className="mr-2" /> PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Total Compras (Kz)</TableHead>
                <TableHead className="text-right">Nº Documentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.nif || "---"}</TableCell>
                  <TableCell>{cliente.email || "---"}</TableCell>
                  <TableCell>{cliente.telefone || "---"}</TableCell>
                  <TableCell className="text-right">
                    {formatarMoeda(cliente.total_compras)}
                  </TableCell>
                  <TableCell className="text-right">
                    {cliente.quantidade_documentos}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
