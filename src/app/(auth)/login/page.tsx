"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/src/providers/auth-provider";
import { api } from "@/src/services/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedBackground } from "@/components/animated-background";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Store,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Obrigatório"),
  password: z.string().min(1, "Obrigatório"),
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
      toast.success("Bem-vindo ao Futuro!");
    } catch (error) {
      toast.error("Acesso negado", { description: "Credenciais inválidas." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 selection:bg-primary/30">
      <AnimatedBackground />

      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
        {/* LADO ESQUERDO: Branding de Impacto */}
        <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/40 text-white">
              <Store size={28} />
            </div>
            <span className="text-2xl font-black tracking-tight italic">
              DIMBO DC
            </span>
          </motion.div>

          <div className="relative z-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-7xl font-black leading-[0.9] tracking-tighter">
                Evolua o seu <br />
                <span className="bg-linear-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent italic">
                  Negócio
                </span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground/80 max-w-xs font-medium"
            >
              Faturação inteligente e gestão de stock desenhada para a
              excelência angolana.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 w-fit px-4 py-2 rounded-full border border-primary/20"
            >
              <CheckCircle2 size={16} />
              <span>Sincronização em Tempo Real</span>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
            <span>Tecnologia & Inovação</span>
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span>Angola {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* LADO DIREITO: O Formulário Estético */}
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-16 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md">
          <div className="w-full max-w-95 space-y-10">
            <header className="space-y-3 text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight"
              >
                Entrar
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground font-medium"
              >
                Bem-vindo de volta ao seu painel.
              </motion.p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                {/* Input Estilizado: User */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                    Utilizador ou Email
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all" />
                    <Input
                      {...register("identifier")}
                      placeholder="joao.silva"
                      className="h-12 pl-12 bg-background/50 border-white/10 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/50 transition-all rounded-xl"
                    />
                  </div>
                  {errors.identifier && (
                    <span className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                      {errors.identifier.message}
                    </span>
                  )}
                </motion.div>

                {/* Input Estilizado: Pass */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Palavra-passe
                    </Label>
                    <button
                      type="button"
                      className="text-[10px] font-bold text-primary uppercase hover:underline"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all" />
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-12 pr-12 bg-background/50 border-white/10 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Checkbox Moderno */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    id="rem"
                    checked={rememberMe}
                    onCheckedChange={(v) => setValue("rememberMe", !!v)}
                    className="h-5 w-5 rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="rem"
                    className="text-sm font-medium opacity-70 cursor-pointer"
                  >
                    Manter conectado
                  </Label>
                </motion.div>
              </div>

              {/* Botão de Elite */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl text-base font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="l"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>A Validar...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="t"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span>Entrar no Sistema</span>
                        <ArrowRight size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <footer className="pt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-tighter border border-emerald-500/20">
                <ShieldCheck size={12} />
                Proteção AES-256 Ativa
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
