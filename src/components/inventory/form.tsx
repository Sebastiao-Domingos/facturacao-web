// Exemplo de uso em um formulário
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFancySelect } from "@/components/select/fancy-select";
import { FormAsyncFancySelect } from "@/components/select/sync-fancy-select";
import { useState } from "react";

const formSchema = z.object({
  nome: z.string().min(1, "Selecione um país"),
  descricao: z.string().optional(),
  id: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const countries = [
  { value: "br", label: "Brasil", icon: "🇧🇷" },
  { value: "us", label: "Estados Unidos", icon: "🇺🇸" },
  { value: "pt", label: "Portugal", icon: "🇵🇹" },
  { value: "fr", label: "França", icon: "🇫🇷", disabled: true },
];

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      id: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <FormFancySelect
        control={form.control}
        name="nome"
        options={countries}
        label="País"
        placeholder="Selecione um país"
        searchable
        clearable
        required
        helperText="Escolha o país de origem"
      />
      <FormFancySelect
        control={form.control}
        name="descricao"
        options={[
          { value: "sp", label: "São Paulo" },
          { value: "rj", label: "Rio de Janeiro" },
        ]}
        label="Cidade"
        placeholder="Selecione uma cidade"
        size="lg"
        variant="outline"
      />
      // 1. Exemplo básico com API de usuários
      <FormAsyncFancySelect
        control={form.control}
        name="nome"
        endpoint="/organizacao/provincias"
        displayField="nome" // Mostra "João Silva"
        valueField="id" // Retorna "123"
        label="Usuário"
        searchable
        clearable
        required
      />
      // 2. Com busca personalizada
      <FormAsyncFancySelect
        control={form.control}
        name="nome"
        endpoint="/faturacao/produtos"
        displayField="nome"
        valueField="id"
        searchField="nome" // Busca pelo campo "name" na API
        searchDelay={500}
        extraParams={{
          status: "active",
          limit: 20,
        }}
        label="Produto"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Enviar
      </button>
    </form>
  );
}
