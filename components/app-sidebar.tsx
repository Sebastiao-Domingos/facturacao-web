"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Inventário",
      url: "#",
      icon: Package,
      items: [
        { title: "Produtos", url: "/produtos" },
        { title: "Categorias", url: "/categorias" },
        { title: "Stock Crítico", url: "/stock-critico" },
      ],
    },
    {
      title: "Vendas",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Ponto de Venda (PDV)", url: "/pdv" },
        { title: "Histórico", url: "/vendas/historico" },
        { title: "Relatórios", url: "/vendas/relatorios" },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            D
          </div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            DIMBO DC
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {/* Aqui colocaremos o UserMenu mais tarde */}
        <div className="text-[10px] text-center font-bold text-muted-foreground uppercase opacity-50 group-data-[collapsible=icon]:hidden">
          v2.0 • Angola
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
