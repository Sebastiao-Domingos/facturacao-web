// src/components/dashboard/AlertasStock.tsx
"use client";

import { AlertTriangle, PackageX, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertaStock,
  getStatusInfo,
  formatarNumero,
} from "../../../schemas/dashboard/dashboard-schema";

interface AlertasStockProps {
  data: AlertaStock[];
  onVerStock?: () => void;
}

export function AlertasStock({ data, onVerStock }: AlertasStockProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <AlertTriangle size={24} className="text-emerald-600" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum alerta de stock no momento
            </p>
            <p className="text-xs text-muted-foreground">
              Todos os produtos estão dentro do nível adequado
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const alertasMinimo = data.filter((a) => a.status === "STOCK_MINIMO");
  const alertasEsgotado = data.filter((a) => a.status === "ESGOTADO");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Alertas de Stock</CardTitle>
        <div className="flex gap-2">
          {alertasEsgotado.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <PackageX size={12} />
              {alertasEsgotado.length} Esgotados
            </Badge>
          )}
          {alertasMinimo.length > 0 && (
            <Badge
              variant="outline"
              className="gap-1 border-yellow-500 text-yellow-600"
            >
              <AlertTriangle size={12} />
              {alertasMinimo.length} Stock Mínimo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.slice(0, 10).map((alerta) => (
          <div
            key={alerta.id}
            className="flex items-center justify-between rounded-lg border border-border p-3 transition-all hover:bg-muted/50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{alerta.produto_nome}</span>
                <span className="text-xs text-muted-foreground">
                  {alerta.produto_codigo}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {alerta.filial_nome}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono">
                <span
                  className={
                    alerta.status === "ESGOTADO"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {formatarNumero(alerta.quantidade_atual)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {" "}
                  / {formatarNumero(alerta.stock_minimo)}
                </span>
              </p>
              <Badge
                variant={
                  alerta.status === "ESGOTADO" ? "destructive" : "outline"
                }
                className={
                  alerta.status === "STOCK_MINIMO"
                    ? "border-yellow-500 text-yellow-600"
                    : ""
                }
              >
                {alerta.status === "ESGOTADO" ? "Esgotado" : "Stock Mínimo"}
              </Badge>
            </div>
          </div>
        ))}
        {data.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1"
            onClick={onVerStock}
          >
            Ver todos os {data.length} alertas
            <ArrowRight size={14} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
