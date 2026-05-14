import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header Superior Interno */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              {/* Breadcrumbs podem ir aqui */}
              <span className="text-sm font-medium text-muted-foreground">
                Dashboard
              </span>
            </div>
          </header>

          {/* Área do Conteúdo */}
          <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
