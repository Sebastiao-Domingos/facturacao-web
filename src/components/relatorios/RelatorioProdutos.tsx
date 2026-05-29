"use client";

import { useRelatorioProdutos } from "@/src/hooks/empresa/use-dashboard";
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

interface Props {
  dataInicio: Date;
  dataFim: Date;
  filial: string;
  categoria: string;
}

export function RelatorioProdutos({
  dataInicio,
  dataFim,
  filial,
  categoria,
}: Props) {
  const { data, isLoading } = useRelatorioProdutos({
    data_inicio: format(dataInicio, "yyyy-MM-dd"),
    data_fim: format(dataFim, "yyyy-MM-dd"),
    filial: filial || undefined,
    categoria: categoria || undefined,
    limit: 100,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const exportarExcel = () => {
    if (data) exportToExcel(data, "relatorio_produtos");
  };
  const exportarPDF = () => {
    if (data)
      exportToPDF(data, "relatorio_produtos", [
        "nome",
        "codigo",
        "quantidade",
        "total_vendido",
        "valor_iva",
      ]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos mais vendidos</CardTitle>
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
                <TableHead>Produto</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total (Kz)</TableHead>
                <TableHead className="text-right">IVA (Kz)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.codigo}</TableCell>
                  <TableCell className="text-right">{p.quantidade}</TableCell>
                  <TableCell className="text-right">
                    {formatarMoeda(p.total_vendido)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatarMoeda(p.valor_iva)}
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
