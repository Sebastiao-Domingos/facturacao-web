// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
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
  Store,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "O campo utilizador é obrigatório"),
  password: z.string().min(1, "O campo palavra-passe é obrigatório"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

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
      toast.success("Autenticação efetuada com sucesso.");
    } catch (error) {
      toast.error("Erro na autenticação", {
        description: "Utilizador ou palavra-passe incorretos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 bg-background">
      {/* Botão de alternância de tema discreto no topo */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Container Principal Sólido e Corporativo */}
      <div className="w-full max-w-4xl grid lg:grid-cols-2 overflow-hidden rounded-xl border border-border bg-card shadow-md">
        {/* LADO ESQUERDO: Branding Limpo */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/40 border-r border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Store size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">DIMBO DC</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Gestão comercial simplificada.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Controle de faturação, stock e clientes num painel centralizado em
              conformidade com as normas locais.
            </p>
          </div>

          <div className="text-xs text-muted-foreground/60 font-medium">
            &copy; {new Date().getFullYear()} DIMBO DC. Todos os direitos
            reservados.
          </div>
        </div>

        {/* LADO DIREITO: O Formulário Focado */}
        <div className="flex flex-col justify-center p-8 lg:p-12 bg-card">
          <div className="w-full space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Iniciar Sessão
              </h2>
              <p className="text-sm text-muted-foreground">
                Introduza as suas credenciais para aceder ao painel.
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
                    placeholder="ex: joao.silva"
                    className="h-10 pl-9 bg-background border-input rounded-md focus-visible:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs font-medium text-destructive">
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
                    className="text-xs text-primary font-medium hover:underline"
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
                    className="h-10 pl-9 pr-10 bg-background border-input rounded-md focus-visible:ring-primary"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">
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

              {/* Botão de Submissão Estático */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 mt-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>A autenticar...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span>Entrar</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>

            {/* Rodapé de Segurança Simples */}
            <div className="pt-4 flex justify-center border-t border-border/60">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <ShieldCheck size={14} className="text-muted-foreground/80" />
                Conexão cifrada e segura
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
