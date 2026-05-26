// src/components/shared/DetailModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  User,
  Building,
  Hash,
  LucideIcon,
} from "lucide-react";

export interface DetailField {
  label: string;
  key: string;
  type?: "text" | "currency" | "date" | "datetime";
  format?: string;
  icon?: LucideIcon; // ícone opcional para o campo
  render?: (value: any, row: any) => React.ReactNode;
}

interface DetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: Record<string, any> | null;
  fields: DetailField[];
  actions?: React.ReactNode;
  className?: string;
  twoColumns?: boolean; // layout em duas colunas
}

const defaultIconMap: Record<string, LucideIcon> = {
  text: FileText,
  currency: CreditCard,
  date: Calendar,
  datetime: Clock,
  user: User,
  building: Building,
  default: Hash,
};

export function DetailModal({
  open,
  onOpenChange,
  title,
  data,
  fields,
  actions,
  className,
  twoColumns = true,
}: DetailModalProps) {
  if (!data) return null;

  const renderValue = (field: DetailField) => {
    const value = data[field.key];
    if (field.render) return field.render(value, data);
    switch (field.type) {
      case "currency":
        return formatarMoeda(Number(value));
      case "date":
        return format(new Date(value), field.format || "dd/MM/yyyy", {
          locale: pt,
        });
      case "datetime":
        return format(new Date(value), field.format || "dd/MM/yyyy HH:mm", {
          locale: pt,
        });
      default:
        return value ?? "—";
    }
  };

  const getIcon = (field: DetailField) => {
    if (field.icon) return field.icon;
    return defaultIconMap[field.type || "text"] || defaultIconMap.default;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className || "sm:max-w-2xl"}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <Separator className="my-2" />

        <div
          className={`
            py-4
            ${twoColumns ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" : "flex flex-col gap-4"}
          `}
        >
          {fields.map((field) => {
            const Icon = getIcon(field);
            return (
              <div
                key={field.key}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="shrink-0 text-muted-foreground">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {field.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium break-words">
                    {renderValue(field)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {actions && (
          <>
            <Separator className="my-2" />
            <div className="flex justify-end gap-2">{actions}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
