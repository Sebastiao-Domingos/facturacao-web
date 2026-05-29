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
import { toast } from "sonner";
import { AccessDenied } from "@/src/components/AccessDinied";
import { LoadingSkeleton } from "@/src/components/shared/LoadingSkeleton";
import { HeaderPage } from "@/components/header-page";

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
  const { isAdmin } = usePermissions();

  // Estados locais
  const [density, setDensity] = useState<"compact" | "normal" | "relaxed">(
    "normal",
  );
  const [animations, setAnimations] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

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
  }, []);

  // Guardar preferência e actualizar UI (exemplo)
  const saveDensity = (value: "compact" | "normal" | "relaxed") => {
    setDensity(value);
    localStorage.setItem(STORAGE_KEYS.DENSITY, value);
    // Emitir evento para actualizar DataTableV2 (opcional)
    window.dispatchEvent(new CustomEvent("density-change", { detail: value }));
    toast.success("Densidade actualizada");
  };

  const saveAnimations = (value: boolean) => {
    setAnimations(value);
    localStorage.setItem(STORAGE_KEYS.ANIMATIONS, String(value));
    // Remover/adicionar classe CSS global
    document.documentElement.classList.toggle("disable-animations", !value);
    toast.success(value ? "Animações activadas" : "Animações desactivadas");
  };

  const handleReset = () => {
    localStorage.clear();
    setDensity("normal");
    setAnimations(true);
    setNotifications(true);
    setEmailNotifications(true);
    setStockAlerts(true);
    setTheme("system");
    toast.success("Preferências redefinidas para os valores padrão");
    window.location.reload();
  };

  if (!isAdmin) {
    return <AccessDenied message="Acesso restrito a administradores" />;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <HeaderPage
        title="Preferências"
        description="Configure as suas preferências de sistema e interface"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>
              Personalize a aparência e comportamento da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Claro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Escuro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Sistema</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Densidade da tabela</Label>
              <RadioGroup
                value={density}
                onValueChange={(v) => saveDensity(v as any)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="compact" />
                  <Label htmlFor="compact">Compacta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relaxed" id="relaxed" />
                  <Label htmlFor="relaxed">Confortável</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Activar animações</Label>
                <p className="text-sm text-muted-foreground">
                  Transições suaves e efeitos visuais
                </p>
              </div>
              <Switch checked={animations} onCheckedChange={saveAnimations} />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como pretende receber alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações no browser</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas push durante a navegação
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba resumos e alertas por email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas de stock mínimo</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar quando stock atinge limite
                </p>
              </div>
              <Switch checked={stockAlerts} onCheckedChange={setStockAlerts} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de reset */}
      <Separator />
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Restaurar valores padrão
        </Button>
      </div>
    </div>
  );
}
