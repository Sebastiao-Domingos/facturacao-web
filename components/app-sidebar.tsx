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
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-r border-border bg-sidebar"
    >
      {/* Header */}
      <SidebarHeader className="flex h-20 flex-row items-center px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold">Dimbo DC</span>
              <span className="text-[10px] text-muted-foreground">
                Enterprise
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 px-2 text-[10px] font-semibold uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
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
                            className={cn(
                              "h-11 cursor-pointer transition-all group-data-[collapsible=icon]:justify-center",
                              isActive && "bg-primary/10 text-primary",
                              !isActive && "hover:bg-muted",
                            )}
                          >
                            {item.icon && (
                              <item.icon
                                className={cn(
                                  "shrink-0",
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                              />
                            )}
                            <span className="font-medium group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                          <SidebarMenuSub className="ml-4 mt-1 gap-1 border-l border-border">
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
                                        className="shrink-0"
                                      />
                                    )}
                                    <span className="text-sm">
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
                        className={cn(
                          "h-11 transition-all group-data-[collapsible=icon]:justify-center",
                          pathname === item.url
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted",
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={cn(
                              "shrink-0",
                              pathname === item.url
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                          <span className="font-medium group-data-[collapsible=icon]:hidden">
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

      <SidebarFooter className="border-t border-border bg-sidebar p-2 group-data-[collapsible=icon]:p-2">
        <NavUser user={user!} />

        {!isCollapsed && (
          <div className="mt-2 flex flex-col items-center gap-1 py-1">
            <span className="text-[9px] font-medium uppercase text-muted-foreground">
              Sistema Ativo
            </span>
            <span className="text-[8px] text-muted-foreground">
              Luanda, Angola • v2.0.6
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
