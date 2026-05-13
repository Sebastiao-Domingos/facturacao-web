import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/src/providers/auth-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // <--- ADICIONA ESTA LINHA AQUI
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                {" "}
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
