// src/app/(dashboard)/produtos/novo/page.tsx
"use client";

import { useActionState } from "react";
import { createProductAction } from "@/src/actions/products-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProductPage() {
  // state contém o retorno da action (success, message, etc)
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label>Nome do Produto</label>
        <Input name="nome" required />
      </div>

      <div>
        <label>Preço (Kz)</label>
        <Input name="preco" type="number" step="0.01" required />
      </div>

      {state?.message && (
        <p className={state.success ? "text-green-500" : "text-red-500"}>
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "A salvar..." : "Criar Produto"}
      </Button>
    </form>
  );
}
