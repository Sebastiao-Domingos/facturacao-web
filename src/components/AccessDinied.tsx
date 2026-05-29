// src/components/shared/AccessDenied.tsx
"use client";

import { ShieldX, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AccessDeniedProps {
  message?: string;
  description?: string;
  showBackButton?: boolean;
  showDashboardButton?: boolean;
  icon?: React.ReactNode;
}

export function AccessDenied({
  message = "Acesso negado",
  description = "Não tem permissão para aceder a esta página. Contacte o administrador do sistema.",
  showBackButton = true,
  showDashboardButton = true,
  icon,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[70vh] items-center justify-center p-4"
    >
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/20">
            {icon ? (
              <div className="h-10 w-10 text-destructive">{icon}</div>
            ) : (
              <ShieldX className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {message}
          </CardTitle>
          <CardDescription className="mt-2 text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2 text-center text-xs text-muted-foreground">
          <p>Código: 403 • Ação não autorizada</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full gap-2 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Voltar
            </Button>
          )}
          {showDashboardButton && (
            <Button
              onClick={() => router.push("/")}
              className="w-full gap-2 sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Ir para o Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
