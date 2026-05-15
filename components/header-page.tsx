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
}: HeaderPageProps) {
  const hasPaginationInfo = totalPaginas && paginaAtual;
  const hasItemsInfo = totalItens !== undefined;

  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40 mb-8",
        className,
      )}
    >
      {/* Decoração Subtil de Background */}
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full -z-10" />

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Badge de Contexto Visual */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
            <Layers size={20} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-primary">
                {title}
              </h1>
              {hasItemsInfo && (
                <Badge
                  variant="secondary"
                  className="font-black text-[10px] px-2 py-0 h-5 bg-muted/50 border-border/50"
                >
                  {totalItens} TOTAL
                </Badge>
              )}
            </div>

            {/* Paginação Compacta */}
            {hasPaginationInfo && (
              <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                Página {paginaAtual} / {totalPaginas}
              </span>
            )}
          </div>
        </div>

        {/* Descrição e Contagem de Itens */}
        <div className="max-w-2xl">
          {description && (
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {hasItemsInfo && totalParcialItens !== undefined && (
            <p className="mt-1 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-tight">
              A exibir{" "}
              <span className="text-foreground">{totalParcialItens}</span>{" "}
              registos filtrados no sistema
            </p>
          )}
        </div>
      </div>

      {/* Área de Ações (Children) */}
      <div className="flex items-center gap-3 w-full md:w-auto">{children}</div>
    </div>
  );
}
