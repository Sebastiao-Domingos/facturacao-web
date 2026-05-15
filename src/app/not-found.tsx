"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="relative flex flex-col items-center text-center">
        {/* Background Glow */}
        <div className="absolute -top-24 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />

        {/* Icon */}
        <div className="mb-6 rounded-2xl bg-muted/50 p-6 border border-border/50 backdrop-blur-sm shadow-xl">
          <FileQuestion size={64} className="text-primary animate-pulse" />
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black italic tracking-tighter text-primary/20">
          404
        </h1>
        <h2 className="mt-[-40px] text-3xl font-black uppercase tracking-tight">
          Página não encontrada
        </h2>
        <p className="mt-4 max-w-[400px] text-muted-foreground font-medium">
          O destino que procura parece ter sido movido ou nunca existiu no
          sistema <span className="text-primary font-bold">DIMBO DC</span>.
        </p>

        {/* Action Button */}
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 font-bold shadow-lg shadow-primary/20 gap-2 uppercase tracking-widest transition-all active:scale-95"
          >
            <Link href="/">
              <ChevronLeft size={18} />
              Voltar ao Painel
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
        DIMBO DIGITAL CONTROL • SISTEMA DE GESTÃO
      </div>
    </div>
  );
}
