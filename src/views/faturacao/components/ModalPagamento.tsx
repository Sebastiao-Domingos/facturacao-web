// src/components/facturacao/ModalPagamento.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatarMoeda } from "@/src/schemas/dashboard/dashboard-schema";
import { metodoPagamentoConfig } from "@/src/schemas/empresa/faturacao/pagamento-schema";

interface ModalPagamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saldoPendente: number;
  onConfirm: (data: {
    valor: number;
    metodo: string;
    referencia: string;
  }) => void;
  isLoading?: boolean;
}

export function ModalPagamento({
  open,
  onOpenChange,
  saldoPendente,
  onConfirm,
  isLoading = false,
}: ModalPagamentoProps) {
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("DINHEIRO");
  const [referencia, setReferencia] = useState("");

  const handleConfirm = () => {
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      return;
    }
    if (valorNum > saldoPendente) {
      return;
    }
    onConfirm({ valor: valorNum, metodo, referencia });
    setValor("");
    setReferencia("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Valor do Pagamento *</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={saldoPendente}
              placeholder="0.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Saldo pendente: {formatarMoeda(saldoPendente)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento *</Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metodoPagamentoConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.icon} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Referência (opcional)</Label>
            <Input
              placeholder="Nº de referência da transacção"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "A processar..." : "Registrar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
