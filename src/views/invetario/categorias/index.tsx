// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PackagePlus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorComponent } from "@/components/error-component";
import { Loader } from "@/components/loader";
import { HeaderPage } from "@/components/header-page";
import { useCategorias } from "@/src/hooks/product/use-categoria";
import { CategoryForm } from "@/src/components/inventory/category-form";

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useCategorias({ page });

  if (isLoading) {
    return (
      <Loader message="Por favor, aguarde.Está a carregar os categorias..." />
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar categorias"
        description="Erro ao carregar categorias, verificar se o servidor está online"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Branding Dinâmico */}

      <HeaderPage
        title="Categorias"
        description="Gerencie os categorias do seu inventário"
      >
        <Button
          className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PackagePlus size={18} />
          Adicionar Categoria
        </Button>

        <CategoryForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={() => console.log("Ola como vai!")}
        />
      </HeaderPage>

      {/* Filtros Premium */}
      <div className="flex items-center gap-4 bg-background/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou barras..."
            className="pl-10 h-11 bg-background/50 rounded-xl border-none ring-1 ring-border/50 focus-visible:ring-primary"
          />
        </div>
        {/* Futuros Selects de Categoria aqui */}
      </div>

      {/* Tabela de Elite */}
      <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden backdrop-blur-md shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">Descrição</TableHead>
              <TableHead className="text-right font-bold pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((item, index) => (
              <TableRow
                key={item.id}
                className="hover:bg-primary/5 transition-all group border-border/40"
              >
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>

                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 hover:bg-primary/10"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 rounded-xl"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                        Opções
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer font-medium">
                        Editar Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive">
                        Suspender
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginação Inteligente */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Página {data?.pagina_atual} de {data?.total_paginas}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.links.previous}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.links.next}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
