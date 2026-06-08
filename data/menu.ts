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
  UsersRound,
  UserSquare2Icon,
  BookCheck,
  Palette,
  Locate,
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
      title: "Faturação",
      url: "/faturacao",
      icon: Receipt,
      items: [
        {
          title: "Documentos",
          url: "/documentos",
          icon: BookCheck,
        },
        {
          title: "Pagamentos",
          url: "/pagamentos",
          icon: Scale,
        },
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
    // NOVA SEÇÃO: COMPRAS
    {
      title: "Compras",
      url: "/compras",
      icon: ShoppingCart,
      items: [
        {
          title: "Fornecedores",
          url: "/fornecedores",
          icon: UserSquare2Icon,
        },
        {
          title: "Pedidos de Compra",
          url: "/compras",
          icon: Receipt,
        },
      ],
    },
    {
      title: "Equipa",
      url: "/equipa",
      icon: Users,
      items: [
        {
          title: "Funcionários",
          url: "/funcionarios",
          icon: Users,
        },
        {
          title: "Clientes",
          url: "/clientes",
          icon: UsersRound,
        },
        // Fornecedores removido daqui (já está na seção Compras)
      ],
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
          title: "Provincias e Municípios",
          url: "/provincias",
          icon: Locate,
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
          title: "Filiais",
          url: "/filiais",
          icon: Home,
        },
        {
          title: "Usuários",
          url: "/usuarios",
          icon: Users,
        },
        {
          title: "Preferências",
          url: "/preferencias",
          icon: Palette,
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
