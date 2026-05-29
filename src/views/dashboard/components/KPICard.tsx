// src/components/dashboard/KPICard.tsx
"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatarMoeda,
  formatarNumero,
  formatarVariacao,
} from "../../../schemas/dashboard/dashboard-schema";

interface KPICardProps {
  titulo: string;
  valor: number;
  variacao?: number;
  icon?: React.ReactNode;
  formato?: "moeda" | "numero";
  className?: string;
}

export function KPICard({
  titulo,
  valor,
  variacao,
  icon,
  formato = "numero",
  className,
}: KPICardProps) {
  const formatarValor = () => {
    if (formato === "moeda") return formatarMoeda(valor);
    return formatarNumero(valor);
  };

  const VariacaoIcon = () => {
    if (!variacao) return <Minus size={14} />;
    return variacao > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  const VariacaoCor = () => {
    if (!variacao) return "text-muted-foreground";
    return variacao > 0 ? "text-emerald-600" : "text-rose-600";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatarValor()}</div>
        {variacao !== undefined && (
          <p className="mt-1 flex items-center gap-1 text-xs">
            <span className={VariacaoCor()}>
              <VariacaoIcon />
            </span>
            <span className={VariacaoCor()}>{formatarVariacao(variacao)}</span>
            <span className="text-muted-foreground">
              em relação ao mês anterior
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
