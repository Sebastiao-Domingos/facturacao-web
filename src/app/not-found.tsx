// src/app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Ícone Estruturado e Sólido */}
        <div className="mb-6 rounded-xl bg-muted border border-border p-5 text-muted-foreground shadow-sm">
          <FileQuestion size={40} />
        </div>

        {/* Bloco de Código de Erro e Título */}
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md mb-3">
          Erro 404
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Página não encontrada
        </h1>

        {/* Descrição Comercial Clara */}
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          O endereço que procura foi movido, eliminado ou não existe no sistema{" "}
          <span className="text-foreground font-semibold">DIMBO DC</span>.
        </p>

        {/* Botão de Ação Clássico */}
        <div className="mt-6 w-full">
          <Button
            asChild
            className="h-10 px-5 font-medium text-sm gap-1.5 shadow-sm w-full sm:w-auto"
          >
            <Link href="/">
              <ChevronLeft size={16} />
              Voltar ao painel principal
            </Link>
          </Button>
        </div>
      </div>

      {/* Rodapé de Marca Simples */}
      <div className="absolute bottom-6 text-[11px] font-medium text-muted-foreground/60 tracking-normal">
        DIMBO DC &bull; Sistema de Faturação e Gestão
      </div>
    </div>
  );
}
