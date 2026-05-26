"use client";

import { useVendasPorPeriodo } from "@/src/hooks/empresa/use-dashboard";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface RelatorioVendasProps {
  dataInicio: Date;
  dataFim: Date;
  filial: string;
  agrupamento: string;
}

export function RelatorioVendas({
  dataInicio,
  dataFim,
  filial,
  agrupamento,
}: RelatorioVendasProps) {
  const { data, isLoading } = useVendasPorPeriodo({
    data_inicio: format(dataInicio, "yyyy-MM-dd"),
    data_fim: format(dataFim, "yyyy-MM-dd"),
    filial: filial || undefined,
    agrupamento: agrupamento as any,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const total = data?.reduce((acc, v) => acc + v.total, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas no Período</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total do período:</span>
          <span>{formatarMoeda(total)}</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Total (Kz)</TableHead>
                <TableHead className="text-right">Documentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.periodo}>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell className="text-right">
                    {formatarMoeda(row.total)}
                  </TableCell>
                  <TableCell className="text-right">{row.quantidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
