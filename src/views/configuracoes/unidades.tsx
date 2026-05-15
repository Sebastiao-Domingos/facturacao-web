"use client";

import { useState } from "react";
import {
  Ruler,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import { useUnidades } from "@/src/hooks/configuracao/use-unidade";
import { ErrorComponent } from "@/components/error-component";
import { Loader } from "@/components/loader";

export default function UnidadesPage() {
  const { data: unidades, isLoading, isError } = useUnidades();

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar unidades"
        description="Erro ao carregar unidades, verificar se o servidor está online"
      />
    );
  }

  return (
    <div className="space-y-6">
      <HeaderPage
        title="Unidades de Medida"
        description="Gerencie as unidades de medida utilizadas para os produtos, como kg, litro, unidade, etc."
      >
        <Button className="h-11 gap-2 shadow-lg shadow-primary/20 font-semibold px-6">
          <PackagePlus size={18} />
          Nova(o)
        </Button>
      </HeaderPage>

      <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">Nome da Unidade</TableHead>
              <TableHead className="font-bold">Sigla</TableHead>
              <TableHead className="text-right font-bold pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades?.map((unidade) => (
              <TableRow
                key={unidade.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <TableCell className="font-bold text-sm uppercase tracking-tight">
                  {unidade.nome}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono px-3">
                    {unidade.sigla}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit2 size={14} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 size={14} /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
