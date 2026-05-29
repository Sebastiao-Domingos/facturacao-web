// src/components/dashboard/UltimasMovimentacoes.tsx
"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { TrendingUp, TrendingDown, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MovimentacaoRecente,
  getTipoMovimentacaoInfo,
  formatarNumero,
} from "../../../schemas/dashboard/dashboard-schema";

interface UltimasMovimentacoesProps {
  data: MovimentacaoRecente[];
}

export function UltimasMovimentacoes({ data }: UltimasMovimentacoesProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma movimentação registada
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Últimas Movimentações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((mov) => {
          const tipoInfo = getTipoMovimentacaoInfo(mov.tipo);
          return (
            <div
              key={mov.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mov.produto_nome}</span>
                  <Badge
                    variant={mov.tipo === "E" ? "default" : "destructive"}
                    className={mov.tipo === "E" ? "bg-emerald-600" : ""}
                  >
                    {mov.tipo === "E" ? "▲" : "▼"} {mov.tipo_display}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {mov.filial_nome}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">
                  {formatarNumero(mov.quantidade)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(mov.data), "dd/MM HH:mm", { locale: pt })}
                </p>
                {mov.operador && (
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <User size={10} />
                    <span>{mov.operador}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
