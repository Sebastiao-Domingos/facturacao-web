// src/app/(dashboard)/produtos/page.tsx
"use client";

import { useState } from "react";
import { useProducts } from "@/src/hooks/product/use-products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PackagePlus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ImageOff,
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
import { ProductForm } from "@/src/components/inventory/form-test";

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProducts({ page });
  const [isOpen, setIsOpen] = useState(false);

  // Formatador de Moeda Angolana
  const kwanzaFormat = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  });

  if (isLoading) {
    return (
      <Loader message="Por favor, aguarde.Está a carregar os produtos..." />
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar produtos"
        description="Erro ao carregar produtos, verificar se o servidor está online"
      />
    );
  }

  return (
    <div className="space-y-3">
      <HeaderPage
        title="Produtos"
        description="Gerencie os produtos do seu inventário"
      >
        <Button
          className="h-11 gap-2 shadow-xl shadow-primary/20 font-bold px-6"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PackagePlus size={18} />
          Adicionar Produto
        </Button>
        <ProductForm onOpenChange={() => setIsOpen(!isOpen)} isOpen={isOpen} />
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
              <TableHead className="w-100 font-bold py-4">
                Produto / Categoria
              </TableHead>
              <TableHead className="font-bold">Referência</TableHead>
              <TableHead className="font-bold">Preço de Venda</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="text-right font-bold pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-primary/5 transition-all group border-border/40"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/50 border border-border/50 overflow-hidden flex items-center justify-center">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.nome}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <ImageOff className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                        {product.nome}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {product?.categoria_detalhes?.nome || "SEM CATEGORIA"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded border border-border/50">
                    {product.ref_interna || "SEM REF"}
                  </code>
                </TableCell>

                <TableCell className="font-black text-sm tracking-tighter">
                  {kwanzaFormat.format(Number(product.preco_venda))}
                </TableCell>

                <TableCell>
                  {product.ativo ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold uppercase text-[9px] tracking-widest"
                    >
                      Ativo
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 font-bold uppercase text-[9px] tracking-widest"
                    >
                      Inativo
                    </Badge>
                  )}
                </TableCell>

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
