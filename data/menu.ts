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
  Scale,
  Square,
  SquareSquare,
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
      url: "/invetario",
      icon: Package,
      items: [
        { title: "Produtos", url: "/produtos", icon: Layers },
        { title: "Categorias", url: "/categorias", icon: SquareSquare },
        { title: "Stocks", url: "/stocks", icon: TrendingUp },
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
          url: "/provincias",
          icon: MapIcon,
        },
        {
          title: "Municipios",
          url: "/municipios",
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
          url: "/empresa",
          icon: Store,
        },
        {
          title: "Afiliares",
          url: "/afiliares",
          icon: Home,
        },
        {
          title: "Utilizadores",
          url: "/utilizadores",
          icon: Users,
        },

        {
          title: "Preferências",
          url: "/preferencias",
          icon: Settings,
        },
        {
          title: "Unidades",
          url: "/unidades",
          icon: Square,
        },
        {
          title: "Impostos",
          url: "/impostos",
          icon: Scale,
        },
      ],
    },
  ],
};
