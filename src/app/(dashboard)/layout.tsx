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
      <div className="flex h-screen w-full overflow-hidden bg-background selection:bg-primary/10">
        <AppSidebar />

        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <HeaderTop />

          {/* ÁREA DO CONTEÚDO COM EFEITO DE PROFUNDIDADE */}
          <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 dark:bg-zinc-950/20">
            <div className="container mx-auto h-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
