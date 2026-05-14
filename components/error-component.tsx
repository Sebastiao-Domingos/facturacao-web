"use client";

import { LucideProps, PackagePlus } from "lucide-react";
import { Button } from "./ui/button";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface ErrorComponentProps {
  message: string;
  description?: string;
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export function ErrorComponent({
  message,
  description,
  Icon,
}: ErrorComponentProps) {
  return (
    <div className="flex h-100 flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        {Icon ? <Icon /> : <PackagePlus size={40} />}
      </div>
      <h2 className="text-xl font-bold">{message}</h2>
      <p className="text-muted-foreground">
        {description
          ? description
          : "Erro ao carregar os dados, verifica a tua internet!"}
      </p>
      <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
    </div>
  );
}
