// src/app/(auth)/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/src/providers/auth-provider";
import { api } from "@/src/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Building2,
  Sparkles,
  FileText,
  Package,
  BarChart3,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  identifier: z.string().min(1, "O campo utilizador é obrigatório"),
  password: z.string().min(1, "O campo palavra-passe é obrigatório"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.clear();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/login/", {
        username: data.identifier,
        password: data.password,
      });
      await login(response.data);
      toast.success("Autenticação efetuada com sucesso.", {
        icon: <Sparkles size={16} className="text-primary" />,
      });
    } catch (error) {
      toast.error("Erro na autenticação", {
        description: "Utilizador ou palavra-passe incorretos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      {/* Grade decorativa de fundo sutil */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--muted)_10%,transparent_70%)] opacity-50" />

      {/* Botão de alternância de tema discreto no topo */}
      <div className="absolute top-3 sm:top-6 right-4 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-5xl grid lg:grid-cols-5 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* ════════════════════════════════════════════════════════
            LADO ESQUERDO: Branding DIMBO DC (40% da largura)
            Fundo neutro com elementos de destaque em vermelho
        ════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-10 xl:p-12 bg-muted/30 border-r border-border relative overflow-hidden">
          {/* Padrão decorativo de fundo — muito sutil */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary blur-3xl" />
          </div>

          {/* Conteúdo do Branding */}
          <div className="relative z-10 space-y-8">
            {/* Logotipo e Nome da Empresa */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 sm:h-14 sm:w-14 items-center justify-center rounded-2xl /bg-primary shadow-md /ring-1 /ring-primary/20">
                <img
                  src="/logo/favicon-32x32.png"
                  alt="Logotipo da empresa SERGAO"
                  className="h-6 w-6 sm:h-7 sm:w-7 object-cover"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  SERGAO, LDA
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide">
                  Digital Solutions
                </p>
              </div>
            </div>

            {/* Mensagem Principal */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-foreground leading-tight">
                Gestão comercial{" "}
                <span className="text-primary">simplificada.</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
                Controle de faturação, stock e clientes num painel centralizado
                em conformidade com as normas locais.
              </p>
            </div>

            {/* Características / Diferenciais */}
            <div className="space-y-4 pt-4">
              {[
                {
                  icon: FileText,
                  title: "Faturação Electrónica",
                  description:
                    "Emissão rápida e conforme a legislação Angolana",
                },
                {
                  icon: Package,
                  title: "Gestão de Stock",
                  description:
                    "Monitorização em tempo real com alertas inteligentes",
                },
                {
                  icon: BarChart3,
                  title: "Relatórios Detalhados",
                  description:
                    "Dashboards e análises para decisões estratégicas",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé do Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">
                &copy; {new Date().getFullYear()} SERGAO,LDA
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
              Todos os direitos reservados
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            LADO DIREITO: Formulário Focado (60% da largura)
        ════════════════════════════════════════════════════════ */}
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-3 bg-card">
          {/* Logotipo compacto para mobile/tablet */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl /bg-primary shadow-md">
              <img
                src="/logo/favicon-32x32.png"
                alt="Logotipo da empresa SERGAO"
                className="h-6 w-6 sm:h-7 sm:w-7 object-cover"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground">
                SERGAO, LDA
              </h2>
              <p className="text-[10px] font-semibold text-primary tracking-wide uppercase">
                Digital Solutions
              </p>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Iniciar Sessão
              </h2>
              <p className="text-sm text-muted-foreground">
                Introduza as suas credenciais para aceder ao painel DIMBO DC.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo Utilizador */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="identifier"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  Utilizador ou Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    {...register("identifier")}
                    placeholder="ex: joao.silva@dimbo.co.ao"
                    className="h-11 pl-10 bg-background border-input rounded-lg focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1">
                    <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Campo Palavra-passe */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Palavra-passe
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-primary font-semibold hover:underline transition-all"
                  >
                    Esqueceu a palavra-passe?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 pl-10 pr-10 bg-background border-input rounded-lg focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1">
                    <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Opção Manter Conectado */}
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(v) => setValue("rememberMe", !!v)}
                  className="rounded border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
                >
                  Manter a sessão iniciada
                </Label>
              </div>

              {/* Botão de Submissão */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>A autenticar...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Entrar</span>
                    <ArrowRight size={17} />
                  </div>
                )}
              </Button>
            </form>

            {/* Rodapé de Segurança */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Conexão segura e cifrada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
