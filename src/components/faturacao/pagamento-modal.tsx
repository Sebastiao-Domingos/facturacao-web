// src/components/financeiro/PagamentoDetailModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { DetailField, DetailModal } from "../shared/detail-modal";

interface PagamentoDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pagamento: {
    id: string;
    documento_id: string;
    documento_numero: string;
    documento_cliente_nome: string;
    valor: number;
    metodo_display: string;
    referencia: string | null;
    data_pagamento: string;
    operador_nome: string;
    filial_nome?: string;
    cliente_nif?: string;
  } | null;
}

const fields: DetailField[] = [
  { label: "Documento", key: "documento_numero", type: "text" },
  { label: "Cliente", key: "documento_cliente_nome", type: "text" },
  { label: "Valor", key: "valor", type: "currency" },
  { label: "Método", key: "metodo_display", type: "text" },
  { label: "Referência", key: "referencia", type: "text" },
  { label: "Data do Pagamento", key: "data_pagamento", type: "datetime" },
  { label: "Operador", key: "operador_nome", type: "text" },
  { label: "Filial", key: "filial_nome", type: "text" },
  { label: "NIF do Cliente", key: "cliente_nif", type: "text" },
];

export function PagamentoDetailModal({
  open,
  onOpenChange,
  pagamento,
}: PagamentoDetailModalProps) {
  const router = useRouter();

  const handleVerDocumento = () => {
    if (pagamento?.documento_id) {
      router.push(`/faturacao/documentos/${pagamento.documento_id}`);
      onOpenChange(false);
    }
  };

  const actions = pagamento?.documento_id ? (
    <Button variant="outline" size="sm" onClick={handleVerDocumento}>
      <Eye size={14} className="mr-2" />
      Ver Documento
    </Button>
  ) : null;

  return (
    <DetailModal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Pagamento"
      data={pagamento}
      fields={fields}
      actions={actions}
      className="sm:max-w-md"
    />
  );
}
