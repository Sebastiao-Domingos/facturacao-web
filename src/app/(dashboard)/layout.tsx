import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { HeaderTop } from "@/components/header-top";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background selection:bg-primary/10">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <HeaderTop />

          {/* ÁREA DO CONTEÚDO COM EFEITO DE PROFUNDIDADE */}
          <main className="flex-1 overflow-y-auto bg-muted/30 dark:bg-zinc-950/20">
            <div className="mx-auto max-w-400 p-4 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
