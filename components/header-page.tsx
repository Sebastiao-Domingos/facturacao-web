// src/components/shared/header-page.tsx
"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

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
        "flex flex-col gap-4 border-b border-border pb-4 sm:gap-5 sm:pb-5 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-6",
        className,
      )}
    >
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Ícone com fundo sólido e borda primária */}
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 border-primary/20 bg-primary/10 shadow-sm shrink-0">
            {Icon ? (
              Icon
            ) : (
              <Layers
                size={18}
                className="text-primary sm:size-20 md:size-22"
              />
            )}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">
                {title}
              </h1>
              {hasItemsInfo && (
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs font-semibold tracking-wide px-1.5 py-0.5 sm:px-2"
                >
                  {totalItens}
                </Badge>
              )}
            </div>

            {/* Paginação Compacta */}
            {hasPaginationInfo && (
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                Página{" "}
                <span className="text-primary font-bold">{paginaAtual}</span> de{" "}
                {totalPaginas}
              </span>
            )}
          </div>
        </div>

        {/* Descrição e Contagem de Itens */}
        <div className="max-w-2xl pl-0 sm:pl-[44px] md:pl-[52px]">
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
              {description}
            </p>
          )}

          {hasItemsInfo && totalParcialItens !== undefined && (
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                {totalParcialItens}
              </span>{" "}
              de {totalItens} registos
            </p>
          )}
        </div>
      </div>

      {/* Área de Ações (Children) */}
      <div className="flex w-full items-center gap-2 sm:gap-3 md:w-auto">
        {children}
      </div>
    </div>
  );
}
