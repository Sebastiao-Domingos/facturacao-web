"use client";
import { useQuery } from "@tanstack/react-query";
import { faturacaoService } from "@/src/services/faturacaoService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "@/components/theme-toggle";

export function ProdutosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => faturacaoService.getProdutos(),
  });

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Gestão de Produtos
          </CardTitle>

          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    A carregar produtos...
                  </TableCell>
                </TableRow>
              ) : (
                data?.results.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img
                        src={p.thumbnail || "/placeholder.png"}
                        alt={p.nome}
                        className="w-12 h-12 rounded object-cover border"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>{p.preco_venda} Kz</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.codigo_barras}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.ativo ? "default" : "destructive"}>
                        {p.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
