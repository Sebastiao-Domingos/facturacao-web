// src/components/shared/header-page.tsx
"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Layers, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface HeaderPageProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  totalItens?: number;
  totalParcialItens?: number;
  totalPaginas?: number;
  paginaAtual?: number;
  className?: string;
  Icon?: React.ReactNode;
}

export function HeaderPage({
  title,
  children,
  description,
  totalItens,
  totalParcialItens,
  totalPaginas,
  paginaAtual,
  className,
  Icon,
}: HeaderPageProps) {
  const hasPaginationInfo = totalPaginas && paginaAtual;
  const hasItemsInfo = totalItens !== undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Ícone */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted">
            {Icon && Icon}
            {!Icon && <Layers size={20} className="text-muted-foreground" />}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {hasItemsInfo && (
                <Badge variant="secondary" className="text-xs">
                  {totalItens}
                </Badge>
              )}
            </div>

            {/* Paginação Compacta */}
            {hasPaginationInfo && (
              <span className="text-xs text-muted-foreground">
                Página {paginaAtual} de {totalPaginas}
              </span>
            )}
          </div>
        </div>

        {/* Descrição e Contagem de Itens */}
        <div className="max-w-2xl">
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {hasItemsInfo && totalParcialItens !== undefined && (
            <p className="mt-1 text-sm text-muted-foreground">
              A exibir {totalParcialItens} de {totalItens} registos
            </p>
          )}
        </div>
      </div>

      {/* Área de Ações (Children) */}
      <div className="flex w-full items-center gap-3 md:w-auto">{children}</div>
    </div>
  );
}
