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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/60 px-6 backdrop-blur-xl transition-all">
      {/* Lado Esquerdo: Navegação */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <Separator orientation="vertical" className="h-4 mx-1" />

        {/* Breadcrumbs Estilizados */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <LayoutGrid size={16} />
            <span>Consola</span>
          </div>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <span className="text-foreground font-bold tracking-tight">
            Dashboard
          </span>
        </nav>
      </div>

      {/* Centro: Barra de Pesquisa "OmniSearch" */}
      <div className="flex-1 flex justify-center max-w-md mx-auto">
        <button className="flex h-10 w-full items-center gap-3 rounded-full border border-border/50 bg-muted/30 px-4 text-muted-foreground transition-all hover:bg-muted/50 hover:ring-2 hover:ring-primary/20 group">
          <Search
            size={16}
            className="group-hover:text-primary transition-colors"
          />
          <span className="text-sm flex-1 text-left">
            Pesquisar produtos, faturas...
          </span>
          <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
            <Command size={10} />K
          </kbd>
        </button>
      </div>

      {/* Lado Direito: Ações e Status */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Status da API/Conexão */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
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
                  className="relative h-9 w-9 rounded-full"
                >
                  <Bell size={19} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificações</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-4 mx-1" />

            <ThemeToggle />
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
}
