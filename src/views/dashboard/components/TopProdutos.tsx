// src/components/dashboard/TopProdutos.tsx
"use client";

import { TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TopProduto,
  formatarMoeda,
} from "../../../schemas/dashboard/dashboard-schema";

interface TopProdutosProps {
  data: TopProduto[];
}

export function TopProdutos({ data }: TopProdutosProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package size={48} className="mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum produto vendido ainda
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((produto, index) => (
          <div key={produto.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{produto.nome}</span>
                <span className="text-xs text-muted-foreground">
                  {produto.codigo}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Vendidos: {produto.quantidade}</span>
                <span>•</span>
                <span>Total: {formatarMoeda(produto.total_vendido)}</span>
              </div>
            </div>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
