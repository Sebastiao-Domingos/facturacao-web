// src/app/(dashboard)/preferencias/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePermissions } from "@/src/hooks/authorition/use-permition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AccessDenied } from "@/src/components/AccessDinied";
import { HeaderPage } from "@/components/header-page";
import {
  Palette,
  BellRing,
  LayoutGrid,
  Sparkles,
  RotateCcw,
  Monitor,
  Sun,
  Moon,
  MonitorSmartphone,
  Zap,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// Chaves para localStorage
const STORAGE_KEYS = {
  DENSITY: "pref_density",
  ANIMATIONS: "pref_animations",
  NOTIFICATIONS: "pref_notifications",
  STOCK_ALERTS: "pref_stock_alerts",
  EMAIL_NOTIFICATIONS: "pref_email_notifications",
};

export function PreferenciasPage() {
  const { theme, setTheme } = useTheme();
  const { isAdmin, isLoading: isPermissionLoading } = usePermissions();

  // Estados locais
  const [density, setDensity] = useState<"compact" | "normal" | "relaxed">(
    "normal",
  );
  const [animations, setAnimations] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedDensity = localStorage.getItem(STORAGE_KEYS.DENSITY) as
      | "compact"
      | "normal"
      | "relaxed";
    if (savedDensity) setDensity(savedDensity);
    const savedAnimations = localStorage.getItem(STORAGE_KEYS.ANIMATIONS);
    if (savedAnimations !== null) setAnimations(savedAnimations === "true");
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (savedNotifications !== null)
      setNotifications(savedNotifications === "true");
    const savedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS);
    if (savedEmail !== null) setEmailNotifications(savedEmail === "true");
    const savedStock = localStorage.getItem(STORAGE_KEYS.STOCK_ALERTS);
    if (savedStock !== null) setStockAlerts(savedStock === "true");
    setIsLoaded(true);
  }, []);

  // Guardar densidade
  const saveDensity = (value: "compact" | "normal" | "relaxed") => {
    setDensity(value);
    localStorage.setItem(STORAGE_KEYS.DENSITY, value);
    window.dispatchEvent(new CustomEvent("density-change", { detail: value }));
    toast.success("Densidade actualizada", {
      icon: <CheckCircle2 size={16} className="text-primary" />,
    });
  };

  // Guardar animações
  const saveAnimations = (value: boolean) => {
    setAnimations(value);
    localStorage.setItem(STORAGE_KEYS.ANIMATIONS, String(value));
    document.documentElement.classList.toggle("disable-animations", !value);
    toast.success(value ? "Animações activadas" : "Animações desactivadas", {
      icon: <Sparkles size={16} className="text-primary" />,
    });
  };

  // Guardar outras preferências
  const savePreference = (key: string, value: boolean, message: string) => {
    localStorage.setItem(key, String(value));
    toast.success(message, {
      icon: <CheckCircle2 size={16} className="text-primary" />,
    });
  };

  // Reset total
  const handleReset = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setDensity("normal");
    setAnimations(true);
    setNotifications(true);
    setEmailNotifications(true);
    setStockAlerts(true);
    setTheme("system");
    document.documentElement.classList.remove("disable-animations");
    toast.success("Preferências restauradas com sucesso", {
      icon: <RotateCcw size={16} className="text-primary" />,
    });
    window.location.reload();
  };

  // Estado de carregamento
  if (isPermissionLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        <HeaderPage
          title="Preferências"
          description="Configure as suas preferências de sistema e interface"
          Icon={<Palette size={22} />}
        />
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-5 w-28 bg-muted rounded" />
              <div className="h-4 w-56 bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-lg" />
              ))}
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Acesso negado
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 sm:p-6">
        <AccessDenied message="Acesso restrito a administradores" />
      </div>
    );
  }

  // Tema atual formatado
  const themeLabel =
    theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Sistema";

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <HeaderPage
        title="Preferências"
        description="Configure as suas preferências de sistema e interface"
        Icon={<Palette size={22} />}
      >
        <Badge
          variant="secondary"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
        >
          <MonitorSmartphone size={14} />
          Tema: {themeLabel}
        </Badge>
      </HeaderPage>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* ── Card: Interface ── */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid size={18} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Interface</CardTitle>
            </div>
            <CardDescription>
              Personalize a aparência e comportamento da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Tema */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun size={15} className="text-muted-foreground" />
                <Label className="font-semibold">Tema</Label>
              </div>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-2"
              >
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center gap-1.5 rounded-lg border-2 border-border bg-muted/50 p-3 cursor-pointer hover:border-primary/40 hover:bg-accent transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:text-primary"
                >
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="sr-only"
                  />
                  <Sun size={18} />
                  <span className="text-xs font-medium">Claro</span>
                </Label>
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center gap-1.5 rounded-lg border-2 border-border bg-muted/50 p-3 cursor-pointer hover:border-primary/40 hover:bg-accent transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:text-primary"
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon size={18} />
                  <span className="text-xs font-medium">Escuro</span>
                </Label>
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center gap-1.5 rounded-lg border-2 border-border bg-muted/50 p-3 cursor-pointer hover:border-primary/40 hover:bg-accent transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:text-primary"
                >
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="sr-only"
                  />
                  <Monitor size={18} />
                  <span className="text-xs font-medium">Sistema</span>
                </Label>
              </RadioGroup>
            </div>

            <Separator />

            {/* Densidade */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LayoutGrid size={15} className="text-muted-foreground" />
                <Label className="font-semibold">Densidade da tabela</Label>
              </div>
              <RadioGroup
                value={density}
                onValueChange={(v) => saveDensity(v as any)}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: "compact", label: "Compacta", icon: LayoutGrid },
                  { value: "normal", label: "Normal", icon: LayoutGrid },
                  { value: "relaxed", label: "Confortável", icon: LayoutGrid },
                ].map(({ value, label, icon: Icon }) => (
                  <Label
                    key={value}
                    htmlFor={value}
                    className="flex flex-col items-center gap-1.5 rounded-lg border-2 border-border bg-muted/50 p-3 cursor-pointer hover:border-primary/40 hover:bg-accent transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:text-primary"
                  >
                    <RadioGroupItem
                      value={value}
                      id={value}
                      className="sr-only"
                    />
                    <Icon size={18} />
                    <span className="text-xs font-medium">{label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Animações */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <Label className="font-semibold">Animações</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Transições suaves e efeitos visuais na interface
                  </p>
                </div>
              </div>
              <Switch
                checked={animations}
                onCheckedChange={saveAnimations}
                className="shrink-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Card: Notificações ── */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BellRing size={18} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Notificações</CardTitle>
            </div>
            <CardDescription>
              Configure como pretende receber alertas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: STORAGE_KEYS.NOTIFICATIONS,
                state: notifications,
                setState: setNotifications,
                icon: Zap,
                label: "Notificações no browser",
                description: "Alertas push durante a navegação no sistema",
              },
              {
                key: STORAGE_KEYS.EMAIL_NOTIFICATIONS,
                state: emailNotifications,
                setState: setEmailNotifications,
                icon: Mail,
                label: "Notificações por email",
                description:
                  "Receba resumos e alertas directamente no seu email",
              },
              {
                key: STORAGE_KEYS.STOCK_ALERTS,
                state: stockAlerts,
                setState: setStockAlerts,
                icon: AlertTriangle,
                label: "Alertas de stock mínimo",
                description:
                  "Notificar automaticamente quando o stock atinge o limite mínimo",
              },
            ].map(
              ({ key, state, setState, icon: Icon, label, description }) => (
                <div key={key}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div>
                        <Label className="font-semibold">{label}</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={state}
                      onCheckedChange={(v) => {
                        setState(v);
                        savePreference(
                          key,
                          v,
                          `${label} ${v ? "activadas" : "desactivadas"}`,
                        );
                      }}
                      className="shrink-0"
                    />
                  </div>
                  {key !== STORAGE_KEYS.STOCK_ALERTS && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Botão de Reset ── */}
      <Separator className="bg-border" />
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto gap-2 border-border hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive transition-all group"
        >
          <RotateCcw
            size={15}
            className="group-hover:text-destructive transition-colors"
          />
          Restaurar valores padrão
        </Button>
      </div>
    </div>
  );
}
