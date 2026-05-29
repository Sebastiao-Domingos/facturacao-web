"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LockKeyhole } from "lucide-react";

export default function NotAllowed() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-6">
      <div className="relative flex flex-col items-center text-center max-w-md">
        {/* Background Glow (Red for Danger/Alert) */}
        <div className="absolute -top-10 h-48 w-48 bg-destructive/10 blur-[80px] rounded-full" />

        {/* Shield Icon */}
        <div className="relative mb-8">
          <div className="rounded-full bg-destructive/10 p-8 border border-destructive/20 backdrop-blur-md shadow-2xl">
            <ShieldAlert size={80} className="text-destructive" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background p-2 rounded-lg border border-border shadow-lg">
            <LockKeyhole size={20} className="text-destructive" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
          Acesso Restrito
        </h1>
        <p className="mt-6 text-muted-foreground font-medium leading-relaxed">
          O seu perfil de utilizador não possui privilégios suficientes para
          aceder a esta área. Contacte o administrador se acredita que isto é um
          erro.
        </p>

        {/* Options */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 font-bold uppercase tracking-wider border-border/60"
          >
            <Link href="/suporte">Solicitar Acesso</Link>
          </Button>
          <Button
            asChild
            className="flex-1 h-12 font-bold uppercase tracking-wider bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
          >
            <Link href="/">Ir para o Início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
