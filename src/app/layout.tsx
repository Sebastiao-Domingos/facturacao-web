// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/src/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/src/providers/auth-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

// Remova as importações do Geist

export const metadata: Metadata = {
  title: "Sistema de Faturação",
  description:
    "Sistema de faturação para gestão de produtos, categorias e vendas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors position="top-right" />
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
