"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ChevronRight } from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./nav-user";
import { useAuth } from "@/src/providers/auth-provider";
import { data } from "@/data/menu";

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-r border-border/40 bg-sidebar/50 backdrop-blur-xl"
    >
      {/* Header Corrigido para Centro Perfeito */}
      <SidebarHeader className="h-20 flex flex-row items-center group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 text-primary-foreground">
            <Store size={22} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 transition-all">
              <span className="font-black text-lg tracking-tighter uppercase italic">
                Dimbo DC
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Enterprise
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-2 mb-4 group-data-[collapsible=icon]:hidden">
            Gestão Operacional
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {data.navMain.map((item) => {
              const isActive =
                pathname === item.url || pathname.startsWith(item.url + "/");

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={`h-11 transition-all group-data-[collapsible=icon]:justify-center cursor-pointer ${
                              isActive
                                ? "bg-primary/5 text-primary"
                                : "hover:bg-primary/10"
                            }`}
                          >
                            {item.icon && (
                              <item.icon
                                className={`shrink-0 ${
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            )}
                            <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="group-data-[collapsible=icon]:hidden animate-in slide-in-from-top-1">
                          <SidebarMenuSub className="ml-4 mt-1 border-l border-primary/20 gap-1">
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={
                                    pathname === `${item.url}${subItem.url}`
                                  }
                                >
                                  <Link
                                    href={`${item.url}${subItem.url}`}
                                    className="flex items-center gap-2"
                                  >
                                    {subItem.icon && (
                                      <subItem.icon
                                        size={14}
                                        className="opacity-70 shrink-0"
                                      />
                                    )}
                                    <span className="text-sm font-medium">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`h-11 transition-all group-data-[collapsible=icon]:justify-center ${
                          pathname === item.url
                            ? "bg-primary/5 text-primary ring-1 ring-primary/20"
                            : "hover:bg-primary/10"
                        }`}
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={`shrink-0 ${
                              pathname === item.url
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2 bg-sidebar-accent/30 border-t border-border/40">
        <NavUser user={user!} />

        {!isCollapsed && (
          <div className="flex flex-col items-center gap-1 opacity-40 py-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase">
                Sistema Ativo
              </span>
            </div>
            <span className="text-[8px] font-medium italic">
              Luanda, Angola • v2.0.6
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
