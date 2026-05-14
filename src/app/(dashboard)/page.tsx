// src/app/(dashboard)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, Users, Wallet } from "lucide-react";

const stats = [
  {
    title: "Vendas de Hoje",
    value: "145.250,00 Kz",
    description: "+12% em relação a ontem",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Produtos em Stock",
    value: "1.240",
    description: "24 itens com stock crítico",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Novos Clientes",
    value: "18",
    description: "Este mês",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "Meta Mensal",
    value: "68%",
    description: "Objetivo: 2.500.000 Kz",
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controlo
        </h1>
        <p className="text-muted-foreground font-medium">
          Bem-vindo ao resumo das suas operações de hoje.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-80">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black tracking-tighter">
                {stat.value}
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {stat.description}
              </p>
              {/* Mini gráfico visual sutil */}
              <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.bg.replace(
                    "/10",
                    ""
                  )} w-[60%] opacity-50`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder para Gráficos Maiores */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 h-[350px] border-border/50 bg-background/50 flex items-center justify-center italic text-muted-foreground">
          [Gráfico de Vendas Semanais]
        </Card>
        <Card className="md:col-span-3 h-[350px] border-border/50 bg-background/50 flex items-center justify-center italic text-muted-foreground">
          [Produtos Mais Vendidos]
        </Card>
      </div>
    </div>
  );
}
