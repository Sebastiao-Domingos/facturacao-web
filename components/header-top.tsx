import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Search, Command, ChevronRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeaderTop() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6 transition-colors">
      {/* Lado Esquerdo: Navegação */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" />
        <Separator orientation="vertical" className="h-4 mx-1 bg-border" />

        {/* Breadcrumbs Estilizados */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-md px-1 py-0.5">
            <LayoutGrid size={16} />
            <span>Consola</span>
          </div>
          <ChevronRight size={14} className="text-border" />
          <span className="text-foreground font-bold tracking-tight">
            Dashboard
          </span>
        </nav>
      </div>

      {/* Centro: Barra de Pesquisa "OmniSearch" */}
      <div className="flex-1 flex justify-center max-w-md mx-auto">
        <button className="flex h-10 w-full items-center gap-3 rounded-lg border border-input bg-muted px-4 text-muted-foreground transition-all hover:border-primary/50 hover:bg-accent hover:text-accent-foreground hover:ring-2 hover:ring-ring group">
          <Search
            size={16}
            className="group-hover:text-primary transition-colors"
          />
          <span className="text-sm flex-1 text-left">
            Pesquisar produtos, faturas...
          </span>
          <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command size={10} />K
          </kbd>
        </button>
      </div>

      {/* Lado Direito: Ações e Status */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Status da API/Conexão */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800/50">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Online
          </span>
        </div>

        <TooltipProvider>
          <div className="flex items-center gap-1">
            {/* Notificações */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Bell size={19} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background shadow-[0_0_4px_var(--primary)]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificações</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-1 bg-border" />

            <ThemeToggle />
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
}
