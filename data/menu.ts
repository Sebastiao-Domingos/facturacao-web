import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  TrendingUp,
  Receipt,
  Layers,
  MapIcon,
  Home,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  items?: NavItem[];
}

export const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Inventário",
      url: "#",
      icon: Package,
      items: [
        { title: "Lista de Produtos", url: "/produtos", icon: Layers },
        { title: "Categorias", url: "/categorias", icon: Settings },
        { title: "Stock Crítico", url: "/stock-critico", icon: TrendingUp },
      ],
    },
    {
      title: "Vendas",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "PDV - Balcão", url: "/pdv", icon: Store },
        {
          title: "Histórico de Faturas",
          url: "/vendas/historico",
          icon: Receipt,
        },
        {
          title: "Relatórios de Fecho",
          url: "/vendas/relatorios",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Equipa",
      url: "/equipa",
      icon: Users,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
    },
    {
      title: "Localidade",
      url: "/localidade",
      icon: MapIcon,
      items: [
        {
          title: "Provincias",
          url: "/localidade/provincias",
          icon: MapIcon,
        },
        {
          title: "Municipios",
          url: "/localidade/municipios",
          icon: MapIcon,
        },
      ],
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      items: [
        {
          title: "Perfil da Empresa",
          url: "/configuracoes/empresa",
          icon: Store,
        },
        {
          title: "Afiliares",
          url: "/configuracoes/afiliares",
          icon: Home,
        },
        {
          title: "Utilizadores",
          url: "/configuracoes/utilizadores",
          icon: Users,
        },

        {
          title: "Preferências",
          url: "/configuracoes/preferencias",
          icon: Settings,
        },
      ],
    },
  ],
};
